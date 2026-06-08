"use client";

import { useEffect } from "react";

export default function TrackPageVisit() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "page_visit" }),
    }).catch(() => {});
  }, []);
  return null;
}
