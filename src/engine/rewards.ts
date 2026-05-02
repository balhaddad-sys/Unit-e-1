// Apply a reward to the game state. Mutating — use within a Zustand setter.

import type { GameState, Reward, FactionId } from "@/lib/types";
import { addTrait, removeTrait, checkEmergentTraits } from "@/engine/traits";

export function applyReward(s: GameState, r: Reward) {
  if (r.wasta) s.stats.wasta += r.wasta;
  if (r.money) s.stats.money = Math.max(0, s.stats.money + r.money);
  if (r.rep) s.stats.rep += r.rep;
  if (r.energy) s.stats.energy = Math.max(0, Math.min(120, s.stats.energy + r.energy));

  if (r.faction && r.factionAmt) {
    s.factions[r.faction] = (s.factions[r.faction] || 0) + r.factionAmt;
  }
  if (r.factions) {
    for (const k of Object.keys(r.factions) as FactionId[]) {
      const v = r.factions[k];
      if (typeof v === "number") s.factions[k] = (s.factions[k] || 0) + v;
    }
  }

  if (r.flag) s.worldFlags[r.flag] = true;
  if (r.trait) addTrait(s, r.trait);
  if (r.removeTrait) removeTrait(s, r.removeTrait);

  checkEmergentTraits(s);
  rockBottomCheck(s);
}

export function rockBottomCheck(s: GameState) {
  if (
    (s.stats.wasta < 0 || s.stats.rep < -10) &&
    !s.worldFlags.rock_bottom_seen
  ) {
    s.worldFlags.rock_bottom_seen = true;
    s.worldFlags.rock_bottom_pending = true;
  }
}
