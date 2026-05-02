"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PrologueScene as PrologueSceneT, PrologueOption } from "@/lib/types";

interface Props {
  scene: PrologueSceneT;
  onChoice: (opt: PrologueOption) => void;
}

/**
 * Renders a single prologue scene with multi-paragraph narration
 * and three response options.
 */
export function PrologueScene({ scene, onChoice }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="min-h-screen bg-bg flex flex-col px-5 pt-[calc(var(--safe-top)+24px)] pb-[calc(var(--safe-bottom)+24px)]"
        dir="rtl"
      >
        <div className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-2">
          {scene.label}
        </div>

        <div className="flex-1 flex flex-col">
          <NarrationText text={scene.text} />

          <div className="mt-8 space-y-2.5">
            <div className="text-xs font-semibold text-ink-3 mb-2">شنو تقول؟</div>
            {scene.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChoice(opt)}
                className="w-full text-right bg-surface hover:bg-surface-2 active:bg-surface-3 active:scale-[0.99] border border-surface-3 rounded-2xl px-5 py-4 text-[15px] leading-relaxed transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Render multi-paragraph text with italic and bold support via *...* and **...**. */
function NarrationText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="space-y-4 text-[15px] leading-loose text-ink-2">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-right">
          {renderInline(p)}
        </p>
      ))}
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let buf = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      if (buf) { tokens.push(buf); buf = ""; }
      const end = text.indexOf("**", i + 2);
      if (end === -1) { buf += text.slice(i); break; }
      tokens.push(<strong key={tokens.length} className="font-bold text-ink">{text.slice(i + 2, end)}</strong>);
      i = end + 2;
    } else if (text[i] === "*") {
      if (buf) { tokens.push(buf); buf = ""; }
      const end = text.indexOf("*", i + 1);
      if (end === -1) { buf += text.slice(i); break; }
      tokens.push(<em key={tokens.length} className="italic text-ink">{text.slice(i + 1, end)}</em>);
      i = end + 1;
    } else {
      buf += text[i];
      i++;
    }
  }
  if (buf) tokens.push(buf);
  return tokens;
}
