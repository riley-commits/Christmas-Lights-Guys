"use client";

import * as React from "react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  message: string;
  tone: "success" | "info" | "error";
};

type ToastInput = { message: string; tone?: Toast["tone"] };

let push: (t: ToastInput) => void = () => {};

export function toast(input: ToastInput | string) {
  const payload = typeof input === "string" ? { message: input } : input;
  push(payload);
}

export function Toaster() {
  const [items, setItems] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    push = ({ message, tone = "success" }) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };
    return () => {
      push = () => {};
    };
  }, []);

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 px-3 w-full max-w-sm pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-2 rounded-lg border bg-white px-4 py-3 shadow-pop animate-fade-in",
            t.tone === "success" && "border-pine/30",
            t.tone === "info" && "border-line-strong",
            t.tone === "error" && "border-brand/30"
          )}
        >
          {t.tone === "success" && <CheckCircle2 size={18} className="text-pine flex-shrink-0 mt-0.5" />}
          {t.tone === "info" && <Info size={18} className="text-ink-muted flex-shrink-0 mt-0.5" />}
          {t.tone === "error" && <AlertCircle size={18} className="text-brand flex-shrink-0 mt-0.5" />}
          <p className="flex-1 text-sm font-medium text-ink leading-snug">{t.message}</p>
          <button
            onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))}
            className="text-ink-subtle hover:text-ink mt-0.5"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
