// src/engine/actions.ts
// Top-level player actions. Each mutates state and returns a result message.

import type { GameState, NPC } from "@/lib/types";
import { applyReward } from "./rewards";
import { traitAffinityBonus, addTrait, hasTrait } from "./traits";
import { getZone } from "@/data/zones";
import { getNpc } from "@/data/npcs";
import {
  checkActProgress,
  checkStoryQuestSteps,
  checkMilestones,
  unlockEligibleChains,
  ensureChainEntry,
} from "./progression";
import { personalChains } from "@/data/personalChains";
import { storyQuests } from "@/data/storyQuests";

export type ActionResult = {
  ok: boolean;
  message: string;
  toasts?: string[];
};

const PERSONALITY_REP_BONUS: Record<string, number> = {
  generous: 1,
  patient: 0,
  ambitious: 0,
  discreet: 0,
};

// Greet — small, low-cost, friendly action
export function greet(s: GameState, npcName: string): ActionResult {
  const npc = getNpc(npcName);
  if (!npc) return { ok: false, message: `Unknown person.` };
  if (s.location !== npc.zone) return { ok: false, message: `${npc.name} is not here.` };
  if (s.stats.energy < 4) return { ok: false, message: "Too tired to be charming." };

  const traitBonus = traitAffinityBonus(s, npc.values, npc.dislikes);
  const personalityBonus = PERSONALITY_REP_BONUS[s.personality] || 0;
  const gain = 4 + traitBonus + personalityBonus;

  s.relationships[npcName] = Math.min(100, (s.relationships[npcName] || npc.baseRel) + gain);
  applyReward(s, { energy: -4, rep: 1 });
  postAction(s);

  return {
    ok: true,
    message: `You greet ${npc.name}. ${gain >= 6 ? "They warm to you." : gain <= 1 ? "They are guarded." : "Civil exchange."}`,
  };
}

// Ask favor — costly, depends on relationship + wasta
export function askFavor(s: GameState, npcName: string): ActionResult {
  const npc = getNpc(npcName);
  if (!npc) return { ok: false, message: `Unknown person.` };
  if (s.location !== npc.zone) return { ok: false, message: `${npc.name} is not here.` };
  if (s.stats.energy < 8) return { ok: false, message: "You don't have it in you right now." };
  const rel = s.relationships[npcName] || npc.baseRel;
  if (rel < 35) return { ok: false, message: `${npc.name} doesn't know you well enough yet.` };

  const wastaCost = 3;
  if (s.stats.wasta < wastaCost) return { ok: false, message: "You're too new — your name isn't worth the ask." };

  applyReward(s, { wasta: -wastaCost, energy: -8 });
  applyReward(s, { money: 80 + Math.floor(rel * 1.5), rep: -1 });
  s.favors.push({ who: npc.name, kind: "youOwe", weight: rel >= 75 ? "medium" : "small", reason: "asked a favor" });
  if (!hasTrait(s, "indebted") && rel < 60) addTrait(s, "indebted");
  s.relationships[npcName] = Math.max(0, rel - 4);
  postAction(s);

  return {
    ok: true,
    message: `${npc.name} delivers. The favor lands — but you owe.`,
  };
}

// Help them — invest energy in someone, builds rapport, costs you
export function helpThem(s: GameState, npcName: string): ActionResult {
  const npc = getNpc(npcName);
  if (!npc) return { ok: false, message: `Unknown person.` };
  if (s.location !== npc.zone) return { ok: false, message: `${npc.name} is not here.` };
  if (s.stats.energy < 12) return { ok: false, message: "You're too tired to do this properly." };

  const traitBonus = traitAffinityBonus(s, npc.values, npc.dislikes);
  const personalityBonus = s.personality === "generous" ? 4 : 0;
  const relGain = 8 + traitBonus + personalityBonus;
  s.relationships[npcName] = Math.min(100, (s.relationships[npcName] || npc.baseRel) + relGain);
  applyReward(s, { energy: -12, rep: 2, wasta: 1 });
  // They now owe you a small favor
  s.favors.push({ who: npc.name, kind: "owedToYou", weight: "small", reason: "you helped them" });
  postAction(s);

  return { ok: true, message: `${npc.name} won't forget that.` };
}

// Travel — change location. May trigger a dilemma roll.
export function travel(s: GameState, zoneId: string): { ok: boolean; message: string; rollDilemma?: boolean } {
  const z = getZone(zoneId);
  if (!z) return { ok: false, message: "Unknown destination." };
  if (s.location === zoneId) return { ok: false, message: `You're already at ${z.en}.` };
  if (s.stats.energy < z.cost) return { ok: false, message: `Too far. You'd burn out before arriving.` };

  applyReward(s, { energy: -z.cost });
  s.location = zoneId;
  s.subLocation = null;
  s.time = (s.time + 2) % 24;
  if (!s.zonesVisited.includes(zoneId)) s.zonesVisited.push(zoneId);
  postAction(s);

  const rollDilemma = Math.random() < 0.3;
  return { ok: true, message: `You travel to ${z.en}.`, rollDilemma };
}

