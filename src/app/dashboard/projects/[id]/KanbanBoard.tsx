"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus, X, Check } from "lucide-react";
import { deleteTask, reorderTasks, createColumn, deleteColumn } from "../actions";
import KanbanColumn from "./KanbanColumn";
import SortableTaskItem from "./SortableTaskItem";

const DEFAULTS = ["Started", "Pending", "Process", "Completed", "Cancel"];

interface Task {
  id: string;
  name: string;
  detail: string;
  status: string;
  due_date: string | null;
  sort_order: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  columns: string[];
}

export default function KanbanBoard({ project }: { project: Project }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(project.tasks);
  const [columns, setColumns] = useState<string[]>(project.columns);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [columnMode, setColumnMode] = useState<"existing" | "custom">("existing");
  const [selectedStatus, setSelectedStatus] = useState("Started");

  const boardRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Auto-scroll to the rightmost column on mount
  useEffect(() => {
    const el = boardRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    for (const col of columns) {
      groups[col] = tasks
        .filter((t) => t.status === col)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
    return groups;
  }, [tasks, columns]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const prevTasks = tasks;

    let destStatus: string;
    let insertAtIndex: number;

    if (over.data.current?.type === "column") {
      destStatus = over.id as string;
      insertAtIndex = tasks.filter((t) => t.status === destStatus && t.id !== activeId).length;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      destStatus = overTask.status;
      const destCol = tasks.filter((t) => t.status === destStatus && t.id !== activeId);
      const idx = destCol.findIndex((t) => t.id === overTask.id);
      insertAtIndex = idx >= 0 ? idx : destCol.length;
    }

    const sourceStatus = activeTask.status;

    if (sourceStatus === destStatus) {
      const col = tasks.filter((t) => t.status === sourceStatus);
      const oldIdx = col.findIndex((t) => t.id === activeId);
      if (oldIdx === insertAtIndex) return;
      const newCol = arrayMove(col, oldIdx, insertAtIndex);
      const reindexed = newCol.map((t, i) => ({ ...t, sort_order: i }));
      const updates = reindexed.map((t) => ({ id: t.id, sort_order: t.sort_order }));
      setTasks((prev) =>
        prev.map((t) => reindexed.find((r) => r.id === t.id) || t)
      );
      const result = await reorderTasks(updates);
      if (result?.error) setTasks(prevTasks);
    } else {
      const withoutActive = tasks.filter((t) => t.id !== activeId);
      const result: Task[] = [];
      for (const col of columns) {
        let colTasks = withoutActive.filter((t) => t.status === col);
        if (col === destStatus) {
          colTasks.splice(insertAtIndex, 0, {
            ...activeTask,
            status: destStatus,
          });
        }
        colTasks = colTasks.map((t, i) => ({ ...t, sort_order: i }));
        result.push(...colTasks);
      }
      const updates: { id: string; status: string; sort_order: number }[] = [];
      for (const t of result) {
        const orig = tasks.find((x) => x.id === t.id);
        if (!orig || orig.status !== t.status || orig.sort_order !== t.sort_order) {
          updates.push({ id: t.id, status: t.status, sort_order: t.sort_order });
        }
      }
      setTasks(result);
      const serverResult = await reorderTasks(updates);
      if (serverResult?.error) setTasks(prevTasks);
    }
  }

  async function handleAddColumn() {
    const name = columnMode === "existing" ? selectedStatus : newColumnName.trim();
    if (!name || columns.includes(name)) return;
    const prevColumns = columns;
    setColumns((prev) => [...prev, name]);
    setColumnModalOpen(false);
    setNewColumnName("");
    const result = await createColumn(project.id, name);
    if (result?.error) {
      setColumns(prevColumns);
    }
  }

  function openAddCard(columnId: string) {
    router.push(`/dashboard/projects/${project.id}/tasks/new?status=${encodeURIComponent(columnId)}`);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <Link
          href="/dashboard/projects"
          className="mb-2 inline-block text-xs font-bold text-zinc-400 hover:text-pink"
        >
          &larr; Back to Projects
        </Link>
        <h1 className="text-2xl font-black tracking-tighter text-dark">
          {project.name}
        </h1>
        {project.description && (
          <p className="mt-1 text-sm font-bold text-zinc-500">
            {project.description}
          </p>
        )}
      </div>

      <div ref={boardRef} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden rounded-xl bg-zinc-50">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 items-start min-w-max p-4">
            {columns.map((col) => (
              <KanbanColumn
                key={col}
                id={col}
                label={col}
                tasks={groupedTasks[col] || []}
                onAddCard={() => openAddCard(col)}
                onDeleteColumn={async () => {
                  const prevColumns = columns;
                  setColumns((prev) => prev.filter((c) => c !== col));
                  try {
                    await deleteColumn(project.id, col);
                  } catch {
                    setColumns(prevColumns);
                  }
                }}
              >
                {(groupedTasks[col] || []).map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onClick={() => router.push(`/dashboard/projects/${project.id}/tasks/${task.id}`)}
                    onDelete={async () => {
                      const prevTasks = tasks;
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                      try {
                        await deleteTask(task.id);
                      } catch {
                        setTasks(prevTasks);
                      }
                    }}
                  />
                ))}
              </KanbanColumn>
            ))}

            <button
              onClick={() => setColumnModalOpen(true)}
              className="w-72 shrink-0 rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-pink hover:shadow-md"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                <Plus size={16} />
                Add Column
              </span>
            </button>
          </div>
        </DndContext>
      </div>

      {/* Add Column Modal */}
      {columnModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setColumnModalOpen(false);
            setNewColumnName("");
          }}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-dark">Add Column</h3>
              <button
                onClick={() => {
                  setColumnModalOpen(false);
                  setNewColumnName("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-xl border-2 border-zinc-200 p-1 mb-4">
              <button
                type="button"
                onClick={() => setColumnMode("existing")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  columnMode === "existing"
                    ? "bg-pink text-white shadow-sm"
                    : "text-zinc-500 hover:text-dark"
                }`}
              >
                Existing Status
              </button>
              <button
                type="button"
                onClick={() => setColumnMode("custom")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  columnMode === "custom"
                    ? "bg-pink text-white shadow-sm"
                    : "text-zinc-500 hover:text-dark"
                }`}
              >
                Custom
              </button>
            </div>

            {columnMode === "existing" ? (
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-600">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULTS.map((s) => {
                    const active = selectedStatus === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedStatus(s)}
                        className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-bold transition ${
                          active
                            ? "border-pink bg-pink/5 text-pink"
                            : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-dark"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            active
                              ? "border-pink bg-pink text-white"
                              : "border-zinc-300"
                          }`}
                        >
                          {active && <Check size={10} strokeWidth={3} />}
                        </span>
                        {s}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs font-bold text-zinc-400">
                  Column <span className="text-pink">{selectedStatus}</span> — tasks dropped here get status &quot;{selectedStatus}&quot;
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-bold text-zinc-600">Custom Name</label>
                <input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="e.g. To Do, In Progress, Review"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn();
                    if (e.key === "Escape") {
                      setColumnModalOpen(false);
                      setNewColumnName("");
                    }
                  }}
                  className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2.5 text-sm font-bold outline-none transition focus:border-pink"
                />
                <p className="mt-1.5 text-xs font-bold text-zinc-400">
                  Tasks dropped here will get status: <span className="text-pink">{newColumnName || "..."}</span>
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setColumnModalOpen(false);
                  setNewColumnName("");
                }}
                className="flex-1 rounded-full border-2 border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={columnMode === "custom" && !newColumnName.trim()}
                className="flex-1 rounded-full bg-pink px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark disabled:opacity-50"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
