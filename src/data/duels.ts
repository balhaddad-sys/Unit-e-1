// src/data/duels.ts
// Four duel types — each is a stance contest with rock-paper-scissors logic.

import type { DuelType } from "@/lib/types";

export const duelTypes: Record<string, DuelType> = {
  gahwa: {
    id: "gahwa",
    name: "Gahwa Duel",
    arabic: "نزال الفنجان",
    desc: "A verbal contest over coffee. You and your opponent each pick a stance. Stances beat each other in a triangle.",
    rounds: 1,
    stanceTitle: "Pick your stance",
    stances: [
      { id: "wit",      name: "Wit",      desc: "Sharp, clever, lands quickly", icon: "⚡", beats: "wisdom" },
      { id: "wisdom",   name: "Wisdom",   desc: "Patient, deep, lands slowly",  icon: "☾", beats: "patience" },
      { id: "patience", name: "Patience", desc: "Quiet, immovable, wears down", icon: "⌒", beats: "wit" },
    ],
    statBonus: (s) => Math.floor(s.stats.rep / 8) + (s.personality === "discreet" ? 2 : 0),
    winText: "The room nods. Your cup is refilled — that is the trophy.",
    loseText: "The opponent has the last word. People notice. The cup stays empty.",
    drawText: "Both speakers are heard. The room is split.",
  },

  debate: {
    id: "debate",
    name: "Diwaniya Debate",
    arabic: "مجادلة المجلس",
    desc: "A three-round social argument. Each round you choose a tactic. The opponent counters.",
    rounds: 3,
    stanceTitle: "Round tactics",
    stances: [
      { id: "persuade", name: "Persuade", desc: "Bring people to your side directly", icon: "❖", beats: "concede" },
      { id: "concede",  name: "Concede",  desc: "Yield ground to gain trust",          icon: "◐", beats: "press" },
      { id: "reframe",  name: "Reframe",  desc: "Change what's being argued about",    icon: "⊕", beats: "persuade" },
      { id: "press",    name: "Press",    desc: "Pin them on a weak point",            icon: "⚡", beats: "reframe" },
    ],
    statBonus: (s) => Math.floor(s.stats.wasta / 10) + (s.personality === "ambitious" ? 2 : 0),
    winText: "The room moves to your side. The opponent steps back gracefully — or not.",
    loseText: "You lose the room. Faces turn away as the diwaniya closes.",
    drawText: "Neither side carries the room. The debate is tabled.",
  },

  falconry: {
    id: "falconry",
    name: "Falconry Contest",
    arabic: "نزال الصقر",
    desc: "A desert competition. Three phases: training, reading the wind, and the hunt.",
    rounds: 3,
    stanceTitle: "Approach",
    stances: [
      { id: "patient",    name: "Patient",    desc: "Wait for the right moment",  icon: "⌒", beats: "aggressive" },
      { id: "aggressive", name: "Aggressive", desc: "Press hard from the start",   icon: "⚡", beats: "reading" },
      { id: "reading",    name: "Read wind",  desc: "Adapt to conditions",          icon: "☾", beats: "patient" },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.energy / 15) +
      (s.personality === "patient" ? 3 : 0) +
      Math.floor((s.factions.tribal || 0) / 10),
    winText: "Your falcon returns clean. The desert applauds in silence.",
    loseText: "The bird returns empty. The wind today belonged to another.",
    drawText: "An honorable showing. Neither falcon caught more than the other.",
  },

  brawl: {
    id: "brawl",
    name: "Brawl",
    arabic: "مَلْكَمَة",
    desc: "Things have gone past words. Someone is going to leave with marks. Three rounds. Read your opponent.",
    rounds: 3,
    stanceTitle: "Stance",
    stances: [
      { id: "strike",  name: "Strike",  desc: "Press hard — close the distance", icon: "⚡", beats: "defend" },
      { id: "grapple", name: "Grapple", desc: "Take it to the ground",            icon: "⊕", beats: "strike" },
      { id: "defend",  name: "Defend",  desc: "Wait — read the opening",          icon: "⌒", beats: "grapple" },
    ],
    statBonus: (s) =>
      Math.floor(s.stats.energy / 12) + (s.personality === "ambitious" ? 2 : 0) - 2,
    winText: "He's on the ground. The crowd is silent. You are bleeding from somewhere — but you stood.",
    loseText: "You're on the ground. Someone's dishdasha is torn — yours. The shame is worse than the bruise.",
    drawText: "Both of you are panting, holding shoulders. Whoever started it has lost interest.",
  },
};
