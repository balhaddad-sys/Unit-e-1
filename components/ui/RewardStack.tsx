"use client";

import { create } from "zustand";

interface Reward {
  id: number;
  text: string;
  icon: string;
  kind: "positive" | "negative" | "neutral";
}

interface Store {
  rewards: Reward[];
  push: (text: string, kind?: Reward["kind"], icon?: string) => void;
  pop: (id: number) => void;
}

let nextId = 0;

const useRewardStore = create<Store>((set) => ({
  rewards: [],
  push: (text, kind = "neutral", icon = "✦") => {
    const id = ++nextId;
    set((s) => ({ rewards: [...s.rewards, { id, text, icon, kind }] }));
    setTimeout(() => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })), 3200);
  },
  pop: (id) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),
}));

/** Imperative trigger from anywhere in the app. */
export const showReward = (text: string, kind?: Reward["kind"], icon?: string) =>
  useRewardStore.getState().push(text, kind, icon);

/** Convenience: stat delta callout. */
export function showStatDelta(stat: "wasta" | "money" | "rep" | "energy", delta: number) {
  if (!delta) return;
  const labels = { wasta: "واسطة", money: "د.ك", rep: "سمعة", energy: "طاقة" };
  const icons = { wasta: "★", money: "د.ك", rep: "◐", energy: "⌇" };
  const sign = delta > 0 ? "+" : "";
  const kind = delta > 0 ? "positive" : "negative";
  showReward(`${sign}${delta} ${labels[stat]}`, kind, icons[stat]);
}

/** The actual UI component. Mount once near the app root. */
export function RewardStack() {
  const rewards = useRewardStore((s) => s.rewards);
  return (
    <div
      className="fixed top-20 right-3 z-[1500] flex flex-col gap-1.5 pointer-events-none"
      dir="rtl"
    >
      {rewards.map((r) => (
        <div
          key={r.id}
          className={`reward-pop bg-surface border rounded-xl px-3.5 py-2 text-[13px] font-semibold flex items-center gap-2 shadow-md ${
            r.kind === "positive"
              ? "border-l-4 border-l-accent"
              : r.kind === "negative"
                ? "border-l-4 border-l-crimson"
                : "border-ink-4"
          }`}
        >
          <span className="text-base">{r.icon}</span>
          <span>{r.text}</span>
        </div>
      ))}
    </div>
  );
}
