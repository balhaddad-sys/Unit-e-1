"use client";

import { motion } from "framer-motion";
import type { Act, GameState } from "@/lib/types";
import { pickIntro } from "@/lib/data/acts";

interface Props {
  act: Act;
  state: GameState;
  onContinue: () => void;
}

export function ActTransition({ act, state, onContinue }: Props) {
  const intro = pickIntro(act, state);
  const paragraphs = intro.split("\n\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[2000] bg-bg flex flex-col px-6 pt-[calc(var(--safe-top)+32px)] pb-[calc(var(--safe-bottom)+24px)] overflow-y-auto"
      dir="rtl"
    >
      <div className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-1">
        الفصل {act.n}
      </div>
      <div className="text-[28px] font-bold text-ink mb-6">{act.titleEmotional}</div>

      <div className="flex-1 space-y-4 text-[15px] leading-loose text-ink-2 mb-8">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="text-xs text-ink-3 italic mb-3 text-left font-sans">
        {act.titleStructural}
      </div>

      <button
        onClick={onContinue}
        className="bg-accent text-white font-semibold py-3.5 rounded-full active:scale-[0.98] transition-transform"
      >
        تابع
      </button>
    </motion.div>
  );
}
