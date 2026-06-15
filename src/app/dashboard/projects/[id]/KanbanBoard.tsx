"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Plus } from "lucide-react";
import { deleteTask, reorderTasks, createColumn } from "../actions";
import KanbanColumn from "./KanbanColumn";
import SortableTaskItem from "./SortableTaskItem";
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
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    for (const col of columns) {
      groups[col] = tasks
        .filter((t) => t.status === col)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
    return groups;
  }, [tasks, columns]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

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
      reorderTasks(updates);
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
      reorderTasks(updates);
    }
  }

  async function addColumn() {
    const name = newColumnName.trim();
    if (!name || columns.includes(name)) return;
    setColumns((prev) => [...prev, name]);
    setNewColumnName("");
    setAddingColumn(false);
    await createColumn(project.id, name);
  }

  function openAddCard(columnId: string) {
    router.push(`/dashboard/projects/${project.id}/tasks/new?status=${encodeURIComponent(columnId)}`);
  }

  return (
    <div className="flex h-full max-h-screen overflow-hidden flex-col">
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

      <div className="flex-1 h-0 overflow-x-scroll overflow-y-hidden bg-zinc-50">
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
              >
                {(groupedTasks[col] || []).map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onClick={() => router.push(`/dashboard/projects/${project.id}/tasks/${task.id}`)}
                    onDelete={() => {
                      setTasks((prev) => prev.filter((t) => t.id !== task.id));
                      deleteTask(task.id);
                    }}
                  />
                ))}
              </KanbanColumn>
            ))}

            {addingColumn ? (
              <div className="w-72 shrink-0 rounded-xl border border-zinc-300 bg-white p-3 shadow-lg">
                <input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Column name"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addColumn();
                    if (e.key === "Escape") {
                      setAddingColumn(false);
                      setNewColumnName("");
                    }
                  }}
                  className="w-full rounded-md border-2 border-zinc-200 px-3 py-2 text-sm font-bold outline-none focus:border-pink"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={addColumn}
                    className="rounded-md bg-pink px-3 py-1.5 text-xs font-bold text-white transition hover:bg-pink-dark"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingColumn(false);
                      setNewColumnName("");
                    }}
                    className="rounded-md border-2 border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-500 transition hover:border-zinc-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="w-72 shrink-0 rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-pink hover:shadow-md"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                  <Plus size={16} />
                  Add Column
                </span>
              </button>
            )}
          </div>
        </DndContext>
      </div>

    </div>
  );
}
