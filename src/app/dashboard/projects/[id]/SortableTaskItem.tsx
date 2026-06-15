"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

interface TaskData {
  id: string;
  name: string;
  detail: string;
  status: string;
  due_date: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-600",
  Started: "bg-blue-100 text-blue-700",
  Process: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancel: "bg-red-100 text-red-700",
};

export default function SortableTaskItem({
  task,
  onClick,
  onDelete,
}: {
  task: TaskData;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md ${
          isDragging ? "border-pink shadow-lg" : "border-zinc-200"
        }`}
        {...attributes}
        onClick={onClick}
      >
        <div className="flex items-start gap-2">
          <span
            ref={setActivatorNodeRef}
            {...listeners}
            className="mt-0.5 cursor-grab touch-none shrink-0 text-zinc-200 transition hover:text-zinc-400"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-dark">{task.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                className="shrink-0 rounded p-1 text-zinc-200 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
            {task.detail && (
              <p className="mt-0.5 text-xs font-bold text-zinc-400 line-clamp-2">
                {task.detail}
              </p>
            )}
            {task.due_date && (
              <p className="mt-1.5 text-[10px] font-bold text-zinc-400">
                {new Date(task.due_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            )}
            <span
              className={`mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                STATUS_LABELS[task.status] || "bg-zinc-100 text-zinc-600"
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title={`Delete "${task.name}"?`}
        description="This task will be permanently deleted."
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete?.();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
