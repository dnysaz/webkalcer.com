"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { updateTask, deleteTask } from "../actions";

const STATUS_LIST = ["Started", "Pending", "Process", "Completed", "Cancel"];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface TaskData {
  id: string;
  name: string;
  detail: string;
  status: string;
  due_date: string | null;
}

export default function SidePanel({
  open,
  onClose,
  onSaved,
  projectId,
  task,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  projectId: string;
  task: TaskData | null;
}) {
  if (!open || !task) return null;
  return (
    <SidePanelInner
      key={task.id}
      task={task}
      onClose={onClose}
      onSaved={onSaved}
      projectId={projectId}
    />
  );
}

function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

function SidePanelInner({
  onClose,
  onSaved,
  projectId,
  task,
}: {
  onClose: () => void;
  onSaved: () => void;
  projectId: string;
  task: TaskData;
}) {
  const [name, setName] = useState(task.name);
  const [detail, setDetail] = useState(task.detail);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }, []);

  const [calYear, setCalYear] = useState(
    dueDate ? new Date(dueDate).getFullYear() : today.year
  );
  const [calMonth, setCalMonth] = useState(
    dueDate ? new Date(dueDate).getMonth() : today.month
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("project_id", projectId);
    fd.set("name", name);
    fd.set("detail", detail);
    fd.set("status", status);
    fd.set("due_date", dueDate);

    const result = await updateTask(task.id, fd);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSaved();
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      onSaved();
    } catch {
      setError("Failed to delete task");
      setDeleting(false);
    }
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const weeks: (number | null)[][] = [];
  let day = 1;
  for (let w = 0; w < 6; w++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < firstDay) || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    weeks.push(week);
    if (day > daysInMonth) break;
  }

  function selectDate(d: number) {
    const m = String(calMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    setDueDate(`${calYear}-${m}-${dd}`);
  }

  function isSelected(d: number) {
    if (!dueDate) return false;
    const m = String(calMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return dueDate === `${calYear}-${m}-${dd}`;
  }

  function isToday(d: number) {
    return today.year === calYear && today.month === calMonth && today.day === d;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 flex h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 flex-col bg-white shadow-2xl transition-transform duration-300 translate-x-0">
        <div className="flex items-center justify-between px-8 py-5">
          <h2 className="text-xl font-black tracking-tighter text-dark">
            Edit Task
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-dark"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8">
          {error && (
            <div className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-8">
              <div className="flex-1 min-w-0">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Task Name"
                  className="mb-6 block w-full border-0 bg-transparent p-0 text-3xl font-bold tracking-tighter text-dark outline-none placeholder:text-zinc-300 focus:ring-0"
                />

                <hr className="mb-6 border-t border-zinc-200" />

                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  onInput={(e) => autoGrow(e.currentTarget)}
                  placeholder="Task details..."
                  rows={4}
                  className="block w-full resize-none border-0 bg-transparent p-0 text-sm font-bold text-zinc-700 outline-none placeholder:text-zinc-300 focus:ring-0 max-h-[200px] overflow-y-auto"
                />
              </div>

              <div className="w-[130px] shrink-0">
                <div className="space-y-1">
                  {STATUS_LIST.map((s) => {
                    const active = status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                          active
                            ? "bg-pink/10 text-pink"
                            : "text-zinc-500 hover:bg-zinc-100 hover:text-dark"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            active
                              ? "border-pink bg-pink text-white"
                              : "border-zinc-300"
                          }`}
                        >
                          {active && <Check size={10} strokeWidth={3} />}
                        </span>
                        {s}
                      </button>
                    );
                  })}
                </div>

                <hr className="my-4 border-t border-zinc-200" />

                <div className="text-xs font-bold text-zinc-400 mb-2">Due Date</div>
                <div className="rounded-lg border-2 border-zinc-200 p-2">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
                        else setCalMonth((m) => m - 1);
                      }}
                      className="rounded p-0.5 text-zinc-400 hover:text-dark"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-bold text-dark">
                      {new Date(calYear, calMonth).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
                        else setCalMonth((m) => m + 1);
                      }}
                      className="rounded p-0.5 text-zinc-400 hover:text-dark"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-0">
                    {WEEKDAYS.map((wd) => (
                      <div
                        key={wd}
                        className="text-center text-[10px] font-bold text-zinc-400 py-1"
                      >
                        {wd}
                      </div>
                    ))}
                    {weeks.map((week, wi) =>
                      week.map((d, di) => (
                        <div key={`${wi}-${di}`} className="aspect-square p-0.5">
                          {d !== null ? (
                            <button
                              type="button"
                              onClick={() => selectDate(d)}
                              className={`flex h-full w-full items-center justify-center rounded text-[11px] font-bold transition ${
                                isSelected(d)
                                  ? "bg-pink text-white"
                                  : isToday(d)
                                    ? "bg-zinc-100 text-dark"
                                    : "text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              {d}
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate("")}
                    className="mt-1 text-[10px] font-bold text-zinc-400 hover:text-red-500"
                  >
                    Clear date
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-start gap-3 pb-6">
              <button
                type="submit"
                disabled={loading || deleting}
                className="rounded-full bg-pink px-6 py-2 text-sm font-bold text-white transition hover:bg-pink-dark disabled:opacity-50"
              >
                {loading ? "Saving..." : "Update"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading || deleting}
                className="rounded-full border-2 border-zinc-200 px-6 py-2 text-sm font-bold text-zinc-600 transition hover:border-zinc-400 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
