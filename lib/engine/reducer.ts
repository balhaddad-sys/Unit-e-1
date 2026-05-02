/**
 * Wasta · Engine: Reducer
 * ──────────────────────────────────────────────────────────────────
 * The ONLY place GameState is mutated.
 * Components dispatch GameEvents. The reducer applies them.
 *
 * Rules:
 *   1. Pure function — no I/O, no random, no Date.now().
 *   2. Always returns a new state object — never mutates input.
 *   3. Side effects (notifications, ripples) are computed downstream.
 *
 * If you find yourself wanting to put logic here that depends on
 * randomness or external data, that logic belongs in /lib/engine/effects
 * and gets called BEFORE you dispatch.
 */

import type {
  GameEvent,
  GameState,
  Notification,
} from "@/lib/types";
import { energyCap } from "./initialState";

export function reducer(state: GameState, event: GameEvent): GameState {
  switch (event.type) {
    // ──────────────────────────────────────────────────────────────
    case "INIT":
      // Handled at provider level — included for type completeness.
      return state;

    // ──────────────────────────────────────────────────────────────
    case "PROLOGUE_CHOICE": {
      const newFlags = { ...state.worldFlags, [event.flag]: true };
      const newTraits =
        event.trait && !state.traits.includes(event.trait)
          ? [...state.traits, event.trait]
          : state.traits;
      return {
        ...state,
        worldFlags: newFlags,
        traits: newTraits,
        prologueIndex: state.prologueIndex + 1,
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "TUTORIAL_DONE":
      return { ...state, tutorialDone: true };

    // ──────────────────────────────────────────────────────────────
    case "TRAVEL": {
      if (state.stats.energy < event.energyCost) return state;
      const visited = state.zonesVisited.includes(event.to)
        ? state.zonesVisited
        : [...state.zonesVisited, event.to];
      return {
        ...state,
        location: event.to,
        zonesVisited: visited,
        stats: {
          ...state.stats,
          energy: Math.max(0, state.stats.energy - event.energyCost),
        },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "REST": {
      const cap = energyCap(state.character.classId);
      const personalityBonus =
        state.character.personality === "patient" ? Math.floor(cap * 0.2) : 0;
      return {
        ...state,
        day: state.day + 1,
        time: 7,
        stats: { ...state.stats, energy: Math.min(cap, cap + personalityBonus) },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "ADVANCE_TIME":
      return { ...state, time: (state.time + event.hours) % 24 };

    // ──────────────────────────────────────────────────────────────
    case "STAT_DELTA": {
      const cap = energyCap(state.character.classId);
      const next = state.stats[event.stat] + event.amount;
      const clamped =
        event.stat === "energy"
          ? Math.max(0, Math.min(cap, next))
          : event.stat === "money"
            ? Math.max(0, next)
            : next; // wasta and rep can go negative
      return {
        ...state,
        stats: { ...state.stats, [event.stat]: clamped },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "FACTION_DELTA":
      return {
        ...state,
        factions: {
          ...state.factions,
          [event.faction]: Math.max(0, (state.factions[event.faction] ?? 0) + event.amount),
        },
      };

    // ──────────────────────────────────────────────────────────────
    case "REL_DELTA": {
      const cur = state.relationships[event.npc] ?? 0;
      return {
        ...state,
        relationships: {
          ...state.relationships,
          [event.npc]: Math.max(0, Math.min(100, cur + event.amount)),
        },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "GAIN_TRAIT":
      if (state.traits.includes(event.trait)) return state;
      return { ...state, traits: [...state.traits, event.trait] };

    // ──────────────────────────────────────────────────────────────
    case "REMEMBER_NPC": {
      const existing = state.npcMemory[event.npc] ?? [];
      const newEntry = { day: state.day, text: event.text };
      const trimmed = [newEntry, ...existing].slice(0, 4);
      return {
        ...state,
        npcMemory: { ...state.npcMemory, [event.npc]: trimmed },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "ADD_FAVOR":
      return { ...state, favors: [...state.favors, event.favor] };

    case "CONSUME_FAVOR": {
      const idx = state.favors.findIndex(
        (f) => f.who === event.npc && f.kind === "owedToYou"
      );
      if (idx === -1) return state;
      return {
        ...state,
        favors: state.favors.filter((_, i) => i !== idx),
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "ACCEPT_QUEST":
      return {
        ...state,
        sideQuests: state.sideQuests.map((q) =>
          q.id === event.id ? { ...q, accepted: true } : q
        ),
      };

    case "PROGRESS_QUEST":
      return {
        ...state,
        sideQuests: state.sideQuests.map((q) =>
          q.id === event.id ? { ...q, progress: q.progress + 1 } : q
        ),
      };

    case "COMPLETE_QUEST":
      return {
        ...state,
        sideQuests: state.sideQuests.map((q) =>
          q.id === event.id ? { ...q, done: true } : q
        ),
        questsDone: state.questsDone + 1,
      };

    // ──────────────────────────────────────────────────────────────
    case "START_STORY_QUEST":
      return {
        ...state,
        storyQuests: state.storyQuests.map((q) =>
          q.id === event.id ? { ...q, started: true } : q
        ),
      };

    case "COMPLETE_STORY_QUEST_STEP":
      return {
        ...state,
        storyQuests: state.storyQuests.map((q) =>
          q.id === event.id
            ? {
                ...q,
                stepsCompleted: q.stepsCompleted.map((s, i) => (i === event.stepIdx ? true : s)),
              }
            : q
        ),
      };

    case "COMPLETE_STORY_QUEST":
      return {
        ...state,
        storyQuests: state.storyQuests.map((q) =>
          q.id === event.id
            ? { ...q, completed: true, branchChoice: event.branchChoice }
            : q
        ),
        questsDone: state.questsDone + 2,
      };

    // ──────────────────────────────────────────────────────────────
    case "UNLOCK_CHAIN":
      return {
        ...state,
        personalChains: {
          ...state.personalChains,
          [event.npc]: state.personalChains[event.npc] ?? {
            npc: event.npc,
            unlocked: true,
            step: 0,
            completed: false,
          },
        },
      };

    case "ADVANCE_CHAIN": {
      const cur = state.personalChains[event.npc];
      if (!cur) return state;
      return {
        ...state,
        personalChains: {
          ...state.personalChains,
          [event.npc]: { ...cur, step: cur.step + 1 },
        },
      };
    }

    case "COMPLETE_CHAIN": {
      const cur = state.personalChains[event.npc];
      if (!cur) return state;
      return {
        ...state,
        personalChains: {
          ...state.personalChains,
          [event.npc]: { ...cur, completed: true },
        },
      };
    }

    // ──────────────────────────────────────────────────────────────
    case "COMPLETE_ACT":
      if (state.actsCompleted.includes(event.actId)) return state;
      return {
        ...state,
        actsCompleted: [...state.actsCompleted, event.actId],
      };

    // ──────────────────────────────────────────────────────────────
    case "SET_FLAG":
      return {
        ...state,
        worldFlags: { ...state.worldFlags, [event.key]: event.value },
      };

    // ──────────────────────────────────────────────────────────────
    case "PUSH_NOTIF": {
      const trimmed = [event.notif, ...state.notifications].slice(0, 60);
      return {
        ...state,
        notifications: trimmed,
        unreadNotifs: state.unreadNotifs + 1,
      };
    }

    case "MARK_NOTIFS_READ":
      return { ...state, unreadNotifs: 0 };

    // ──────────────────────────────────────────────────────────────
    default: {
      // Exhaustiveness check — TS will error if a case is unhandled.
      const _exhaustive: never = event;
      return state;
    }
  }
}

/** Convenience: build a Notification with current day/time. */
export function makeNotif(
  state: GameState,
  icon: string,
  text: string,
  kind: Notification["kind"] = "neutral"
): Notification {
  return { day: state.day, time: state.time, icon, text, kind };
}
