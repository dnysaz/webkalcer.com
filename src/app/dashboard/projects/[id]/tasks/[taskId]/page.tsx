"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import { getTaskById, updateTask, deleteTask } from "../../../actions";
import ConfirmModal from "@/components/ConfirmModal";

const DEFAULTS = ["Started", "Pending", "Process", "Completed", "Cancel"];

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EditTaskPage() {
  const { id: projectId, taskId } = useParams<{ id: string; taskId: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("Started");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const descRef = useRef<HTMLTextAreaElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const maxHRef = useRef(0);
  const gapBelowRef = useRef(24);

  useEffect(() => {
    if (!ready) return;
    function calcMax() {
      if (!descRef.current || !tailRef.current) return;
      const top = descRef.current.getBoundingClientRect().top;
      const tailH = tailRef.current.offsetHeight;
      const vh = window.innerHeight;
      const gap = gapBelowRef.current;
      const breathing = 50;
      const available = vh - top - tailH - gap - breathing;
      maxHRef.current = Math.max(available, 80);
    }
    calcMax();
    if (descRef.current) autoGrow(descRef.current);
    window.addEventListener("resize", calcMax);
    return () => window.removeEventListener("resize", calcMax);
  }, [ready]);

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    const max = maxHRef.current;
    const h = Math.min(el.scrollHeight, max);
    el.style.height = h + "px";
    el.style.overflowY = h >= max ? "auto" : "hidden";
  }

  const statusOptions = useMemo(() => {
    if (status && !DEFAULTS.includes(status)) {
      return [status, ...DEFAULTS];
    }
    return DEFAULTS;
  }, [status]);

  const statusColors: Record<string, string> = {
    Started: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Process: "bg-purple-100 text-purple-700 border-purple-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
    Cancel: "bg-red-100 text-red-700 border-red-200",
  };

  useEffect(() => {
    getTaskById(taskId).then((task) => {
      if (!task) {
        router.push(`/dashboard/projects/${projectId}`);
        return;
      }
      setName(task.name);
      setDetail(task.detail ?? "");
      setStatus(task.status);
      setDueDate(task.due_date ?? "");
      setReady(true);
    });
  }, [taskId, projectId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("name", name);
    fd.set("detail", detail);
    fd.set("status", status);
    fd.set("due_date", dueDate);

    const result = await updateTask(taskId, fd);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/dashboard/projects/${projectId}`);
      router.refresh();
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTask(taskId);
      router.push(`/dashboard/projects/${projectId}`);
      router.refresh();
    } catch {
      setError("Failed to delete task");
      setDeleting(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-sm font-bold text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <ConfirmModal
        open={confirmOpen}
        title={`Delete "${name}"?`}
        description="This task will be permanently deleted."
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete();
        }}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="mb-2 inline-block text-xs font-bold text-zinc-400 hover:text-pink"
          >
            &larr; Back to Board
          </Link>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Task</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Update task details.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="rounded-full border-2 border-red-200 px-4 py-2 text-xs font-bold text-red-400 transition hover:border-red-400 hover:text-red-600"
          >
            <Trash2 size={14} className="-mt-0.5 mr-1 inline-block" />
            Delete
          </button>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="rounded-full border-2 border-zinc-200 px-5 py-2 text-sm font-bold text-zinc-600 transition hover:border-red-300 hover:text-red-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Task Name"
          className="mb-6 block w-full border-0 bg-transparent p-0 text-3xl font-bold tracking-tighter text-dark outline-none placeholder:text-zinc-300 focus:ring-0"
        />

        <hr className="mb-6 border-t border-zinc-200" />

        {/* ── Auto-grow textarea ── */}
        <div
          ref={(el) => {
            if (el) gapBelowRef.current = parseFloat(getComputedStyle(el).marginBottom || "24");
          }}
          className="mb-6"
        >
          <textarea
            ref={descRef}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            onInput={(e) => autoGrow(e.currentTarget)}
            placeholder="Description"
            rows={3}
            className="block w-full resize-none border-0 bg-transparent p-0 text-sm font-bold text-zinc-700 outline-none placeholder:text-zinc-300 focus:ring-0 overflow-hidden"
          />
        </div>

        {/* ── Tail — everything below textarea ── */}
        <div ref={tailRef}>
          <hr className="mb-6 border-t border-zinc-200" />

          {/* Status & Due Date */}
          <div className="mb-6 flex flex-wrap gap-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => {
                  const active = status === s;
                  const color = statusColors[s] || "bg-zinc-100 text-zinc-700";
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition ${
                        active
                          ? color + " ring-2 ring-pink/20"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-dark"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {active && <Check size={10} />}
                        {s}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400">Due Date</p>
              {dueDate ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  {formatDate(dueDate)}
                  <button
                    type="button"
                    onClick={() => setDueDate("")}
                    className="ml-0.5 rounded p-0.5 hover:bg-green-200"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border-2 border-zinc-200 px-3 py-1.5 text-sm font-bold text-zinc-700 outline-none transition focus:border-pink"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="rounded-full bg-pink px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
