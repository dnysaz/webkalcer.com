"use client";

import { useActionState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../actions";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";

type ActionState = { error?: string } | null;

async function wrappedAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  return createProject(formData);
}

export default function NewProjectPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(wrappedAction, null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const maxHRef = useRef(0);

  useEffect(() => {
    if (state && !state.error) {
      router.push("/dashboard/projects");
    }
  }, [state, router]);

  useEffect(() => {
    const calc = () => {
      if (!descRef.current) return;
      const top = descRef.current.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const btnH = 44;
      const gap = 24;
      const pt = 24;
      const available = vh - top - btnH - gap - pt - 8;
      maxHRef.current = Math.max(available, 120);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    const max = maxHRef.current;
    const h = Math.min(el.scrollHeight, max);
    el.style.height = h + "px";
    el.style.overflowY = h >= max ? "auto" : "hidden";
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">New Project</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Create a new project to manage tasks.</p>
        </div>
        <Link
          href="/dashboard/projects"
          className="rounded-full border-2 border-zinc-200 px-5 py-2 text-sm font-bold text-zinc-600 transition hover:border-red-300 hover:text-red-500"
        >
          Cancel
        </Link>
      </div>

      {state?.error && (
        <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="w-full">
        <input
          name="name"
          required
          placeholder="Project Name"
          className="mb-6 block w-full border-0 bg-transparent p-0 text-3xl font-bold tracking-tighter text-dark outline-none placeholder:text-zinc-300 focus:ring-0"
        />

        <hr className="mb-6 border-t border-zinc-200" />

        <textarea
          ref={descRef}
          name="description"
          placeholder="Description"
          rows={5}
          onInput={(e) => autoGrow(e.currentTarget)}
          className="mb-6 block w-full resize-none border-0 bg-transparent p-0 text-sm font-bold text-zinc-700 outline-none placeholder:text-zinc-300 focus:ring-0 overflow-hidden"
        />

        <SubmitButton>Create Project</SubmitButton>
      </form>
    </div>
  );
}
