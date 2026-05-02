/**
 * Wasta · Core Type Definitions
 * ──────────────────────────────────────────────────────────────────
 * This file is the single source of truth for game state.
 * Every other file imports from here. Changes here cascade.
 *
 * When adding a new feature, ALWAYS extend the types first.
 * Then update the engine. Then update the data. Then the UI.
 *
 * Naming convention:
 *   - `Foo` = pure data shape (no methods)
 *   - `FooState` = a slice of GameState
 *   - `FooEvent` = something that happens (used by reducer)
 *   - `FooMeta` = static configuration data (immutable)
 */

// ═════════════════════════════════════════════════════════════════
// PRIMITIVES
// ═════════════════════════════════════════════════════════════════

/** A faction in Kuwaiti society. Standing in each is tracked separately. */
export type FactionId = "tribal" | "merchants" | "government" | "religious";

/** Where the player can be. Each zone has its own NPCs and quests. */
export type ZoneId =
  | "city" // ديرة الكويت
  | "diwaniya" // حي الدواوين
  | "souq" // سوق المباركية
  | "avenues" // الأفنيوز
  | "desert" // مخيم البر
  | "govzone"; // مجمعات الحكومة

/** Player class — chosen at character creation, affects starting stats. */
export type ClassId = "oil" | "gov" | "falcon" | "merchant";

/** Background story — chosen after class, gives flavor + bonus. */
export type BackgroundId = string; // class-specific; defined in /lib/data/backgrounds

/** Personality — affects bonuses across the game. */
export type PersonalityId =
  | "discreet" // +bonus to gahwa duels
  | "ambitious" // +bonus to debate, faster wasta gain
  | "patient" // +bonus to falconry, +rest energy
  | "generous"; // +bonus rep on social actions

/**
 * Traits — accumulated, mutually-exclusive on opposite axes.
 * Player gains them through choices. Visible on character sheet.
 * NPCs react based on these.
 */
export type Trait =
  // Axis 1: ruthlessness
  | "ruthless"
  | "honorable"
  // Axis 2: loyalty
  | "loyal"
  | "calculating"
  // Axis 3: faith
  | "pious"
  | "secular"
  // Axis 4: temperament
  | "diplomatic"
  | "confrontational"
  // Axis 5: status (one-way)
  | "trusted"
  | "feared"
  | "exiled"
  // Life events (one-way)
  | "married"
  | "hajji"
  | "patron"
  | "compromised" // accepted bribes/dirty deals
  | "betrayer" // broke a major trust
  | "grieving"; // lost a parent in-game

// ═════════════════════════════════════════════════════════════════
// CHARACTER
// ═════════════════════════════════════════════════════════════════

export interface Character {
  /** Display name (Arabic). */
  givenName: string;
  /** Honorific prefix (e.g. "أبو", "أم"). Optional. */
  honorific?: string;
  classId: ClassId;
  background: BackgroundId;
  personality: PersonalityId;
  /** Arabic naming particle / color of the cloth. Optional. */
  accent?: string;
}

// ═════════════════════════════════════════════════════════════════
// CORE STATS
// ═════════════════════════════════════════════════════════════════

export interface Stats {
  /** Influence currency. The thing the game is named after. */
  wasta: number;
  /** Cash. Kuwaiti dinars. */
  money: number;
  /** Public reputation. Can go negative. */
  rep: number;
  /** Action points. Refills on rest. */
  energy: number;
}

export type FactionStanding = Record<FactionId, number>;

// ═════════════════════════════════════════════════════════════════
// RELATIONSHIPS, FAVORS, MEMORY
// ═════════════════════════════════════════════════════════════════

export interface Favor {
  /** NPC's English ID (key into npc data). */
  who: string;
  /** "owedToYou" = they owe you a favor. "youOwe" = you owe them. */
  kind: "owedToYou" | "youOwe";
  /** Day the favor was created. Used for ageing. */
  day: number;
}

export interface NpcMemoryEntry {
  day: number;
  text: string; // Arabic, displayed verbatim
}

// ═════════════════════════════════════════════════════════════════
// QUESTS, CHAINS, ACTS
// ═════════════════════════════════════════════════════════════════

export interface SideQuestProgress {
  id: string;
  accepted: boolean;
  done: boolean;
  progress: number; // current step
  need: number; // total steps
}

