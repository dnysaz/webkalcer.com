"use client";

import { useState, useCallback } from "react";
import { resetSnapToken } from "../actions";

interface Invoice {
  id: number;
  status: string;
  grand_total: number;
  invoice_number: string;
  midtrans_snap_token: string | null;
  midtrans_order_id: string | null;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: { onSuccess?: () => void; onPending?: () => void; onError?: () => void; onClose?: () => void }) => void;
    };
  }
}

export default function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refreshAndClose = useCallback(() => {
    setMessage(null);
    window.location.reload();
  }, []);

  async function handleCreatePayment() {
    setLoading(true);
    try {
      await loadSnapScript();

      const res = await fetch("/api/midtrans/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoice.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Unknown error" });
        return;
      }

      if (window.snap) {
        let paid = false;
        window.snap.pay(data.snap_token, {
          onSuccess: () => { paid = true; },
          onPending: () => { paid = true; },
          onError: () => { setMessage({ type: "error", text: "Payment failed. Please try again." }); },
          onClose: async () => {
            if (paid) {
              const res = await fetch("/api/midtrans/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoice_id: invoice.id }),
              });
              const result = await res.json();
              if (result.status === "paid") {
                setMessage({ type: "success", text: "Payment successful!" });
              } else {
                setMessage({ type: "error", text: result.error || "Payment not confirmed yet." });
              }
            } else {
              window.location.reload();
            }
          },
        });
      } else {
        setMessage({ type: "error", text: "Midtrans Snap is not available. Try reloading the page." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    }
    setLoading(false);
  }

  async function handleCheckPayment() {
    setChecking(true);
    try {
      const res = await fetch("/api/midtrans/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoice.id }),
      });
      const result = await res.json();
      if (result.status === "paid") {
        setMessage({ type: "success", text: "Payment successful!" });
      } else {
        setMessage({ type: "error", text: result.error || "Status: " + result.status + ". Not yet paid." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Check console for details." });
    }
    setChecking(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {(invoice.status === "draft" || invoice.status === "pending") && (
          <button
            onClick={handleCreatePayment}
            disabled={loading}
            className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-dark disabled:opacity-50"
          >
            {loading ? "Processing..." : invoice.midtrans_snap_token ? "Continue Payment" : "Create Payment"}
          </button>
        )}
        {invoice.status === "pending" && invoice.midtrans_snap_token && (
          <button
            onClick={async () => {
              setResetting(true);
              await resetSnapToken(invoice.id);
              window.location.reload();
            }}
            disabled={resetting}
            className="rounded-full border-2 border-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-yellow hover:text-yellow-800 disabled:opacity-50"
          >
            {resetting ? "..." : "Change Payment Method"}
          </button>
        )}
        {invoice.status === "pending" && invoice.midtrans_order_id && (
          <button
            onClick={handleCheckPayment}
            disabled={checking}
            className="rounded-full border-2 border-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-teal hover:text-teal disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check Payment"}
          </button>
        )}
      </div>

      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-lg border-2 border-zinc-700 bg-dark p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {message.type === "success" ? "✓" : "✕"}
              </div>
              <h3 className="text-lg font-black text-white">
                {message.type === "success" ? "Payment Successful" : "Payment Failed"}
              </h3>
              <p className="text-sm font-bold text-zinc-300">{message.text}</p>
              <button
                onClick={refreshAndClose}
                className={`mt-2 w-full rounded-full px-4 py-2.5 text-sm font-bold text-white transition ${message.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

async function loadSnapScript(): Promise<void> {
  if (document.getElementById("midtrans-snap")) return;

  const configRes = await fetch("/api/midtrans/client-key");
  const config = await configRes.json();
  if (!config.clientKey) {
    throw new Error("Midtrans not configured");
  }

  const scriptUrl = config.isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "midtrans-snap";
    script.src = scriptUrl;
    script.setAttribute("data-client-key", config.clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Midtrans Snap"));
    document.head.appendChild(script);
  });
}
