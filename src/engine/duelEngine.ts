// Duel resolution. Stance-vs-stance with stat bonus.

import type { DuelType, GameState } from "@/lib/types";

export type DuelOutcome = "win" | "lose" | "draw";

function resolveStance(playerStance: string, oppStance: string, type: DuelType): DuelOutcome {
  if (playerStance === oppStance) return "draw";
  const player = type.stances.find((x) => x.id === playerStance);
  if (!player) return "draw";
  if (player.beats === oppStance) return "win";
  return "lose";
}

export function pickOpponentStance(type: DuelType): string {
  return type.stances[Math.floor(Math.random() * type.stances.length)].id;
}

export function resolveDuel(
  s: GameState,
  type: DuelType,
  rounds: { player: string; opp: string }[]
): DuelOutcome {
  let p = 0;
  let o = 0;
  for (const r of rounds) {
    const out = resolveStance(r.player, r.opp, type);
    if (out === "win") p++;
    else if (out === "lose") o++;
  }
  // Stat bonus shifts coin-flip ties
  const bonus = type.statBonus(s);
  if (p === o) {
    if (bonus >= 4) p++;
    else if (bonus <= -4) o++;
  }
  if (p > o) return "win";
  if (o > p) return "lose";
  return "draw";
}

export function applyDuelResult(s: GameState, typeId: string, outcome: DuelOutcome) {
  if (outcome === "win") {
    s.duelsWon += 1;
    if (typeId === "gahwa") s.gahwaWon += 1;
    if (typeId === "debate") s.debatesWon += 1;
    if (typeId === "falconry") s.falconryWon += 1;
    if (typeId === "brawl") s.brawlsWon += 1;
    s.stats.rep += typeId === "brawl" ? -3 : 4;
    s.stats.wasta += 2;
    if (typeId === "brawl") s.stats.money = Math.max(0, s.stats.money - 100);
  } else if (outcome === "lose") {
    s.duelsLost += 1;
    s.stats.rep -= 3;
  } else {
    s.stats.rep -= 1;
  }
}
