// src/engine/rewards.ts
// Apply Reward objects to the GameState. Single source of truth for stat changes.

import type { GameState, Reward, FactionId } from "@/lib/types";
import { addTrait, removeTrait, checkEmergentTraits } from "./traits";

export function applyReward(s: GameState, r: Reward) {
  if (typeof r.wasta === "number") s.stats.wasta = Math.max(0, s.stats.wasta + r.wasta);
  if (typeof r.money === "number") s.stats.money = Math.max(0, s.stats.money + r.money);
  if (typeof r.rep === "number") s.stats.rep = s.stats.rep + r.rep;
  if (typeof r.energy === "number")
    s.stats.energy = Math.max(0, Math.min(150, s.stats.energy + r.energy));

  if (r.faction && typeof r.factionAmt === "number") {
    s.factions[r.faction] = (s.factions[r.faction] || 0) + r.factionAmt;
  }
  if (r.factions) {
    for (const k of Object.keys(r.factions) as FactionId[]) {
      const v = r.factions[k] || 0;
      s.factions[k] = (s.factions[k] || 0) + v;
    }
  }
  if (r.trait) addTrait(s, r.trait);
  if (r.removeTrait) removeTrait(s, r.removeTrait);
  if (r.flag) s.worldFlags[r.flag] = true;

  // After every reward, check for emergent designations
  checkEmergentTraits(s);

  // Rock-bottom safeguard — sets the "exiled" trait if everything cratered
  if (
    s.stats.wasta < 5 &&
    s.stats.rep < -10 &&
    s.factions.government < -15 &&
    !s.traits.includes("exiled")
  ) {
    addTrait(s, "exiled");
  }
}
