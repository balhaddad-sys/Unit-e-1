// src/engine/duelEngine.ts
// Stance resolution for duels. Returns -1 / 0 / 1 (lose / draw / win) per round.

import type { GameState, DuelType } from "@/lib/types";

export type DuelResult = "win" | "lose" | "draw";

export function resolveStance(
  type: DuelType,
  playerStanceId: string,
  oppStanceId: string,
): -1 | 0 | 1 {
  if (playerStanceId === oppStanceId) return 0;
  const ps = type.stances.find((s) => s.id === playerStanceId);
  if (ps && ps.beats === oppStanceId) return 1;
  return -1;
}

// Pick the opponent's stance — slightly random, slightly weighted by player's stat bonus
export function aiPickStance(type: DuelType, s: GameState): string {
  const bonus = type.statBonus(s);
  // Higher bonus → AI picks suboptimally more often (player advantage)
  const skill = Math.max(0, 0.5 - bonus * 0.03);
  if (Math.random() > skill) {
    return type.stances[Math.floor(Math.random() * type.stances.length)].id;
  }
  // "Smart" pick: random anyway in this simplified model
  return type.stances[Math.floor(Math.random() * type.stances.length)].id;
}

export function decideDuelOutcome(roundResults: number[]): DuelResult {
  const score = roundResults.reduce((a, b) => a + b, 0);
  if (score > 0) return "win";
  if (score < 0) return "lose";
  return "draw";
}

export function duelTypeRewards(typeId: string, result: DuelResult) {
  const baseWin = { wasta: 6, rep: 4 };
  const baseLose = { rep: -3 };
  const baseDraw = { rep: 1 };
  const multipliers: Record<string, number> = {
    gahwa: 1, debate: 1.2, falconry: 1.4, brawl: 1.5,
  };
  const m = multipliers[typeId] ?? 1;
  if (result === "win") return { wasta: Math.round(baseWin.wasta * m), rep: Math.round(baseWin.rep * m) };
  if (result === "lose") return { rep: Math.round(baseLose.rep * m) };
  return { rep: baseDraw.rep };
}