export interface StoryQuestProgress {
  id: string;
  act: string; // act ID
  started: boolean;
  completed: boolean;
  stepsCompleted: boolean[];
  /** If the quest had a branching choice, store the chosen branch. */
  branchChoice?: string;
}

export interface PersonalChainProgress {
  /** NPC's English ID (key into chain data). */
  npc: string;
  unlocked: boolean;
  step: number; // 0-indexed current step
  completed: boolean;
}

// ═════════════════════════════════════════════════════════════════
// FLAGS, NOTIFICATIONS, REFLECTIONS
// ═════════════════════════════════════════════════════════════════

/**
 * worldFlags — sparse key/value bag for narrative state.
 * Keys are documented in /docs/design/world-flags.md.
 *
 * Examples:
 *   p3_self_built: true   → chose "build my own name" in prologue
 *   khalid_kickback: true → accepted Bu Khalid's dirty money
 *   tribal_son: true      → chose tribal allegiance in Act 3
 *   in_the_ledger: true   → Umm Nasser added you to her secret book
 */
export type WorldFlags = Record<string, boolean | number | string>;

export type NotifKind = "neutral" | "positive" | "negative" | "milestone";

export interface Notification {
  day: number;
  time: number; // 0-23
  icon: string;
  text: string; // Arabic
  kind: NotifKind;
}

// ═════════════════════════════════════════════════════════════════
// GAME STATE — the master record
// ═════════════════════════════════════════════════════════════════

export interface GameState {
  // Identity
  character: Character;

  // Time
  day: number;
  time: number; // 0-23

  // Location
  location: ZoneId;
  zonesVisited: ZoneId[];

  // Stats
  stats: Stats;
  factions: FactionStanding;

  // Social
  relationships: Record<string, number>; // 0-100, NPC English ID → score
  favors: Favor[];
  npcMemory: Record<string, NpcMemoryEntry[]>;

  // Identity-shaping
  traits: Trait[];

  // Quests
  sideQuests: SideQuestProgress[];
  storyQuests: StoryQuestProgress[];
  personalChains: Record<string, PersonalChainProgress>;
  questsDone: number;
  duelsWon: number;
  duelsLost: number;
  gahwaWon: number;
  debatesWon: number;
  falconryWon: number;

  // Story
  actsCompleted: string[]; // act IDs in order completed

  // Flags & feed
  worldFlags: WorldFlags;
  notifications: Notification[];
  unreadNotifs: number;

  // Meta
  tutorialDone: boolean;
  prologueIndex: number; // 0..3 (3 = done)
  /** Schema version. Bump when GameState shape changes incompatibly. */
  version: number;
}

// ═════════════════════════════════════════════════════════════════
// EVENTS — the only way to mutate state (reducer pattern)
// ═════════════════════════════════════════════════════════════════

export type GameEvent =
  | { type: "INIT"; character: Character }
  | { type: "PROLOGUE_CHOICE"; sceneIdx: number; flag: string; trait?: Trait }
  | { type: "TUTORIAL_DONE" }
  | { type: "TRAVEL"; to: ZoneId; energyCost: number }
  | { type: "REST" }
  | { type: "ADVANCE_TIME"; hours: number }
  | { type: "STAT_DELTA"; stat: keyof Stats; amount: number }
  | { type: "FACTION_DELTA"; faction: FactionId; amount: number }
  | { type: "REL_DELTA"; npc: string; amount: number }
  | { type: "GAIN_TRAIT"; trait: Trait }
  | { type: "REMEMBER_NPC"; npc: string; text: string }
  | { type: "ADD_FAVOR"; favor: Favor }
  | { type: "CONSUME_FAVOR"; npc: string }
  | { type: "ACCEPT_QUEST"; id: string }
  | { type: "PROGRESS_QUEST"; id: string }
  | { type: "COMPLETE_QUEST"; id: string }
  | { type: "START_STORY_QUEST"; id: string }
  | { type: "COMPLETE_STORY_QUEST_STEP"; id: string; stepIdx: number }
  | { type: "COMPLETE_STORY_QUEST"; id: string; branchChoice?: string }
  | { type: "UNLOCK_CHAIN"; npc: string }
  | { type: "ADVANCE_CHAIN"; npc: string }
  | { type: "COMPLETE_CHAIN"; npc: string }
  | { type: "COMPLETE_ACT"; actId: string }
  | { type: "SET_FLAG"; key: string; value: WorldFlags[string] }
  | { type: "PUSH_NOTIF"; notif: Notification }
  | { type: "MARK_NOTIFS_READ" };
