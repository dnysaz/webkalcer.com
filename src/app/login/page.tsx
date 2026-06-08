"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border-2 border-zinc-700 bg-dark p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
              <span className="text-yellow">🤙</span>
              <span><span className="text-white">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span></span>
            </a>
            <p className="mt-2 text-sm font-bold text-zinc-400">Login admin</p>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-bold text-zinc-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border-2 border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-pink"
                placeholder="admin@webkalcer.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-bold text-zinc-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-xl border-2 border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-pink"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-pink px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark disabled:opacity-50"
            >
              {pending ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
