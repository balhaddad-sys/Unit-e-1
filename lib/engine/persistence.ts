/**
 * Wasta · Engine: Persistence
 * ──────────────────────────────────────────────────────────────────
 * Saves game state to localStorage.
 * Includes schema versioning for forward-compatible migrations.
 */

import type { GameState } from "@/lib/types";
import { SCHEMA } from "./initialState";

const STORAGE_KEY = "wasta_state_v2";

export function save(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Out of space or in private mode — fail silently for now.
    console.warn("Wasta: save failed", e);
  }
}

export function load(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== SCHEMA) {
      // Future migrations go here. For now, refuse incompatible saves.
      console.warn(`Wasta: save schema mismatch (v${parsed.version} vs current v${SCHEMA})`);
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn("Wasta: load failed", e);
    return null;
  }
}

export function clear(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
