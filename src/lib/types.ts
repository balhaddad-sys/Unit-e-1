// src/lib/types.ts
// Core types for Wasta Kuwait
// The shape of every game entity.

// ============================================================
// CHARACTER TRAITS — accumulated through choices, lock/unlock content
// ============================================================
export type Trait =
  // Moral axis
  | "ruthless"     // willing to harm to advance
  | "honorable"    // refuses to compromise principle
  // Loyalty axis
  | "loyal"        // sticks with people
  | "calculating"  // optimizes without sentiment
  // Faith axis
  | "pious"        // observant, humble
  | "secular"      // public-life focused
  // Public axis
  | "diplomatic"   // smooth talker, mediator
  | "confrontational" // direct, not afraid of fight
  // Earned designations
  | "compromised"     // caught in something — government distrusts you
  | "exiled"          // burned bridges, must rebuild from scratch
  | "trusted"         // respected across factions
  | "feared"          // people defer but don't love you
  | "grieving"        // experienced loss, others know
  | "married"         // changes some content
  | "engaged"
  | "father"          // dynasty unlocked
  | "mother"
  | "hajji"           // performed Hajj
  | "patron"          // funded a public good
  | "betrayer"        // betrayed someone who trusted you
  | "betrayed"        // someone betrayed you
  | "indebted"        // owe a major favor
  | "owed_major";     // someone owes you a major favor

// ============================================================
// APPEARANCE
// ============================================================
export type Appearance = {
  style: "ghutra" | "shemagh" | "bare" | "shayla" | "abaya";
  skin: "s1" | "s2" | "s3" | "s4" | "s5";
  ghutra: "white" | "red" | "black" | "emerald" | "navy";
  shayla: "black" | "cream" | "emerald" | "crimson" | "navy" | "oud";
  beard: "none" | "stubble" | "trimmed" | "full" | "mustache";
  eyes: "dark" | "hazel" | "light" | "green" | "grey";
  eyebrows: "natural" | "thick" | "thin" | "arched";
  age: "young" | "adult" | "mature" | "elder";
  glasses: "none" | "reading" | "square" | "round";
};

// ============================================================
// CORE ENTITIES
// ============================================================
export type FactionId = "merchants" | "government" | "tribal" | "religious";

export type Stats = {
  wasta: number;
  money: number;
  rep: number;
  energy: number;
};

export type Reward = {
  wasta?: number;
  money?: number;
  rep?: number;
  energy?: number;
  faction?: FactionId;
  factionAmt?: number;
  factions?: Partial<Record<FactionId, number>>;
  trait?: Trait;        // adds a trait
  removeTrait?: Trait;  // removes one
  flag?: string;        // sets a worldFlag = true
};

export type RiskOutcome = {
  prob: number;        // 0..1
  win: Reward & { label?: string };
  lose: Reward & { label?: string };
};

export type Class = {
  id: string;
  en: string;
  ar: string;
  icon: string;
  descEn: string;
  stats: Stats;
  factions: Partial<Record<FactionId, number>>;
};

export type Background = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  perk: string;
  apply: (s: GameState) => void;
};

export type Personality = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  perk: string;
};

export type Zone = {
  id: string;
  ar: string;
  en: string;
  icon: string;
  cost: number;
  desc: string;
};

export type SubLocation = {
  id: string;
  zone: string;
  name: string;
  ar: string;
  desc: string;
  flavor: "luxury" | "power" | "calm" | "social" | "intel" | "religious"
        | "family" | "casual" | "rough" | "trade" | "memory";
  energyCost: number;
  // Optional: only available if condition met
  unlockCond?: (s: GameState) => boolean;
  // Special encounters tied to this place
  uniqueEvent?: string; // event id
};

export type NPC = {
  name: string;
  role: string;
  zone: string;
  baseRel: number;
  faction: FactionId;
  initial: string;
  goal: string;
  // Personality the NPC will react to
  values?: Trait[];          // traits they like
  dislikes?: Trait[];        // traits they dislike
  // Romance-eligible?
  romanceable?: boolean;
  // Special: only meet if condition
  meetCond?: (s: GameState) => boolean;
};