// Visit a sub-location — small flavor cost, contextual encounters can fire
export function visitSubLocation(s: GameState, sublocId: string, energyCost: number): ActionResult {
  if (s.stats.energy < energyCost) return { ok: false, message: "Not enough energy for that detour." };
  applyReward(s, { energy: -energyCost });
  s.subLocation = sublocId;
  s.time = (s.time + 1) % 24;
  postAction(s);
  return { ok: true, message: "You spend some time there." };
}

// Rest — advances day. Always triggers a dilemma roll (per spec).
export function rest(s: GameState): { ok: boolean; message: string; rollDilemma: boolean } {
  s.day += 1;
  s.time = 8;
  // Restore energy. Patient personality regenerates faster.
  const regen = s.personality === "patient" ? 80 : 65;
  s.stats.energy = Math.min(150, s.stats.energy + regen);

  // Business income if any
  if (s.businesses && s.businesses.length > 0 && s.day % 7 === 0) {
    let total = 0;
    for (const b of s.businesses) {
      const factor = (b.health || 100) / 100;
      const amt = Math.round((b.monthlyIncome / 4) * factor);
      total += amt;
      // Health declines if neglected (we have no engagement metric, so trickle down)
      b.health = Math.max(20, b.health - 1);
    }
    if (total > 0) applyReward(s, { money: total });
  }

  postAction(s);
  return { ok: true, message: "You rest. The day turns.", rollDilemma: true };
}

// Common post-action plumbing
export function postAction(s: GameState) {
  unlockEligibleChains(s);
  checkMilestones(s);
  // Auto-advance act if exit cond met (handled by the UI on tick too)
  checkActProgress(s);
  checkStoryQuestSteps(s);
}

// Personal chain — accept current step (just records intent)
export function chainAccept(s: GameState, npcName: string): ActionResult {
  const ch = personalChains[npcName];
  if (!ch) return { ok: false, message: "No chain for that person." };
  const e = ensureChainEntry(s, npcName);
  if (!e.unlocked) return { ok: false, message: `${npcName} doesn't trust you with this yet.` };
  return { ok: true, message: `You accept ${npcName}'s request.` };
}

// Personal chain — complete current step
export function chainAdvance(s: GameState, npcName: string): ActionResult {
  const ch = personalChains[npcName];
  if (!ch) return { ok: false, message: "No chain for that person." };
  const e = ensureChainEntry(s, npcName);
  if (!e.unlocked) return { ok: false, message: `${npcName} doesn't trust you with this yet.` };
  if (e.completed) return { ok: false, message: "Already complete." };

  const step = ch.steps[e.step];
  if (!step) return { ok: false, message: "Chain malformed." };
  if (s.location !== step.zone)
    return { ok: false, message: `You need to be at ${step.zone} for this step.` };
  if (s.stats.energy < step.energy) return { ok: false, message: "Too drained." };

  applyReward(s, { energy: -step.energy });
  applyReward(s, step.rewards);
  e.step += 1;

  if (e.step >= ch.steps.length) {
    e.completed = true;
    s.personalQuestsDone += 1;
    if (ch.gainsTrait) addTrait(s, ch.gainsTrait);
    if (ch.unlocksFlag) s.worldFlags[ch.unlocksFlag] = true;
    postAction(s);
    return { ok: true, message: ch.completion };
  }

  postAction(s);
  return { ok: true, message: `Step closed. The next step waits.` };
}

export function makeStoryBranchChoice(s: GameState, optionId: string): ActionResult {
  const cur = storyQuests.find((q) => !s.actsCompleted.includes(q.act));
  return makeStoryBranchChoiceFor(s, cur?.id, optionId);
}

export function makeStoryBranchChoiceFor(s: GameState, questId: string | undefined, optionId: string): ActionResult {
  if (!questId) return { ok: false, message: "No active story quest." };
  const def = storyQuests.find((q) => q.id === questId);
  if (!def || !def.branch) return { ok: false, message: "No branch on this quest." };
  const opt = def.branch.options.find((o) => o.id === optionId);
  if (!opt) return { ok: false, message: "Unknown option." };
  if (opt.requiresTrait && !hasTrait(s, opt.requiresTrait))
    return { ok: false, message: "You don't have what's needed to choose this." };
  if (opt.forbidsTrait && hasTrait(s, opt.forbidsTrait))
    return { ok: false, message: "Your character can no longer choose this." };

  const entry = s.storyQuests.find((q) => q.id === questId);
  if (entry) {
    entry.branchChoice = optionId;
    entry.completed = true;
  }
  applyReward(s, def.rewards || {});
  opt.effect(s);
  if (opt.gainsTrait) addTrait(s, opt.gainsTrait);
  postAction(s);

  return { ok: true, message: def.closing || "The choice is made." };
}
