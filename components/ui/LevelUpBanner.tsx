"use client";

import { create } from "zustand";

interface State {
  show: boolean;
  text: string;
  icon: string;
  trigger: (text: string, icon?: string) => void;
}

const useLvlStore = create<State>((set) => ({
  show: false,
  text: "",
  icon: "✦",
  trigger: (text, icon = "✦") => {
    set({ show: true, text, icon });
    setTimeout(() => set({ show: false }), 3500);
  },
}));

/** Imperative API. */
export const showLevelUp = (text: string, icon?: string) =>
  useLvlStore.getState().trigger(text, icon);

export function LevelUpBanner() {
  const { show, text, icon } = useLvlStore();
  if (!show) return null;
  return (
    <div
      className="level-up-banner fixed top-[70px] left-1/2 -translate-x-1/2 z-[1450] bg-gradient-to-br from-gold to-[#b08a2f] text-white px-6 py-3.5 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2.5 max-w-[calc(100vw-40px)]"
      dir="rtl"
    >
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