export type Favor = {
  who: string;
  kind: "owedToYou" | "youOwe";
  weight: "small" | "medium" | "major";
  reason?: string;
};

export type MemoryEntry = {
  day: number;
  text: string;
};

export type StoryEntry = {
  day: number;
  time: number;
  text: string;
};

export type Quest = {
  id: string;
  zone: string;
  npc: string;
  title: string;
  desc: string;
  accepted: boolean;
  done: boolean;
  progress: number;
  need: number;
  reward: {
    wasta: number;
    money: number;
    rep: number;
    faction?: FactionId;
  };
};

// ============================================================
// STORYLINE
// ============================================================
export type Act = {
  id: string;
  n: number;
  title: string;
  arabic: string;
  intro: string;
  enterCond: (s: GameState) => boolean;
  exitCond: (s: GameState) => boolean;
  closingScene: string;
};

export type StoryQuestStep = {
  label: string;
  check: (s: GameState) => boolean;
};

export type StoryBranchOption = {
  id: string;
  label: string;
  // What this choice does to character + world
  effect: (s: GameState) => void;
  // Required traits to choose this option (gating)
  requiresTrait?: Trait;
  forbidsTrait?: Trait;
  // What this choice locks/unlocks downstream
  locksFlag?: string;
  unlocksFlag?: string;
  // Lasting trait gained
  gainsTrait?: Trait;
};

export type StoryQuest = {
  id: string;
  act: string;
  title: string;
  arabic: string;
  npc: string;
  zone: string;
  desc: string;
  steps: StoryQuestStep[];
  rewards: Reward;
  closing: string;
  branch?: {
    key: string;
    prompt: string;
    options: StoryBranchOption[];
  };
};

export type StoryQuestProgress = {
  id: string;
  act: string;
  started: boolean;
  completed: boolean;
  stepsCompleted: boolean[];
  branchChoice: string | null;
};

// ============================================================
// PERSONAL CHAINS (NPC questlines)
// ============================================================
export type ChainStep = {
  title: string;
  desc: string;
  zone: string;
  energy: number;
  rewards: Reward;
  requiresDuel?: "gahwa" | "debate" | "falconry" | "brawl";
  // Branching at the climax
  branch?: {
    key: string;
    options: StoryBranchOption[];
  };
};

export type PersonalChain = {
  npc: string;
  title: string;
  arabic: string;
  desc: string;
  // Required traits to even unlock
  requiresTrait?: Trait;
  forbidsTrait?: Trait;
  steps: ChainStep[];
  completion: string;
  // Optional: what this completion unlocks downstream
  unlocksFlag?: string;
  gainsTrait?: Trait;
};

// ============================================================
// DUELS
// ============================================================
export type DuelStance = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  beats: string;
};

export type DuelType = {
  id: string;
  name: string;
  arabic: string;
  desc: string;
  rounds: number;
  stanceTitle: string;
  stances: DuelStance[];
  statBonus: (s: GameState) => number;
  winText: string;
  loseText: string;
  drawText: string;
};

// ============================================================
// DILEMMAS (random encounters)
// ============================================================
export type DilemmaCategory =
  | "social" | "comedy" | "anger" | "shame" | "risk"
  | "family" | "romance" | "crisis" | "challenge";

export type DilemmaOption = Reward & {
  label: string;
  risk?: RiskOutcome;
  triggerDuel?: "gahwa" | "debate" | "falconry" | "brawl";
};

export type Dilemma = {
  id: string;
  tag: string;
  title: string;
  category: DilemmaCategory;
  text: string;
  // Gating: only fires if these conditions hold
  minDay?: number;
  maxDay?: number;
  requiresTrait?: Trait;
  forbidsTrait?: Trait;
  requiresFlag?: string;
  oneShot?: boolean;     // can only happen once
  accept: DilemmaOption;
  refuse: DilemmaOption;
  // Optional third path with stricter requirements
  third?: DilemmaOption & { requiresTrait?: Trait };
};

