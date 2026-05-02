// src/engine/store.ts
// Zustand store. Persists the entire GameState to localStorage.
// All gameplay mutations go through `set` with a draft callback.

import { create } from "zustand";
import type { GameState } from "@/lib/types";
import { defaultAppearance } from "@/data/appearance";

const SAVE_KEY = "wasta_state";
const ACCENT_KEY = "wasta_accent";

export function freshState(): GameState {
  return {
    givenName: "",
    honorific: "Bu",
    classId: "",
    bg: null,
    personality: "",
    accent: "emerald",
    appearance: defaultAppearance(),

    stats: { wasta: 0, money: 0, rep: 0, energy: 100 },
    factions: { merchants: 0, government: 0, tribal: 0, religious: 0 },

    location: "city",
    subLocation: null,
    day: 1,
    time: 8,

    quests: [],
    questsDone: 0,
    zonesVisited: [],

    relationships: {},
    favors: [],
    npcMemory: {},

    story: [],
    milestonesUnlocked: [],
    actsCompleted: [],
    storyQuests: [],

    personalProgress: {},
    personalQuestsDone: 0,

    duelsWon: 0,
    gahwaWon: 0,
    debatesWon: 0,
    falconryWon: 0,
    brawlsWon: 0,
    duelsLost: 0,

    eventsTriggered: [],
    worldFlags: {},
    endingPath: null,

    traits: [],

    romance: null,

    family: {
      spouse: null,
      children: [],
      parents_status: "alive",
    },

    businesses: [],
    properties: [],
  };
}

// Backfill any missing fields from older saves
function hydrate(raw: Partial<GameState>): GameState {
  const base = freshState();
  return {
    ...base,
    ...raw,
    stats: { ...base.stats, ...(raw.stats || {}) },
    factions: { ...base.factions, ...(raw.factions || {}) },
    appearance: { ...base.appearance, ...(raw.appearance || {}) },
    relationships: { ...(raw.relationships || {}) },
    favors: raw.favors || [],
    npcMemory: raw.npcMemory || {},
    story: raw.story || [],
    quests: raw.quests || [],
    zonesVisited: raw.zonesVisited || [],
    milestonesUnlocked: raw.milestonesUnlocked || [],
    actsCompleted: raw.actsCompleted || [],
    storyQuests: raw.storyQuests || [],
    personalProgress: raw.personalProgress || {},
    eventsTriggered: raw.eventsTriggered || [],
    worldFlags: raw.worldFlags || {},
    traits: raw.traits || [],
    family: {
      spouse: raw.family?.spouse ?? null,
      children: raw.family?.children || [],
      parents_status: raw.family?.parents_status || "alive",
    },
    businesses: raw.businesses || [],
    properties: raw.properties || [],
    romance: raw.romance ?? null,
    endingPath: raw.endingPath ?? null,
  };
}

function load(): { state: GameState | null; accent: string } {
  if (typeof window === "undefined") return { state: null, accent: "emerald" };
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    const accent = window.localStorage.getItem(ACCENT_KEY) || "emerald";
    if (raw) return { state: hydrate(JSON.parse(raw)), accent };
    return { state: null, accent };
  } catch {
    return { state: null, accent: "emerald" };
  }
}

function save(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    window.localStorage.setItem(ACCENT_KEY, state.accent);
  } catch {
    /* ignore */
  }
}

type Toast = { id: number; text: string };

type Store = {
  state: GameState;
  hydrated: boolean;
  toasts: Toast[];

  hydrate: () => void;
  reset: () => void;
  setState: (mutator: (s: GameState) => void) => void;
  pushToast: (text: string) => void;
  dismissToast: (id: number) => void;
};

let _toastId = 0;

export const useGame = create<Store>((set, get) => ({
  state: freshState(),
  hydrated: false,
  toasts: [],

  hydrate: () => {
    if (get().hydrated) return;
    const { state, accent } = load();
    if (state) {
      // ensure accent persists across reloads
      state.accent = accent;
      set({ state, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  reset: () => {
    const fresh = freshState();
    save(fresh);
    set({ state: fresh });
  },

  setState: (mutator) => {
    const draft: GameState = JSON.parse(JSON.stringify(get().state));
    mutator(draft);
    save(draft);
    set({ state: draft });
  },

  pushToast: (text) => {
    const id = ++_toastId;
    set((s) => ({ toasts: [...s.toasts, { id, text }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },

  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export function isCharacterReady(s: GameState): boolean {
  return Boolean(s.givenName && s.classId && s.bg && s.personality);
}
