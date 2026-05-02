import type { ScandalEvent } from "@/lib/types";

export const scandals: ScandalEvent[] = [
  {
    id: "family_scandal",
    title: "A Family Scandal",
    arabic: "فضيحة عائلية",
    text: "A relative has done something embarrassing. The story is spreading. Your name is in the spread because the family is the family.",
    triggerCheck: (s) =>
      s.day > 70 &&
      Math.random() < 0.06 &&
      !s.eventsTriggered.includes("family_scandal"),
    options: [
      { label: "Take the relative in — protect them publicly", rep: -4, money: -300, factions: { tribal: 6 } },
      { label: "Distance yourself — the name comes first",      rep: 2, factions: { tribal: -8 } },
      { label: "Quietly fix it — pay the right people",          money: -1500, rep: 1, wasta: -3, flag: "bribed_someone" },
    ],
  },
  {
    id: "business_collapse",
    title: "A Partner's Business Collapses",
    arabic: "انهيار شريك",
    text: "A partner you signed papers with has run his business into the ground. Creditors are calling. Some of them are calling you.",
    triggerCheck: (s) =>
      s.day > 80 &&
      Math.random() < 0.05 &&
      !s.eventsTriggered.includes("business_collapse"),
    options: [
      { label: "Cover the debts — protect the joint name", money: -2500, rep: 8, factions: { merchants: 5 } },
      { label: "Cut him loose — let it land on him",         rep: -6, factions: { merchants: -4 }, trait: "betrayer" },
      { label: "Negotiate a partial — split the pain",       money: -800, rep: 3, factions: { merchants: 2 } },
    ],
  },
  {
    id: "betrayed",
    title: "Someone You Trusted",
    arabic: "خيانة من قريب",
    text: "Someone you brought into the room has used what they learned there against you. You are reading the proof on your phone.",
    triggerCheck: (s) =>
      s.day > 90 &&
      Math.random() < 0.05 &&
      !s.eventsTriggered.includes("betrayed"),
    options: [
      { label: "Confront them publicly — make an example", rep: 4, wasta: 5, energy: -15, trait: "confrontational" },
      { label: "Cut them off quietly — never speak of it again", wasta: -2, trait: "betrayed" },
      { label: "Forgive them — and use the leverage forever", wasta: 4, trait: "calculating" },
    ],
  },
];
