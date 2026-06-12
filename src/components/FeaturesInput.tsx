"use client";

import { useState } from "react";

export default function FeaturesInput({ defaultValue = [] }: { defaultValue?: string[] }) {
  const [features, setFeatures] = useState<string[]>(defaultValue);

  function add() {
    setFeatures((prev) => [...prev, ""]);
  }

  function remove(i: number) {
    setFeatures((prev) => prev.filter((_, idx) => idx !== i));
  }

  function update(i: number, value: string) {
    setFeatures((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-zinc-600">Features</label>
      <input type="hidden" name="features" value={JSON.stringify(features.filter((f) => f.trim()))} />
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime/30 text-xs font-black text-dark">
              ✓
            </span>
            <input
              value={f}
              onChange={(e) => update(i, e.target.value)}
              placeholder="e.g. Free domain 1 tahun"
              className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2.5 text-sm font-bold outline-none transition focus:border-pink"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-red-200 text-sm font-bold text-red-400 transition hover:border-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-zinc-300 px-5 py-2 text-xs font-bold text-zinc-500 transition hover:border-pink hover:text-pink"
      >
        + Add Feature
      </button>
    </div>
  );
}
