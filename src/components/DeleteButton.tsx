"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import Toast, { type ToastMessage } from "@/components/Toast";

export default function DeleteButton<T extends string | number>({
  id,
  label,
  action,
}: {
  id: T;
  label: string;
  action: (id: T) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      await action(id);
      setOpen(false);
      setToast({ type: "success", text: `${label} deleted successfully` });
      router.refresh();
    } catch {
      setOpen(false);
      setToast({ type: "error", text: `Failed to delete ${label}` });
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-red-200 px-4 py-1.5 text-xs font-bold text-red-400 transition hover:border-red-400 hover:text-red-600"
      >
        Delete
      </button>
      <ConfirmModal
        open={open}
        title={`Delete ${label}`}
        description={`Are you sure you want to delete this ${label}? Deleted data cannot be restored.`}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        loading={loading}
      />
      <Toast message={toast} />
    </>
  );
}
