// src/engine/traits.ts
// Trait accumulation rules — choices leave permanent marks.
//
// Traits represent who the player is becoming. Some are mutually exclusive
// (you can't be both Ruthless and Honorable — gaining one removes the other).
// Some are earned designations that modify how NPCs see you.

import type { GameState, Trait } from "@/lib/types";

// Mutually-exclusive trait pairs. Adding one removes the other.
const TRAIT_OPPOSITES: [Trait, Trait][] = [
  ["ruthless", "honorable"],
  ["loyal", "calculating"],
  ["pious", "secular"],
  ["diplomatic", "confrontational"],
  ["trusted", "feared"],
];

export function hasTrait(s: GameState, t: Trait): boolean {
  return s.traits.includes(t);
}

export function addTrait(s: GameState, t: Trait) {
  if (s.traits.includes(t)) return;
  // Remove opposite if any
  for (const [a, b] of TRAIT_OPPOSITES) {
    if (t === a && s.traits.includes(b)) {
      s.traits = s.traits.filter((x) => x !== b);
    } else if (t === b && s.traits.includes(a)) {
      s.traits = s.traits.filter((x) => x !== a);
    }
  }
  s.traits.push(t);
}

export function removeTrait(s: GameState, t: Trait) {
  s.traits = s.traits.filter((x) => x !== t);
}

// Some traits accumulate — e.g. helping people 5 times grants "trusted"
export function checkEmergentTraits(s: GameState) {
  // Trusted: 3 factions ≥ 25
  const factionsTrustedYou = Object.values(s.factions).filter((v) => v >= 25).length;
  if (factionsTrustedYou >= 3 && !hasTrait(s, "trusted") && !hasTrait(s, "feared")) {
    addTrait(s, "trusted");
  }

  // Feared: very high wasta but low rep
  if (s.stats.wasta >= 50 && s.stats.rep < 10 && !hasTrait(s, "feared")) {
    addTrait(s, "feared");
  }

  // Compromised: scandal flag + government < 0
  if (s.worldFlags.bribed_someone && s.factions.government < 0 && !hasTrait(s, "compromised")) {
    addTrait(s, "compromised");
  }

  // Hajji: completed Hajj
  if (s.worldFlags.hajj_done && !hasTrait(s, "hajji")) {
    addTrait(s, "hajji");
    addTrait(s, "pious");
  }
}

// Used in NPC reactions and dialog gating
export function npcLikes(s: GameState, npcValues: Trait[] = []): number {
  return npcValues.filter((t) => hasTrait(s, t)).length;
}

export function npcDislikes(s: GameState, npcDislikes: Trait[] = []): number {
  return npcDislikes.filter((t) => hasTrait(s, t)).length;
}

// Net affinity bonus from traits — used to modify relationship gains
export function traitAffinityBonus(
  s: GameState,
  values: Trait[] = [],
  dislikes: Trait[] = []
): number {
  return npcLikes(s, values) * 2 - npcDislikes(s, dislikes) * 3;
}

// Human-readable trait labels
export const TRAIT_LABELS: Record<Trait, { name: string; ar: string; desc: string }> = {
  ruthless:        { name: "Ruthless",         ar: "قاسٍ",       desc: "Will compromise principles to advance." },
  honorable:       { name: "Honorable",        ar: "شريف",       desc: "Refuses to bend on what matters." },
  loyal:           { name: "Loyal",            ar: "وفي",        desc: "Sticks with the people who stuck with him." },
  calculating:     { name: "Calculating",      ar: "محسوب",      desc: "Optimizes coldly. No sentiment." },
  pious:           { name: "Pious",            ar: "تقي",        desc: "Faith shapes choices. Quiet about it." },
  secular:         { name: "Secular",          ar: "مدني",       desc: "Public life over religious life." },
  diplomatic:      { name: "Diplomatic",       ar: "دبلوماسي",  desc: "The smooth talker. Mediates." },
  confrontational: { name: "Confrontational",  ar: "صريح",       desc: "Says it. Fights it. Not afraid." },
  compromised:     { name: "Compromised",      ar: "ملطّخ",      desc: "Government distrusts. Some doors are now closed." },
  exiled:          { name: "Exiled",           ar: "منفي",       desc: "Burned the bridges. Rebuilding from outside." },
  trusted:         { name: "Trusted",          ar: "موثوق",      desc: "Multiple factions speak well of him." },
  feared:          { name: "Feared",           ar: "مهاب",       desc: "People defer. Few invite him to dinner." },
  grieving:        { name: "Grieving",         ar: "حزين",       desc: "Carries a recent loss visibly." },
  married:         { name: "Married",          ar: "متزوج",      desc: "Family man." },
  engaged:         { name: "Engaged",          ar: "مخطوب",      desc: "Promised to someone." },
  father:          { name: "Father",           ar: "أب",         desc: "Has children. Dynasty begins." },
  mother:          { name: "Mother",           ar: "أم",         desc: "Has children. Dynasty begins." },
  hajji:           { name: "Hajji",            ar: "حاج",        desc: "Performed Hajj. The title sticks." },
  patron:          { name: "Patron",           ar: "راعي",       desc: "Funded a public good. Name on a wall somewhere." },
  betrayer:        { name: "Betrayer",         ar: "خائن",       desc: "Stabbed someone who trusted him. Some won't forget." },
  betrayed:        { name: "Betrayed",         ar: "مخذول",      desc: "Was stabbed by someone he trusted. Wary now." },
  indebted:        { name: "Indebted",         ar: "مدين",       desc: "Owes a major favor he'll be called on." },
  owed_major:      { name: "Owed Major",       ar: "له دين",     desc: "Holds a major favor. A rare card." },
};
