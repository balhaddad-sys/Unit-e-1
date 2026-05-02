/**
 * Wasta · Static Content Type Definitions
 * ──────────────────────────────────────────────────────────────────
 * These types describe the SHAPE of game content (prologue scenes,
 * acts, quests, NPCs, etc).
 *
 * For contributors: when you add new content, you import these types
 * and conform to them. TypeScript will catch missing fields at build time.
 */

import type { GameState, Trait, ZoneId, FactionId } from "./game";

// ═════════════════════════════════════════════════════════════════
// PROLOGUE
// ═════════════════════════════════════════════════════════════════

export interface PrologueOption {
  /** Stable ID — keep short, snake_case. */
  id: string;
  /** Arabic label shown to player. Use locked Kuwaiti dialect. */
  label: string;
  /** Stored on choice. Format: `p{scene}_{descriptor}`. */
  flag: string;
  /** Optional trait granted by this choice. */
  traitLean?: Trait;
}

export interface PrologueScene {
  id: string;
  /** Header shown above narration. Arabic. */
  label: string;
  /** Multi-paragraph narration. Arabic. Use \n\n for paragraph breaks. */
  text: string;
  options: PrologueOption[];
}

// ═════════════════════════════════════════════════════════════════
// ACTS
// ═════════════════════════════════════════════════════════════════

export interface ActIntroVariant {
  /** Predicate against state. Highest-priority match wins. */
  check: (s: GameState) => boolean;
  /** Arabic narration that REPLACES the default intro when matched. */
  text: string;
}

export interface ActQuietBeat {
  title: string;
  text: string;
}

export interface ActBranchOption {
  id: string;
  label: string; // Arabic
  /** Visibility gate — option is hidden unless these conditions pass. */
  requiresTrait?: Trait;
  forbidsTrait?: Trait;
  requiresFlag?: string;
  forbidsFlag?: string;
  /** Trait the player earns by choosing this. */
  gainsTrait?: Trait;
  /** World flag set on selection. */
  worldFlag?: string;
  /** Narration carried forward into next act's intro. */
  carriedToNext?: string;
}

export interface ActClosingVariant {
  check: (s: GameState) => boolean;
  text: string;
}

export interface Act {
  id: string;
  /** Position in the 5-act arc. */
  n: 1 | 2 | 3 | 4 | 5;
  /** Emotional title (الوحدة, الاعتراف, etc). */
  titleEmotional: string;
  /** Structural title (الوافد, الصاعد, etc). */
  titleStructural: string;

  /** Default intro narration. */
  introDefault: string;
  /** Variants override the default when their check passes. */
  introVariants: ActIntroVariant[];

  /** The single emotional question this act asks. */
  centralQuestion: string;

  /** Optional quiet-beat scene that fires once during the act. */
  quietBeat?: ActQuietBeat;

  /** Predicate: when true, the act ends and a branch dialog appears. */
  exitCond: (s: GameState) => boolean;

  /** Branch shown at end of act. */
  branches: {
    key: string; // saved into worldFlags as `${key}_choice`
    prompt: string; // Arabic
    options: ActBranchOption[];
  };

  /** Closing narration shown after branch chosen. */
  closingDefault: string;
  closingVariants: ActClosingVariant[];
}

// ═════════════════════════════════════════════════════════════════
// NPCs
// ═════════════════════════════════════════════════════════════════

export interface NPC {
  /** Stable English ID, used as key throughout state. */
  id: string;
  /** Arabic display name. */
  nameAr: string;
  /** English fallback display name. */
  nameEn: string;
  /** Short Arabic role description. */
  roleAr: string;
  roleEn: string;
  /** Their goal in life — drives chain content. */
  goalAr: string;
  zone: ZoneId;
  faction: FactionId;
  /** Starting relationship with player (0-100). */
  baseRel: number;
  /** Single-letter Arabic initial for portrait fallback. */
  initial: string;
  /** Arabic faction tint key for portrait. */
  factionColor?: string;
}

// ═════════════════════════════════════════════════════════════════
// PERSONAL CHAINS (NPC questlines)
// ═════════════════════════════════════════════════════════════════

export interface ChainStep {
  /** Arabic title. */
  title: string;
  /** Arabic description of what to do. */
  desc: string;
  zone: ZoneId;
  energy: number;
  rewards: Partial<{
    wasta: number;
    money: number;
    rep: number;
    energy: number;
    faction: FactionId;
    factionAmt: number;
  }>;
  /** Optional duel that must be won to complete this step. */
  requiresDuel?: "gahwa" | "debate" | "falconry" | "brawl";
}

export interface PersonalChain {
  /** NPC's English ID (must match an NPC). */
  npc: string;
  /** Arabic title of the chain. */
  title: string;
  /** Arabic short description. */
  desc: string;
  steps: ChainStep[];
  /** Arabic narration shown on full completion. */
  completion: string;
  /** Minimum relationship score required to unlock. Default 70. */
  unlockAt?: number;
}

