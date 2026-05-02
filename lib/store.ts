/**
 * Wasta · Store
 * ──────────────────────────────────────────────────────────────────
 * Zustand wrapper around the reducer. Single store for all game state.
 *
 * Components read state via selectors; never reach into the store
 * directly except via dispatch.
 *
 * Auto-persists on every state change.
 */

"use client";

import { create } from "zustand";
import type { Character, GameEvent, GameState } from "@/lib/types";
import {
  createInitialState,
  reducer,
  save,
  load,
  clear,
  makeNotif,
} from "@/lib/engine";

interface Store {
  state: GameState | null;
  /** Dispatch one or many events. Persists after each call. */
  dispatch: (event: GameEvent | GameEvent[]) => void;
  /** Initialize new game from character. */
  newGame: (character: Character) => void;
  /** Hydrate from localStorage if present. */
  hydrate: () => void;
  /** Wipe save + reset state to null. */
  reset: () => void;
  /** Convenience helpers for common patterns. */
  pushNotif: (icon: string, text: string, kind?: "neutral" | "positive" | "negative" | "milestone") => void;
}

export const useGameStore = create<Store>((set, get) => ({
  state: null,

  dispatch: (event) => {
    const cur = get().state;
    if (!cur) return;
    const events = Array.isArray(event) ? event : [event];
    let next = cur;
    for (const e of events) {
      next = reducer(next, e);
    }
    set({ state: next });
    save(next);
  },

  newGame: (character) => {
    const fresh = createInitialState(character);
    set({ state: fresh });
    save(fresh);
  },

  hydrate: () => {
    const loaded = load();
    if (loaded) set({ state: loaded });
  },

  reset: () => {
    clear();
    set({ state: null });
  },

  pushNotif: (icon, text, kind = "neutral") => {
    const cur = get().state;
    if (!cur) return;
    const notif = makeNotif(cur, icon, text, kind);
    get().dispatch({ type: "PUSH_NOTIF", notif });
  },
}));
