import type { Milestone } from "@/lib/types";

export const milestones: Milestone[] = [
  { id: "first_friend",   name: "First friend made",        check: (s) => Object.values(s.relationships).some((v) => v >= 50) },
  { id: "first_quest",    name: "First quest completed",     check: (s) => (s.questsDone || 0) >= 1 },
  { id: "ten_wasta",      name: "Ten Wasta",                 check: (s) => s.stats.wasta >= 10 },
  { id: "fifty_wasta",    name: "Fifty Wasta",               check: (s) => s.stats.wasta >= 50 },
  { id: "hundred_wasta",  name: "A Hundred Wasta",           check: (s) => s.stats.wasta >= 100 },
  { id: "first_duel",     name: "First duel won",             check: (s) => (s.duelsWon || 0) >= 1 },
  { id: "five_duels",     name: "Five duels won",             check: (s) => (s.duelsWon || 0) >= 5 },
  { id: "two_factions",   name: "Two factions courting you",  check: (s) => Object.values(s.factions).filter((v) => v >= 25).length >= 2 },
  { id: "three_factions", name: "Three factions trust you",   check: (s) => Object.values(s.factions).filter((v) => v >= 30).length >= 3 },
  { id: "all_zones",      name: "Walked all of Kuwait",       check: (s) => (s.zonesVisited || []).length >= 8 },
  { id: "first_chain",    name: "First personal chain done",  check: (s) => (s.personalQuestsDone || 0) >= 1 },
  { id: "five_chains",    name: "Five personal chains done",  check: (s) => (s.personalQuestsDone || 0) >= 5 },
  { id: "patron",         name: "Recognized as a patron",     check: (s) => s.traits.includes("patron") },
  { id: "hajji",          name: "Performed Hajj",             check: (s) => s.traits.includes("hajji") },
];
