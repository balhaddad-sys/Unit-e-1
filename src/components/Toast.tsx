"use client";

import { create } from "zustand";

type ToastState = {
  msg: string | null;
  show: (msg: string) => void;
  clear: () => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  msg: null,
  show: (msg: string) => {
    if (timer) clearTimeout(timer);
    set({ msg });
    timer = setTimeout(() => set({ msg: null }), 2400);
  },
  clear: () => set({ msg: null }),
}));

export function Toast() {
  const msg = useToast((s) => s.msg);
  if (!msg) return null;
  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 pointer-events-none fade-in">
      <div className="bg-ink text-cream px-4 py-2 rounded-xl text-sm shadow-lg">{msg}</div>
    </div>
  );
}
