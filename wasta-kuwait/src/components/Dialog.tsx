"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  arabic?: string;
  children: ReactNode;
  /* if true, the user must click an action — no background dismiss */
  blocking?: boolean;
};

export default function Dialog({ open, onClose, title, arabic, children, blocking = false }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !blocking && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, blocking]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-ink/40">
      <button
        aria-label="close"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!blocking && onClose) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative slide-up w-full sm:max-w-[560px] bg-cream rounded-t-3xl sm:rounded-3xl shadow-soft border border-line max-h-[88vh] overflow-y-auto"
      >
        {(title || arabic) && (
          <div className="px-5 pt-5 pb-3 border-b border-line/70 flex items-baseline justify-between gap-3">
            {title && <h2 className="display text-xl">{title}</h2>}
            {arabic && <span className="arabic text-base text-ash">{arabic}</span>}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
