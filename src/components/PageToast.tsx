"use client";

import Toast, { type ToastMessage } from "@/components/Toast";

export default function PageToast({ toast: msg }: { toast: string | undefined }) {
  if (!msg) return null;

  const isError = msg.startsWith("error:");
  const text = isError ? msg.slice(6) : msg;

  const toast: ToastMessage = {
    type: isError ? "error" : "success",
    text,
  };

  return <Toast message={toast} key={msg} />;
}