// ═════════════════════════════════════════════════════════════════
// STORY QUESTS (per-act anchor quest)
// ═════════════════════════════════════════════════════════════════

export interface StoryQuestStep {
  /** Arabic short label. */
  label: string;
  /** Predicate against state. When true, this step is checked off. */
  check: (s: GameState) => boolean;
}

export interface StoryQuestBranch {
  key: string;
  options: Array<{
    id: string;
    label: string; // Arabic
    /** Side effect when chosen. */
    effect: (s: GameState) => GameState;
  }>;
}

export interface StoryQuest {
  id: string;
  /** Act ID this anchor belongs to. */
  act: string;
  title: string; // Arabic
  npc: string; // NPC English ID
  zone: ZoneId;
  desc: string; // Arabic
  steps: StoryQuestStep[];
  rewards: Partial<{
    wasta: number;
    money: number;
    rep: number;
    faction: FactionId;
    factionAmt: number;
  }>;
  closing: string; // Arabic
  branch?: StoryQuestBranch;
}

// ═════════════════════════════════════════════════════════════════
// SIDE QUESTS (procedural location-tied errands)
// ═════════════════════════════════════════════════════════════════

export interface SideQuestTemplate {
  id: string;
  zone: ZoneId;
  title: string; // Arabic
  desc: string; // Arabic
  need: number; // steps to complete
  reward: { wasta: number; money: number; rep: number };
}

// ═════════════════════════════════════════════════════════════════
// DILEMMAS (ethical choices that fire after rest)
// ═════════════════════════════════════════════════════════════════

export interface DilemmaBranch {
  label: string; // Arabic
  // Effects — applied immediately
  wasta?: number;
  money?: number;
  rep?: number;
  energy?: number;
  factions?: Partial<Record<FactionId, number>>;
  trait?: Trait;
  flag?: string;
}

export interface Dilemma {
  id: string;
  tag: string; // Arabic short tag
  title: string; // Arabic
  category: "social" | "shame" | "family" | "comedy" | "anger" | "romance" | "crisis";
  text: string; // Arabic narrative
  /** When false, dilemma can't fire. Used for category gates (e.g. romance after day 20). */
  available?: (s: GameState) => boolean;
  accept: DilemmaBranch;
  refuse: DilemmaBranch;
}

// ═════════════════════════════════════════════════════════════════
// REFLECTIONS (weekly mirrors)
// ═════════════════════════════════════════════════════════════════

export interface Reflection {
  /** Setting/location label, Arabic. */
  setting: string;
  /** Italic scene-setting line. */
  settingText: string;
  /** The reflection itself — one line. */
  reflection: string;
  /** Eligibility check. */
  check: (s: GameState) => boolean;
  /** Higher = preferred when multiple match. */
  priority: number;
}

// ═════════════════════════════════════════════════════════════════
// VIGNETTES (one-shot zone-tied moments)
// ═════════════════════════════════════════════════════════════════

export interface VignetteEffects {
  wasta?: number;
  money?: number;
  rep?: number;
  energy?: number;
  factions?: Partial<Record<FactionId, number>>;
  trait?: Trait;
  flag?: string;
}

export interface VignetteOption {
  id: string;
  label: string; // Arabic
  storyNote: string; // Arabic, written into journal
  effects?: VignetteEffects;
}

export interface Vignette {
  id: string;
  title: string; // Arabic
  zone: ZoneId;
  timeOfDay?: "morning" | "afternoon" | "evening" | "night" | "fajr";
  dayOfWeek?: "thursday" | "friday" | "saturday" | "any";
  minDay?: number;
  maxDay?: number;
  requiresTrait?: Trait;
  forbidsTrait?: Trait;
  requiresFlag?: string;
  setting: string; // Arabic
  text: string; // Arabic
  options: VignetteOption[];
}

// ═════════════════════════════════════════════════════════════════
// DUELS
// ═════════════════════════════════════════════════════════════════

export interface DuelStance {
  id: string;
  name: string; // Arabic
  desc: string; // Arabic
  icon: string;
  /** ID of the stance this beats (for rock-paper-scissors logic). */
  beats: string;
}

export interface DuelType {
  id: "gahwa" | "debate" | "falconry" | "brawl";
  name: string; // Arabic
  desc: string; // Arabic
  rounds: number;
  stanceTitle: string; // Arabic
  stances: DuelStance[];
  /** Bonus to combat resolution when stances tie. */
  statBonus: (s: GameState) => number;
  winText: string;
  loseText: string;
  drawText: string;
}

// ═════════════════════════════════════════════════════════════════
// ZONES
// ═════════════════════════════════════════════════════════════════

export interface Zone {
  id: ZoneId;
  nameAr: string;
  nameEn: string;
  /** Single-glyph icon for quick visual ID. */
  icon: string;
  /** Energy cost to travel here. 0 = home zone. */
  cost: number;
  /** Short Arabic flavor description. */
  descAr: string;
}
