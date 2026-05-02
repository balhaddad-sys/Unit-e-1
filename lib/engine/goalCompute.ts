/**
 * Wasta · Engine: Next-Goal Computation
 * ──────────────────────────────────────────────────────────────────
 * Given a state, return the SINGLE most important next action.
 *
 * This is the single most important UX function in the game.
 * The Goal Bar at the top of every screen calls this on every render.
 *
 * Priority order (top wins):
 *   1. CRITICAL — energy < 20 → must rest
 *   2. STORY    — current act's story quest, in zone or elsewhere
 *   3. CHAIN    — a personal chain step waiting in current zone, or elsewhere
 *   4. UNLOCK   — NPC at 55-69 rel that's about to unlock a chain
 *   5. SIDE     — accepted side quest waiting here
 *   6. SOCIAL   — unmet NPCs in zone
 *   7. EXPLORE  — fallback travel suggestion
 *
 * To add a new goal type: add a case BELOW the priority point you want
 * it inserted at, and update the Goal type with its kind.
 */

import type { GameState, ZoneId } from "@/lib/types";
import { acts } from "@/lib/data/acts";
import { storyQuests } from "@/lib/data/quests/story";
import { personalChains } from "@/lib/data/chains";
import { npcs } from "@/lib/data/npcs";
import { zones } from "@/lib/data/zones";

export type GoalKind =
  | "rest"
  | "story_here"
  | "story_travel"
  | "story_start"
  | "story_finish"
  | "chain_here"
  | "chain_travel"
  | "unlock_here"
  | "unlock_travel"
  | "side_here"
  | "side_travel"
  | "social"
  | "explore";

export interface Goal {
  kind: GoalKind;
  /** Small text above title. Arabic. */
  label: string;
  /** Bold main line. Arabic. */
  title: string;
  /** Action target — either a tab to open or a zone to travel to. */
  target:
    | { tab: "home" | "places" | "people" | "quests" | "you" }
    | { travel: ZoneId }
    | { rest: true };
  icon: string;
}

export function computeNextGoal(state: GameState): Goal | null {
  // 1. CRITICAL — exhausted
  if (state.stats.energy < 20) {
    return {
      kind: "rest",
      label: "تعبت",
      title: "ارتح حتى الصبح",
      target: { rest: true },
      icon: "💤",
    };
  }

  // 2. STORY — find the active story quest for current act
  const currentActId = currentAct(state);
  const sqMeta = storyQuests.find((q) => q.act === currentActId);
  const sqProg = state.storyQuests.find((q) => q.id === sqMeta?.id);

  if (sqMeta && sqProg && !sqProg.completed) {
    if (!sqProg.started) {
      if (state.location === sqMeta.zone) {
        return {
          kind: "story_start",
          label: `الفصل ${getActNumber(currentActId)} · القصة`,
          title: `ابدأ: ${sqMeta.title}`,
          target: { tab: "quests" },
          icon: "▶",
        };
      }
      const target = zones.find((z) => z.id === sqMeta.zone);
      return {
        kind: "story_travel",
        label: "اذهب",
        title: `سافر ${target?.nameAr ?? sqMeta.zone} عشان نبدأ القصة`,
        target: { travel: sqMeta.zone },
        icon: "→",
      };
    }
    // Started — find next unfinished step
    const nextStepIdx = sqProg.stepsCompleted.findIndex((x) => !x);
    if (nextStepIdx === -1) {
      return {
        kind: "story_finish",
        label: "اختم القصة",
        title: sqMeta.title,
        target: { tab: "quests" },
        icon: "✓",
      };
    }
    const step = sqMeta.steps[nextStepIdx];
    return {
      kind: "story_here",
      label: `الخطوة ${nextStepIdx + 1} من ${sqMeta.steps.length}`,
      title: step.label,
      target: { tab: "quests" },
      icon: String(nextStepIdx + 1),
    };
  }

  // 3. CHAIN — active personal chain step
  for (const [npcId, prog] of Object.entries(state.personalChains)) {
    if (!prog.unlocked || prog.completed) continue;
    const chain = personalChains[npcId];
    if (!chain) continue;
    const step = chain.steps[prog.step];
    if (!step) continue;
    const npc = npcs.find((n) => n.id === npcId);
    const nameAr = npc?.nameAr ?? npcId;
    if (state.location === step.zone) {
      return {
        kind: "chain_here",
        label: `قصة ${nameAr}`,
        title: step.title,
        target: { tab: "quests" },
        icon: "♥",
      };
    }
    const target = zones.find((z) => z.id === step.zone);
    return {
      kind: "chain_travel",
      label: `قصة ${nameAr}`,
      title: `سافر ${target?.nameAr ?? step.zone}`,
      target: { travel: step.zone },
      icon: "→",
    };
  }

  // 4. UNLOCK — NPC near unlock threshold (rel 55-69)
  const closeToUnlock = Object.entries(state.relationships)
    .filter(([n, r]) => r >= 55 && r < 70 && personalChains[n] && !state.personalChains[n]?.unlocked)
    .sort((a, b) => b[1] - a[1])[0];

  if (closeToUnlock) {
    const [npcId] = closeToUnlock;
    const npc = npcs.find((n) => n.id === npcId);
    if (npc) {
      if (state.location === npc.zone) {
        return {
          kind: "unlock_here",
          label: `قريب من فتح قصة ${npc.nameAr}`,
          title: `قابل ${npc.nameAr} هنا`,
          target: { tab: "people" },
          icon: "✦",
        };
      }
      const target = zones.find((z) => z.id === npc.zone);
      return {
        kind: "unlock_travel",
        label: `قريب من فتح قصة ${npc.nameAr}`,
        title: `سافر ${target?.nameAr ?? npc.zone}`,
        target: { travel: npc.zone },
        icon: "→",
      };
    }
  }

  // 5. SIDE — accepted side quest in this zone
  const acceptedHere = state.sideQuests.find(
    (q) => q.accepted && !q.done && getQuestZone(q.id) === state.location
  );
  if (acceptedHere) {
    return {
      kind: "side_here",
      label: "كمل المهمة",
      title: getQuestTitle(acceptedHere.id),
      target: { tab: "quests" },
      icon: "▶",
    };
  }

  // 6. SOCIAL — unmet NPCs in current zone
  const unmetHere = npcs.filter(
    (n) => n.zone === state.location && (state.relationships[n.id] ?? 0) < 30
  );
  if (unmetHere.length > 0) {
    return {
      kind: "social",
      label: "ابن علاقات",
      title: `سلّم على ${unmetHere[0].nameAr}`,
      target: { tab: "people" },
      icon: "👥",
    };
  }

  // 7. EXPLORE
  return {
    kind: "explore",
    label: "خلصت اللي هنا",
    title: "سافر مكان جديد",
    target: { tab: "places" },
    icon: "→",
  };
}

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function currentAct(state: GameState): string {
  const completed = new Set(state.actsCompleted);
  const next = acts.find((a) => !completed.has(a.id));
  return next?.id ?? acts[acts.length - 1].id;
}

function getActNumber(actId: string): number {
  const a = acts.find((x) => x.id === actId);
  return a?.n ?? 1;
}

function getQuestZone(_id: string): ZoneId {
  // Side-quest data not yet wired — placeholder until Phase 2
  return "city";
}

function getQuestTitle(id: string): string {
  return id;
}
