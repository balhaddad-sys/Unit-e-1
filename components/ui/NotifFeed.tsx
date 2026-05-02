"use client";

import { useState } from "react";
import type { Notification } from "@/lib/types";
import { useGameStore } from "@/lib/store";

export function NotifBell() {
  const unread = useGameStore((s) => s.state?.unreadNotifs ?? 0);
  const dispatch = useGameStore((s) => s.dispatch);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          dispatch({ type: "MARK_NOTIFS_READ" });
        }}
        className="relative p-1.5 text-ink-2"
        aria-label="الإشعارات"
      >
        🔔
        {unread > 0 && (
          <span className="absolute top-0 left-0 bg-crimson text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && <NotifPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function NotifPanel({ onClose }: { onClose: () => void }) {
  const notifs = useGameStore((s) => s.state?.notifications ?? []);
  return (
    <div
      className="fixed inset-0 z-[1400] bg-black/30 flex items-start justify-center pt-[var(--safe-top)]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface w-full max-h-[60vh] overflow-y-auto border-b border-surface-3"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3">
          <div className="text-sm font-bold">شنو صار</div>
          <button onClick={onClose} className="text-xl text-ink-3 px-2">
            ✕
          </button>
        </div>
        {notifs.length === 0 ? (
          <div className="text-center text-ink-3 italic py-8 text-sm">ما صار شي بعد. ابدا اللعبة.</div>
        ) : (
          notifs.map((n, i) => <NotifRow key={i} n={n} />)
        )}
      </div>
    </div>
  );
}

function NotifRow({ n }: { n: Notification }) {
  return (
    <div className="px-4 py-3 border-b border-surface-3 flex gap-3 items-start text-sm" dir="rtl">
      <div className="text-base mt-0.5">{n.icon}</div>
      <div className="flex-1">
        <div>{n.text}</div>
        <div className="text-[11px] text-ink-3 mt-1">اليوم {n.day}</div>
      </div>
    </div>
  );
}
