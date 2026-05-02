"use client";

import { useState } from "react";
import { Dialog } from "@/components/Dialog";
import { duels } from "@/data/duels";
import { useGame } from "@/engine/store";
import { applyDuelResult, pickOpponentStance, resolveDuel } from "@/engine/duelEngine";
import { useToast } from "@/components/Toast";
import { logStory } from "@/engine/actions";

type Round = { player: string; opp: string };

export function DuelModal({
  typeId,
  open,
  onClose,
  onResolved,
}: {
  typeId: "gahwa" | "debate" | "falconry" | "brawl";
  open: boolean;
  onClose: () => void;
  onResolved?: (outcome: "win" | "lose" | "draw") => void;
}) {
  const type = duels[typeId];
  const setStore = useGame((g) => g.set);
  const state = useGame((g) => g.state);
  const toast = useToast((t) => t.show);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [done, setDone] = useState<null | "win" | "lose" | "draw">(null);

  if (!open) return null;

  const currentRound = rounds.length;
  const totalRounds = type.rounds;
  const finished = currentRound >= totalRounds;

  function play(stanceId: string) {
    const opp = pickOpponentStance(type);
    const next = [...rounds, { player: stanceId, opp }];
    setRounds(next);
    if (next.length >= totalRounds) {
      const outcome = resolveDuel(state, type, next);
      setStore((s) => {
        applyDuelResult(s, typeId, outcome);
        const text =
          outcome === "win" ? type.winText :
          outcome === "lose" ? type.loseText :
          type.drawText;
        logStory(s, `[${type.name}] ${text}`);
      });
      setDone(outcome);
      toast(
        outcome === "win" ? `Won the ${type.name}.` :
        outcome === "lose" ? `Lost the ${type.name}.` :
        `${type.name} ended in a draw.`
      );
    }
  }

  function close() {
    if (done && onResolved) onResolved(done);
    setRounds([]);
    setDone(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={close} title={type.name} arabic={type.arabic}>
      <p className="text-sm text-[var(--muted)] mb-3">{type.desc}</p>

      <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
        Round {Math.min(currentRound + 1, totalRounds)} of {totalRounds}
      </div>

      {!finished && (
        <div className="space-y-2">
          {type.stances.map((st) => (
            <button key={st.id} className="btn" onClick={() => play(st.id)}>
              <div className="flex items-baseline gap-2">
                <span className="text-base leading-none">{st.icon}</span>
                <span className="font-semibold">{st.name}</span>
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{st.desc}</div>
            </button>
          ))}
        </div>
      )}

      {finished && done && (
        <div className="space-y-3 fade-in">
          <div className="space-y-1">
            {rounds.map((r, i) => (
              <div key={i} className="text-xs text-[var(--muted)]">
                Round {i + 1}: <span className="text-ink">{r.player}</span> vs <span className="text-ink">{r.opp}</span>
              </div>
            ))}
          </div>
          <div className="serif text-lg">
            {done === "win" ? type.winText : done === "lose" ? type.loseText : type.drawText}
          </div>
          <button className="btn btn-primary text-center" onClick={close}>Close</button>
        </div>
      )}
    </Dialog>
  );
}
