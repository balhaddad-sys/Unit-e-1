// Act / story-quest / chain / milestone checks. Run after every meaningful action.

import type { GameState } from "@/lib/types";
import { acts, storyQuests } from "@/data/storyQuests";
import { personalChains } from "@/data/personalChains";
import { milestones } from "@/data/milestones";
import { checkEmergentTraits } from "@/engine/traits";

export function ensureStoryQuestProgress(s: GameState) {
  for (const q of storyQuests) {
    if (!s.storyQuests.find((x) => x.id === q.id)) {
      s.storyQuests.push({
        id: q.id,
        act: q.act,
        started: false,
        completed: false,
        stepsCompleted: q.steps.map(() => false),
        branchChoice: null,
      });
    }
  }
}

export function updateStoryQuestSteps(s: GameState) {
  ensureStoryQuestProgress(s);
  for (const q of storyQuests) {
    const prog = s.storyQuests.find((x) => x.id === q.id);
    if (!prog || prog.completed) continue;
    let advanced = false;
    q.steps.forEach((step, i) => {
      if (!prog.stepsCompleted[i] && step.check(s)) {
        prog.stepsCompleted[i] = true;
        prog.started = true;
        advanced = true;
      }
    });
    if (advanced) {
      // nothing to do — the UI will read this and offer the branch when all steps complete
    }
  }
}

export function isStoryQuestReadyForBranch(s: GameState, id: string): boolean {
  const prog = s.storyQuests.find((x) => x.id === id);
  if (!prog || prog.completed) return false;
  return prog.stepsCompleted.every(Boolean);
}

export function checkMilestones(s: GameState) {
  for (const m of milestones) {
    if (!s.milestonesUnlocked.includes(m.id) && m.check(s)) {
      s.milestonesUnlocked.push(m.id);
    }
  }
}

export function checkActProgress(s: GameState) {
  for (const act of acts) {
    if (s.actsCompleted.includes(act.id)) continue;
    if (act.exitCond(s)) {
      s.actsCompleted.push(act.id);
    }
  }
}

export function unlockPersonalChain(s: GameState, npcName: string) {
  if (!personalChains[npcName]) return;
  if (!s.personalProgress[npcName]) {
    s.personalProgress[npcName] = { step: 0, completed: false, unlocked: false };
  }
  const rel = s.relationships[npcName] || 0;
  if (rel >= 70) {
    s.personalProgress[npcName].unlocked = true;
  }
}

export function unlockAllPersonalChains(s: GameState) {
  for (const name of Object.keys(personalChains)) {
    unlockPersonalChain(s, name);
  }
  // Day-1 unlocks
  for (const name of ["Umm Nasser", "Bu Khalid", "Mubarak Al-Hawaj"]) {
    if (!s.personalProgress[name]) {
      s.personalProgress[name] = { step: 0, completed: false, unlocked: true };
    } else {
      s.personalProgress[name].unlocked = true;
    }
  }
}

export function tickProgression(s: GameState) {
  ensureStoryQuestProgress(s);
  updateStoryQuestSteps(s);
  unlockAllPersonalChains(s);
  checkEmergentTraits(s);
  checkMilestones(s);
  checkActProgress(s);
}

export function currentAct(s: GameState) {
  for (const a of acts) {
    if (!s.actsCompleted.includes(a.id)) return a;
  }
  return acts[acts.length - 1];
}
