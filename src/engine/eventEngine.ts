// src/engine/eventEngine.ts
// Picks dilemmas, seasonal events, scandals based on current state.

import type { GameState, Dilemma, SeasonalEvent, ScandalEvent } from "@/lib/types";
import { dilemmas } from "@/data/dilemmas";
import { seasonalEvents } from "@/data/seasonalEvents";
import { scandalEvents } from "@/data/scandals";
import { hasTrait } from "./traits";

export function eligibleDilemmas(s: GameState): Dilemma[] {
  return dilemmas.filter((d) => {
    if (d.minDay && s.day < d.minDay) return false;
    if (d.maxDay && s.day > d.maxDay) return false;
    if (d.requiresTrait && !hasTrait(s, d.requiresTrait)) return false;
    if (d.forbidsTrait && hasTrait(s, d.forbidsTrait)) return false;
    if (d.requiresFlag && !s.worldFlags[d.requiresFlag]) return false;
    if (d.oneShot && s.eventsTriggered.includes(d.id)) return false;
    return true;
  });
}

export function pickDilemma(s: GameState): Dilemma | null {
  const elig = eligibleDilemmas(s);
  if (elig.length === 0) return null;
  return elig[Math.floor(Math.random() * elig.length)];
}

export function dueSeasonalEvent(s: GameState): SeasonalEvent | null {
  for (const e of seasonalEvents) {
    if (s.day >= e.triggerDay && !s.eventsTriggered.includes(e.id)) return e;
  }
  return null;
}

export function dueScandal(s: GameState): ScandalEvent | null {
  for (const e of scandalEvents) {
    if (e.triggerCheck(s)) return e;
  }
  return null;
}
