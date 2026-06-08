"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export interface ToastMessage {
  type: ToastType;
  text: string;
}

export default function Toast({ message }: { message: ToastMessage | null }) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<ToastType>("success");

  useEffect(() => {
    if (!message) return;
    setText(message.text);
    setType(message.type);
    setShow(true);
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!show) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] animate-fade-in">
      <div
        className={`rounded-2xl border-2 px-5 py-3 text-sm font-bold shadow-xl backdrop-blur-sm ${
          type === "success"
            ? "border-lime/30 bg-dark text-lime"
            : "border-red-400/30 bg-dark text-red-400"
        }`}
      >
        <span className="mr-2">{type === "success" ? "✓" : "✕"}</span>
        {text}
      </div>
    </div>
  );
}
