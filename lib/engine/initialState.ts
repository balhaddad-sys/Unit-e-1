/**
 * Wasta · Engine: initial state
 * ──────────────────────────────────────────────────────────────────
 * Pure factory for new game state. No side effects, no randomness.
 */

import type {
  Character,
  ClassId,
  GameState,
  PersonalityId,
  Stats,
  FactionStanding,
} from "@/lib/types";

const SCHEMA_VERSION = 1;

const STARTING_STATS: Record<ClassId, Stats> = {
  oil: { wasta: 12, money: 900, rep: 8, energy: 70 },
  gov: { wasta: 18, money: 450, rep: 12, energy: 75 },
  falcon: { wasta: 8, money: 300, rep: 10, energy: 110 },
  merchant: { wasta: 14, money: 700, rep: 9, energy: 80 },
};

const STARTING_FACTIONS: Record<ClassId, Partial<FactionStanding>> = {
  oil: { merchants: 5, government: 3 },
  gov: { government: 8, religious: 2 },
  falcon: { tribal: 8 },
  merchant: { merchants: 8, tribal: 2 },
};

const PERSONALITY_ENERGY_BONUS: Record<PersonalityId, number> = {
  patient: 10,
  generous: 0,
  ambitious: 0,
  discreet: 0,
};

export function createInitialState(character: Character): GameState {
  const baseStats = STARTING_STATS[character.classId];
  const energyBonus = PERSONALITY_ENERGY_BONUS[character.personality] ?? 0;
  const factions: FactionStanding = {
    tribal: 0,
    merchants: 0,
    government: 0,
    religious: 0,
    ...STARTING_FACTIONS[character.classId],
  };

  return {
    character,
    day: 1,
    time: 8,
    location: "city",
    zonesVisited: ["city"],
    stats: { ...baseStats, energy: baseStats.energy + energyBonus },
    factions,
    relationships: {},
    favors: [],
    npcMemory: {},
    traits: [],
    sideQuests: [],
    storyQuests: [],
    personalChains: {},
    questsDone: 0,
    duelsWon: 0,
    duelsLost: 0,
    gahwaWon: 0,
    debatesWon: 0,
    falconryWon: 0,
    actsCompleted: [],
    worldFlags: {},
    notifications: [],
    unreadNotifs: 0,
    tutorialDone: false,
    prologueIndex: 0,
    version: SCHEMA_VERSION,
  };
}

/** Has the player committed to a specific trait? */
export function hasTrait(state: GameState, trait: GameState["traits"][number]): boolean {
  return state.traits.includes(trait);
}

/** Does the player carry a flag? Truthy check on worldFlags. */
export function hasFlag(state: GameState, key: string): boolean {
  return Boolean(state.worldFlags[key]);
}

/** Energy cap by class. Used to prevent over-restoration. */
export function energyCap(classId: ClassId): number {
  return STARTING_STATS[classId].energy + 30;
}

/** Capacity for a given relationship score. */
export function relTier(rel: number): { name: string; n: number } {
  if (rel >= 90) return { name: "أخوي", n: 4 };
  if (rel >= 70) return { name: "صديق", n: 3 };
  if (rel >= 40) return { name: "معرفة", n: 2 };
  if (rel >= 15) return { name: "وجه يعرف", n: 1 };
  return { name: "غريب", n: 0 };
}

export const SCHEMA = SCHEMA_VERSION;
