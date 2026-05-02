"use client";

import { useGame } from "@/engine/store";

export default function Toast() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);

  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto fade-in text-sm bg-ink/95 text-cream px-4 py-2 rounded-full shadow-soft max-w-[88vw] truncate"
        >
          {t.text}
        </button>
      ))}
    </div>
  );
}
