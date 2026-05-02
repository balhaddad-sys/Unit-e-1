// Pick the next dilemma / seasonal event / scandal to fire.

import type { Dilemma, GameState, ScandalEvent, SeasonalEvent } from "@/lib/types";
import { dilemmas } from "@/data/dilemmas";
import { seasonalEvents } from "@/data/seasonalEvents";
import { scandals } from "@/data/scandals";
import { hasTrait } from "@/engine/traits";

export function pickDilemma(s: GameState): Dilemma | null {
  const eligible = dilemmas.filter((d) => {
    if (d.minDay && s.day < d.minDay) return false;
    if (d.maxDay && s.day > d.maxDay) return false;
    if (d.requiresTrait && !hasTrait(s, d.requiresTrait)) return false;
    if (d.forbidsTrait && hasTrait(s, d.forbidsTrait)) return false;
    if (d.requiresFlag && !s.worldFlags[d.requiresFlag]) return false;
    if (d.oneShot && s.dilemmasSeen.includes(d.id)) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export function pickSeasonalEvent(s: GameState): SeasonalEvent | null {
  for (const e of seasonalEvents) {
    if (s.day >= e.triggerDay && !s.eventsTriggered.includes(e.id)) {
      return e;
    }
  }
  return null;
}

export function pickScandal(s: GameState): ScandalEvent | null {
  for (const sc of scandals) {
    if (sc.triggerCheck(s) && !s.eventsTriggered.includes(sc.id)) {
      return sc;
    }
  }
  return null;
}
