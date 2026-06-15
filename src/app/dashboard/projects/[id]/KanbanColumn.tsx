"use client";

import { type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

export default function KanbanColumn({
  id,
  label,
  tasks,
  children,
  onAddCard,
}: {
  id: string;
  label: string;
  tasks: { id: string }[];
  children: ReactNode;
  onAddCard: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column" },
  });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-zinc-100/80">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-700">{label}</span>
          <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-xs font-bold text-zinc-500">
            {tasks.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-2 px-3 pb-2 transition-colors ${
          isOver ? "bg-zinc-200/50" : ""
        }`}
      >
        <SortableContext
          id={id}
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <button
          onClick={onAddCard}
          className="flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-200/50 hover:text-pink"
        >
          <Plus size={14} />
          Add a card
        </button>
      </div>
    </div>
  );
}
