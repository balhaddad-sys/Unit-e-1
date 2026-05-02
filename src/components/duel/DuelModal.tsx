"use client";

import Dialog from "@/components/Dialog";
import { duelTypes } from "@/data/duels";
import { useGame } from "@/engine/store";
import { aiPickStance, decideDuelOutcome, duelTypeRewards, resolveStance, DuelResult } from "@/engine/duelEngine";
import { applyReward } from "@/engine/rewards";
import { useState } from "react";

export default function DuelModal({
  typeId,
  onResolve,
}: {
  typeId: "gahwa" | "debate" | "falconry" | "brawl";
  onResolve: (result: DuelResult) => void;
}) {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);
  const t = duelTypes[typeId];

  const [round, setRound] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [lastLog, setLastLog] = useState<string | null>(null);
  const [final, setFinal] = useState<DuelResult | null>(null);

  function play(stanceId: string) {
    const opp = aiPickStance(t, state);
    const r = resolveStance(t, stanceId, opp);
    const next = [...results, r];
    const playerStance = t.stances.find((s) => s.id === stanceId);
    const oppStance = t.stances.find((s) => s.id === opp);
    setLastLog(
      `Round ${round}: ${playerStance?.name} vs ${oppStance?.name} — ${
        r === 1 ? "you win" : r === -1 ? "you lose" : "draw"
      }.`,
    );
    setResults(next);

    if (round >= t.rounds) {
      const result = decideDuelOutcome(next);
      setFinal(result);
      const rewards = duelTypeRewards(typeId, result);
      setState((s) => {
        applyReward(s, rewards);
        if (result === "win") {
          s.duelsWon = (s.duelsWon || 0) + 1;
          if (typeId === "gahwa") s.gahwaWon = (s.gahwaWon || 0) + 1;
          if (typeId === "debate") s.debatesWon = (s.debatesWon || 0) + 1;
          if (typeId === "falconry") s.falconryWon = (s.falconryWon || 0) + 1;
          if (typeId === "brawl") s.brawlsWon = (s.brawlsWon || 0) + 1;
        } else if (result === "lose") {
          s.duelsLost = (s.duelsLost || 0) + 1;
        }
        s.story.push({
          day: s.day,
          time: s.time,
          text: `${t.name}: ${result === "win" ? t.winText : result === "lose" ? t.loseText : t.drawText}`,
        });
      });
    } else {
      setRound(round + 1);
    }
  }

  return (
    <Dialog open={true} blocking title={t.name} arabic={t.arabic}>
      <p className="text-sm text-ash mb-3">{t.desc}</p>

      <div className="flex items-center gap-2 mb-3">
        <span className="chip">Round {Math.min(round, t.rounds)} / {t.rounds}</span>
        <span className="chip">Stat bonus: +{t.statBonus(state)}</span>
      </div>

      {lastLog && <div className="text-sm text-ink mb-3">{lastLog}</div>}

      {final ? (
        <>
          <div className="display text-lg mb-2">
            {final === "win" ? "You won." : final === "lose" ? "You lost." : "A draw."}
          </div>
          <p className="text-sm text-ash mb-4">
            {final === "win" ? t.winText : final === "lose" ? t.loseText : t.drawText}
          </p>
          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={() => onResolve(final)}>
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-xs uppercase tracking-wide text-muted mb-2">
            {t.stanceTitle}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {t.stances.map((s) => (
              <button
                key={s.id}
                onClick={() => play(s.id)}
                className="text-left p-3 rounded-xl border border-line bg-card hover:bg-[var(--accent-bg)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.icon}</span>
                  <div className="font-medium">{s.name}</div>
                </div>
                <div className="text-[11px] text-muted mt-0.5">{s.desc}</div>
                <div className="text-[10px] text-muted mt-0.5">beats: {s.beats}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </Dialog>
  );
}
