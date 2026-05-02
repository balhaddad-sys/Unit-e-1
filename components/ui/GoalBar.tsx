"use client";

import type { Goal } from "@/lib/engine/goalCompute";

interface Props {
  goal: Goal;
  onTap: () => void;
}

/**
 * GoalBar — the single most important UI element.
 * Shows the player exactly what to do next, in Arabic.
 * Lives at the top of the home view.
 */
export function GoalBar({ goal, onTap }: Props) {
  return (
    <button
      onClick={onTap}
      className="goal-bar w-full flex items-center gap-3 px-4 py-2.5 rounded-none -mx-4 mb-3 active:scale-[0.99] transition-transform"
      dir="rtl"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">
        {goal.icon}
      </div>
      <div className="flex-1 text-right">
        <div className="text-[11px] opacity-80 font-medium">{goal.label}</div>
        <div className="text-sm font-semibold mt-0.5">{goal.title}</div>
      </div>
      <div className="text-lg opacity-90">←</div>
    </button>
  );
}
