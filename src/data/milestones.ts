// src/data/milestones.ts
// Trackable achievements that show up in the You sheet.

import type { Milestone } from "@/lib/types";
import { zones } from "./zones";

export const milestones: Milestone[] = [
  { id: "first_friend", name: "First friend",
    check: (s) => Object.values(s.relationships).some((v) => v >= 80) },
  { id: "first_quest", name: "First quest done",
    check: (s) => (s.questsDone || 0) >= 1 },
  { id: "five_quests", name: "Five quests",
    check: (s) => (s.questsDone || 0) >= 5 },
  { id: "ten_quests", name: "Ten quests",
    check: (s) => (s.questsDone || 0) >= 10 },
  { id: "wealthy", name: "Wealthy (2000+ KD)",
    check: (s) => s.stats.money >= 2000 },
  { id: "influential", name: "Influential (50+ wasta)",
    check: (s) => s.stats.wasta >= 50 },
  { id: "all_zones", name: "Visited every zone",
    check: (s) => (s.zonesVisited || []).length >= zones.length },
  { id: "two_factions", name: "Friendly with 2 factions",
    check: (s) => Object.values(s.factions).filter((v) => v >= 20).length >= 2 },
  { id: "duelist", name: "Duelist (5 won)",
    check: (s) => (s.duelsWon || 0) >= 5 },
  { id: "personal_chain_first", name: "Closed an NPC chain",
    check: (s) => (s.personalQuestsDone || 0) >= 1 },
  { id: "patron_milestone", name: "Patron of something",
    check: (s) => s.traits.includes("patron") },
  { id: "hajji_milestone", name: "Performed Hajj",
    check: (s) => s.traits.includes("hajji") },
];

export const titles_progression = [
  { min: 0, en: "Newcomer" },
  { min: 30, en: "Familiar Face" },
  { min: 80, en: "Insider" },
  { min: 160, en: "Diwaniya Regular" },
  { min: 280, en: "Trusted Hand" },
  { min: 450, en: "Power Broker" },
];

export function progressionTitle(score: number) {
  let t = titles_progression[0];
  for (const x of titles_progression) if (score >= x.min) t = x;
  return t;
}

export const tierNames = [
  { min: -Infinity, name: "Hostile" },
  { min: 0, name: "Neutral" },
  { min: 10, name: "Friendly" },
  { min: 30, name: "Trusted" },
  { min: 60, name: "Inner Circle" },
  { min: 90, name: "Brother" },
];

export function repTier(v: number) {
  let t = tierNames[0];
  for (const x of tierNames) if (v >= x.min) t = x;
  return t;
}
