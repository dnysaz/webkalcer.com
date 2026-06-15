"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { createTask } from "../../../actions";

const STATUS_LIST = ["Started", "Pending", "Process", "Completed", "Cancel"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

export default function NewTaskPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");

  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState(initialStatus ?? "Started");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }, []);

  const [calYear, setCalYear] = useState(today.year);
  const [calMonth, setCalMonth] = useState(today.month);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("project_id", projectId);
    fd.set("name", name);
    fd.set("detail", detail);
    fd.set("status", status);
    fd.set("due_date", dueDate);

    const result = await createTask(fd);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/dashboard/projects/${projectId}`);
      router.refresh();
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
    <div className="px-4 py-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="mb-2 inline-block text-xs font-bold text-zinc-400 hover:text-pink"
          >
            &larr; Back to Board
          </Link>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Add Task</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-8">
          <div className="flex-1 min-w-0 max-w-2xl">
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
              rows={5}
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
                  <div key={wd} className="text-center text-[10px] font-bold text-zinc-400 py-1">
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
            disabled={loading}
            className="rounded-full bg-pink px-6 py-2 text-sm font-bold text-white transition hover:bg-pink-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add"}
          </button>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="rounded-full border-2 border-zinc-200 px-6 py-2 text-sm font-bold text-zinc-600 transition hover:border-zinc-400"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
