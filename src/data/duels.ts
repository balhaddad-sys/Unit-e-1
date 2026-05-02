import type { DuelType } from "@/lib/types";

export const duels: Record<string, DuelType> = {
  gahwa: {
    id: "gahwa",
    name: "Gahwa Duel",
    arabic: "مبارزة القهوة",
    desc: "A sip exchanged like a sentence. One round. Wisdom, wit, or patience.",
    rounds: 1,
    stanceTitle: "Choose your manner",
    stances: [
      { id: "wit",      name: "Wit",      desc: "A sharp turn of phrase, a smile to soften the blade.", icon: "✦", beats: "wisdom" },
      { id: "wisdom",   name: "Wisdom",   desc: "An old story, told slowly. The room remembers.",        icon: "◆", beats: "patience" },
      { id: "patience", name: "Patience", desc: "Say nothing. Refill his cup. The silence works for you.", icon: "◐", beats: "wit" },
    ],
    statBonus: (s) => Math.floor(s.stats.rep / 10) + (s.personality === "discreet" ? 2 : 0),
    winText: "He sets the cup down — and nods. The room reads it correctly.",
    loseText: "He answers without hesitating. The room hears that, too.",
    drawText: "Neither wins. The cup is refilled. The contest deferred.",
  },
  debate: {
    id: "debate",
    name: "Diwaniya Debate",
    arabic: "مناظرة الديوانية",
    desc: "Three rounds. Persuade, concede, reframe — pick your shape.",
    rounds: 3,
    stanceTitle: "Choose your line",
    stances: [
      { id: "persuade", name: "Persuade", desc: "Lay out the case clean. Numbers. Names.",              icon: "⚡", beats: "concede" },
      { id: "concede",  name: "Concede",  desc: "Give him the small point so he loses the big one.",     icon: "◇", beats: "reframe" },
      { id: "reframe",  name: "Reframe",  desc: "Change the question. Win on a different ground.",       icon: "❖", beats: "persuade" },
    ],
    statBonus: (s) => Math.floor(s.stats.wasta / 12) + (s.personality === "ambitious" ? 2 : 0),
    winText: "The room turns. By the time he answers, it is already too late.",
    loseText: "He landed it. Three other men pretend they hadn't been listening.",
    drawText: "It dissolves into agreement that satisfies no one. You sit down.",
  },
  falconry: {
    id: "falconry",
    name: "Falconry Contest",
    arabic: "مسابقة الصيد",
    desc: "Three rounds, desert only. Read the bird. Read the wind.",
    rounds: 3,
    stanceTitle: "Choose your approach",
    stances: [
      { id: "patient",    name: "Patient",    desc: "Let her settle. The first hunt is the best hunt.",   icon: "◐", beats: "aggressive" },
      { id: "aggressive", name: "Aggressive", desc: "Send her on the first sight. Risk the early bind.",   icon: "⚡", beats: "reading" },
      { id: "reading",    name: "Reading",    desc: "Watch the wind. The dunes. The shadow before the strike.", icon: "◆", beats: "patient" },
    ],
    statBonus: (s) =>
      Math.floor((s.stats.energy || 0) / 12) +
      Math.floor((s.factions.tribal || 0) / 20) +
      (s.personality === "patient" ? 2 : 0),
    winText: "The shaheen returns with the catch. The fire claps once. That is enough.",
    loseText: "She comes back empty. The desert has its way of reminding.",
    drawText: "A scrappy catch. Honor preserved. No story will be told tonight.",
  },
  brawl: {
    id: "brawl",
    name: "Brawl",
    arabic: "عراك",
    desc: "Three rounds. Grapple, strike, defend. Winning ugly is still winning, mostly.",
    rounds: 3,
    stanceTitle: "Choose your move",
    stances: [
      { id: "strike",  name: "Strike",  desc: "Land it first. Don't be there for the second.",  icon: "✊", beats: "grapple" },
      { id: "grapple", name: "Grapple", desc: "Hold him until he can't.",                         icon: "❖", beats: "defend" },
      { id: "defend",  name: "Defend",  desc: "Take the early hit. Wear him out.",                icon: "◯", beats: "strike" },
    ],
    statBonus: (s) => Math.floor((s.stats.energy || 0) / 14),
    winText: "It ends with him sitting against a wall, hand pressed to his mouth.",
    loseText: "You wake on the floor. Someone has put your ghutra back on you, badly.",
    drawText: "Both of you breathing. Neither claiming. The night ends quiet.",
  },
};
