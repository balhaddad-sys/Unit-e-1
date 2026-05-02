// src/engine/progression.ts
// Acts, story-quest steps, personal-chain unlocks, milestones.

import type { GameState } from "@/lib/types";
import { acts, storyQuests } from "@/data/storyQuests";
import { personalChains } from "@/data/personalChains";
import { milestones } from "@/data/milestones";
import { hasTrait } from "./traits";

export function currentAct(s: GameState) {
  const idx = (s.actsCompleted || []).length;
  return acts[Math.min(idx, acts.length - 1)];
}

// Run after most actions: advance act if exit conditions met
export function checkActProgress(s: GameState): { newAct?: string; closing?: string } {
  const cur = currentAct(s);
  if (!cur) return {};
  if (s.actsCompleted.includes(cur.id)) return {};
  if (cur.exitCond(s)) {
    s.actsCompleted.push(cur.id);
    return { newAct: cur.id, closing: cur.closingScene };
  }
  return {};
}

// Story quest progress
export function activeStoryQuest(s: GameState) {
  const cur = currentAct(s);
  return storyQuests.find((q) => q.act === cur.id);
}

export function ensureStoryQuestEntry(s: GameState, questId: string) {
  let entry = s.storyQuests.find((q) => q.id === questId);
  if (!entry) {
    const def = storyQuests.find((q) => q.id === questId);
    if (!def) return null;
    entry = {
      id: def.id,
      act: def.act,
      started: false,
      completed: false,
      stepsCompleted: def.steps.map(() => false),
      branchChoice: null,
    };
    s.storyQuests.push(entry);
  }
  return entry;
}

export function checkStoryQuestSteps(s: GameState) {
  const def = activeStoryQuest(s);
  if (!def) return null;
  const entry = ensureStoryQuestEntry(s, def.id);
  if (!entry || entry.completed) return null;
  entry.started = true;
  let allDone = true;
  for (let i = 0; i < def.steps.length; i++) {
    const ok = def.steps[i].check(s);
    entry.stepsCompleted[i] = ok;
    if (!ok) allDone = false;
  }
  return { def, entry, allDone };
}

// Personal chain progress
export function ensureChainEntry(s: GameState, npc: string) {
  if (!s.personalProgress[npc]) {
    s.personalProgress[npc] = { step: 0, completed: false, unlocked: false };
  }
  return s.personalProgress[npc];
}

export function chainUnlockedFor(s: GameState, npc: string): boolean {
  const ch = personalChains[npc];
  if (!ch) return false;
  if (ch.requiresTrait && !hasTrait(s, ch.requiresTrait)) return false;
  if (ch.forbidsTrait && hasTrait(s, ch.forbidsTrait)) return false;
  // Need decent rapport to start
  return (s.relationships[npc] || 0) >= 50;
}

export function unlockEligibleChains(s: GameState) {
  for (const npc of Object.keys(personalChains)) {
    if (chainUnlockedFor(s, npc)) {
      const e = ensureChainEntry(s, npc);
      e.unlocked = true;
    }
  }
}

// Milestones
export function checkMilestones(s: GameState): string[] {
  const newly: string[] = [];
  for (const m of milestones) {
    if (!s.milestonesUnlocked.includes(m.id) && m.check(s)) {
      s.milestonesUnlocked.push(m.id);
      newly.push(m.name);
    }
  }
  return newly;
}
