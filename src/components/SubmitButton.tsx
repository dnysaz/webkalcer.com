"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  loadingText = "Menyimpan...",
  className,
}: {
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "rounded-full bg-pink px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
