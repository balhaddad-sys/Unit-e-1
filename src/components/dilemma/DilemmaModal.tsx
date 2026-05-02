"use client";

import Dialog from "@/components/Dialog";
import type { Dilemma, DilemmaOption, RiskOutcome } from "@/lib/types";
import { useGame } from "@/engine/store";
import { applyReward } from "@/engine/rewards";
import { hasTrait } from "@/engine/traits";
import { useState } from "react";
import DuelModal from "@/components/duel/DuelModal";

export default function DilemmaModal({
  dilemma,
  onResolve,
}: {
  dilemma: Dilemma;
  onResolve: () => void;
}) {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);
  const pushToast = useGame((s) => s.pushToast);
  const [resultText, setResultText] = useState<string | null>(null);
  const [duelType, setDuelType] = useState<"gahwa" | "debate" | "falconry" | "brawl" | null>(null);

  function pickOption(opt: DilemmaOption) {
    if (opt.triggerDuel) {
      setDuelType(opt.triggerDuel);
      return;
    }
    if (opt.risk) {
      const won = Math.random() < opt.risk.prob;
      const outcome = won ? opt.risk.win : opt.risk.lose;
      setState((s) => {
        applyReward(s, opt);
        applyReward(s, outcome);
        s.story.push({
          day: s.day,
          time: s.time,
          text: `${dilemma.title}: ${outcome.label || (won ? "Won" : "Lost")}`,
        });
      });
      setResultText(outcome.label || (won ? "It worked." : "It didn't."));
      return;
    }

    setState((s) => {
      applyReward(s, opt);
      s.story.push({
        day: s.day,
        time: s.time,
        text: `${dilemma.title}: ${opt.label}`,
      });
    });
    setResultText(opt.label);
  }

  function close() {
    setResultText(null);
    onResolve();
  }

  if (duelType) {
    return (
      <DuelModal
        typeId={duelType}
        onResolve={(result) => {
          pushToast(result === "win" ? "You won the duel." : result === "lose" ? "You lost." : "A draw.");
          setDuelType(null);
          onResolve();
        }}
      />
    );
  }

  return (
    <Dialog open={true} blocking title={dilemma.title}>
      <div className="text-xs uppercase tracking-wide text-muted mb-2">{dilemma.tag}</div>
      <p className="serif text-base leading-relaxed mb-5 text-ink">{dilemma.text}</p>

      {resultText ? (
        <div className="text-sm text-ash mb-3">{resultText}</div>
      ) : (
        <div className="grid gap-2">
          <OptionBtn opt={dilemma.accept} onPick={pickOption} />
          <OptionBtn opt={dilemma.refuse} onPick={pickOption} />
          {dilemma.third && hasTrait(state, dilemma.third.requiresTrait!) && (
            <OptionBtn opt={dilemma.third} onPick={pickOption} highlight />
          )}
        </div>
      )}

      {resultText && (
        <div className="flex justify-end pt-2">
          <button className="btn btn-primary" onClick={close}>
            Continue
          </button>
        </div>
      )}
    </Dialog>
  );
}

function OptionBtn({
  opt,
  onPick,
  highlight = false,
}: {
  opt: DilemmaOption;
  onPick: (o: DilemmaOption) => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={() => onPick(opt)}
      className={`text-left p-3 rounded-xl border ${
        highlight ? "border-[var(--accent)] bg-[var(--accent-bg)]" : "border-line bg-card"
      }`}
    >
      <div className="text-sm text-ink">{opt.label}</div>
      <RewardSummary opt={opt} />
    </button>
  );
}

function RewardSummary({ opt }: { opt: DilemmaOption }) {
  const parts: string[] = [];
  if (opt.wasta) parts.push(`${opt.wasta > 0 ? "+" : ""}${opt.wasta} wasta`);
  if (opt.money) parts.push(`${opt.money > 0 ? "+" : ""}${opt.money} KD`);
  if (opt.rep) parts.push(`${opt.rep > 0 ? "+" : ""}${opt.rep} rep`);
  if (opt.energy) parts.push(`${opt.energy > 0 ? "+" : ""}${opt.energy} energy`);
  if (opt.risk) parts.push(`risk: ${(opt.risk.prob * 100).toFixed(0)}%`);
  if (opt.triggerDuel) parts.push(`→ ${opt.triggerDuel}`);
  if (parts.length === 0) return null;
  return <div className="text-[11px] text-muted mt-1">{parts.join(" · ")}</div>;
}

// Helper for tooling that imports RiskOutcome implicitly
export type { RiskOutcome };
