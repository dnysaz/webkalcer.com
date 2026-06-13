"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export interface ToastMessage {
  type: ToastType;
  text: string;
}

interface ToastState {
  show: boolean;
  text: string;
  type: ToastType;
}

export default function Toast({ message }: { message: ToastMessage | null }) {
  const [toast, setToast] = useState<ToastState>({ show: false, text: "", type: "success" });

  useEffect(() => {
    if (!message) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToast({ show: true, text: message.text, type: message.type });
    const timer = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!toast.show) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] animate-fade-in">
      <div
        className={`rounded-2xl border-2 px-5 py-3 text-sm font-bold shadow-xl backdrop-blur-sm ${
          toast.type === "success"
            ? "border-lime/30 bg-dark text-lime"
            : "border-red-400/30 bg-dark text-red-400"
        }`}
      >
        <span className="mr-2">{toast.type === "success" ? "✓" : "✕"}</span>
        {toast.text}
      </div>
    </div>
  );
}