// ============================================================
// EVENTS — seasonal & scandal
// ============================================================
export type EventOption = Reward & {
  label: string;
  branch?: string;
  triggerDuel?: "gahwa" | "debate" | "falconry" | "brawl";
};

export type SeasonalEvent = {
  id: string;
  triggerDay: number;
  title: string;
  arabic: string;
  text: string;
  options: EventOption[];
};

export type ScandalEvent = {
  id: string;
  title: string;
  arabic: string;
  text: string;
  options: EventOption[];
  triggerCheck: (s: GameState) => boolean;
};

// ============================================================
// ROMANCE
// ============================================================
export type RomanceStage =
  | "none"      // not started
  | "noticed"   // first conversation
  | "courting"  // exchanging letters/visits
  | "engaged"   // family approval
  | "married"
  | "ended";

export type RomanceState = {
  npc: string;
  stage: RomanceStage;
  affection: number;          // 0-100
  familyApproved: boolean;
  obstacles: string[];        // e.g. "class_difference", "her_brother_disapproves"
};

// ============================================================
// MILESTONES
// ============================================================
export type Milestone = {
  id: string;
  name: string;
  check: (s: GameState) => boolean;
};

// ============================================================
// ENDINGS
// ============================================================
export type EndingId =
  | "broker"        // accepted the council seat
  | "independent"   // refused — kept freedom
  | "exiled"        // burned too many bridges, left Kuwait
  | "patriarch"     // family dynasty path
  | "ascetic"       // gave it all up for piety
  | "ruined"        // never recovered from rock bottom
  | "betrayer_king" // climbed by stepping on people
  | "beloved"       // mass-loved across factions, no formal seat
  | "merchant_lord" // built a business empire
  | "imam"          // took a religious leadership role
  | "tribe_head";   // returned to lead the desert family

export type Ending = {
  id: EndingId;
  title: string;
  arabic: string;
  epilogue: string;
  // What conditions make this ending fire
  check: (s: GameState) => boolean;
};

// ============================================================
// MASTER STATE
// ============================================================
export type GameState = {
  // Identity
  givenName: string;
  honorific: "Bu" | "Umm" | "";
  classId: string;
  bg: string | null;
  personality: string;
  accent: string;
  appearance: Appearance;

  // Stats
  stats: Stats;
  factions: Record<FactionId, number>;

  // Position in world
  location: string;
  subLocation: string | null;
  day: number;
  time: number;

  // Quests
  quests: Quest[];
  questsDone: number;
  zonesVisited: string[];

  // Social
  relationships: Record<string, number>;
  favors: Favor[];
  npcMemory: Record<string, MemoryEntry[]>;

  // Story
  story: StoryEntry[];
  milestonesUnlocked: string[];
  actsCompleted: string[];
  storyQuests: StoryQuestProgress[];

  // Personal chains
  personalProgress: Record<string, { step: number; completed: boolean; unlocked: boolean }>;
  personalQuestsDone: number;

  // Duels
  duelsWon: number;
  gahwaWon: number;
  debatesWon: number;
  falconryWon: number;
  brawlsWon: number;
  duelsLost: number;

  // Events
  eventsTriggered: string[];
  worldFlags: Record<string, string | boolean>;
  endingPath: EndingId | null;

  // Character
  traits: Trait[];                  // accumulated through choices

  // Romance
  romance: RomanceState | null;

  // Family / dynasty
  family: {
    spouse: string | null;          // NPC name
    children: { name: string; born: number }[];
    parents_status: "alive" | "father_passed" | "mother_passed" | "both_passed";
  };

  // Business / property
  businesses: {
    id: string;
    name: string;
    type: "shop" | "fund" | "diwaniya" | "estate";
    monthlyIncome: number;
    health: number;                 // 0-100, declines if neglected
  }[];
  properties: string[];             // e.g. ["sharq_apartment", "salwa_villa"]
};
