// src/engine/store.ts
// Zustand store with localStorage persistence and migration backfill.

"use client";

import { create } from "zustand";
import type { GameState, Appearance } from "@/lib/types";

const STORAGE_KEY = "wasta_state_v1";

const DEFAULT_APPEARANCE: Appearance = {
  style: "ghutra",
  skin: "s2",
  ghutra: "white",
  shayla: "black",
  beard: "trimmed",
  eyes: "dark",
  eyebrows: "natural",
  age: "adult",
  glasses: "none",
};

export const initialState: GameState = {
  givenName: "",
  honorific: "Bu",
  classId: "",
  bg: null,
  personality: "",
  accent: "emerald",
  appearance: DEFAULT_APPEARANCE,
  stats: { wasta: 0, money: 0, rep: 0, energy: 70 },
  factions: { merchants: 0, government: 0, tribal: 0, religious: 0 },
  location: "diwaniya",
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
  family: { spouse: null, children: [], parents_status: "alive" },
  businesses: [],
  properties: [],
  dilemmasSeen: [],
};

type Store = {
  state: GameState;
  hydrated: boolean;
  set: (mutator: (s: GameState) => void) => void;
  reset: () => void;
  hydrate: () => void;
};

function backfill(loaded: Partial<GameState>): GameState {
  const merged: GameState = {
    ...initialState,
    ...loaded,
    stats: { ...initialState.stats, ...(loaded.stats || {}) },
    factions: { ...initialState.factions, ...(loaded.factions || {}) },
    appearance: { ...DEFAULT_APPEARANCE, ...(loaded.appearance || {}) },
    family: { ...initialState.family, ...(loaded.family || {}) },
    relationships: loaded.relationships || {},
    worldFlags: loaded.worldFlags || {},
    npcMemory: loaded.npcMemory || {},
    personalProgress: loaded.personalProgress || {},
    quests: loaded.quests || [],
    storyQuests: loaded.storyQuests || [],
    milestonesUnlocked: loaded.milestonesUnlocked || [],
    actsCompleted: loaded.actsCompleted || [],
    favors: loaded.favors || [],
    story: loaded.story || [],
    zonesVisited: loaded.zonesVisited || [],
    eventsTriggered: loaded.eventsTriggered || [],
    traits: loaded.traits || [],
    businesses: loaded.businesses || [],
    properties: loaded.properties || [],
    dilemmasSeen: loaded.dilemmasSeen || [],
  };
  return merged;
}

function save(s: GameState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // out of quota — silent
  }
}

export const useGame = create<Store>((set, get) => ({
  state: initialState,
  hydrated: false,
  set: (mutator) => {
    set((store) => {
      const next = JSON.parse(JSON.stringify(store.state)) as GameState;
      mutator(next);
      save(next);
      return { state: next };
    });
  },
  reset: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ state: JSON.parse(JSON.stringify(initialState)), hydrated: true });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    if (get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GameState>;
        set({ state: backfill(parsed), hydrated: true });
        return;
      }
    } catch {
      // corrupt save — fall through
    }
    set({ hydrated: true });
  },
}));
