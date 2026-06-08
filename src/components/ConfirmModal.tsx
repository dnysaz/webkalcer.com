"use client";

import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-3xl border-2 border-zinc-700 bg-dark p-6 shadow-2xl">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <p className="mt-2 text-sm font-bold leading-relaxed text-zinc-300">{description}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-full border-2 border-zinc-600 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
