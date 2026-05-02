"use client";

import { ReactNode } from "react";

export function Dialog({
  open,
  onClose,
  title,
  arabic,
  children,
}: {
  open: boolean;
  onClose?: () => void;
  title?: string;
  arabic?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-ink/35 fade-in" onClick={onClose}>
      <div
        className="card w-full sm:max-w-[640px] mx-0 sm:mx-4 max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {(title || arabic) && (
          <div className="px-5 pt-5 pb-3 border-b border-[var(--line)]">
            {arabic && <div className="ar text-sm text-[var(--muted)] mb-1">{arabic}</div>}
            {title && <div className="serif text-xl">{title}</div>}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
