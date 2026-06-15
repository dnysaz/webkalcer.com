"use client";

import { useEffect, useRef } from "react";

export default function ChunkErrorHandler() {
  const lastReload = useRef(0);

  useEffect(() => {
    function onError(e: ErrorEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      const src =
        (target as HTMLScriptElement).src || (target as HTMLLinkElement).href || "";
      if (
        (tag === "SCRIPT" || tag === "LINK") &&
        src.includes("/_next/static/chunks/")
      ) {
        e.preventDefault();
        // Prevent reload loops — max 1 reload per 5 seconds
        const now = Date.now();
        if (now - lastReload.current < 5000) return;
        lastReload.current = now;
        window.location.reload();
      }
    }

    window.addEventListener("error", onError, true);

    return () => window.removeEventListener("error", onError, true);
  }, []);

  return null;
}
