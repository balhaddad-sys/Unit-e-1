// src/data/seasonalEvents.ts
// Day-triggered events. Each fires once when its trigger day is reached.

import type { SeasonalEvent } from "@/lib/types";

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: "national_day",
    triggerDay: 25,
    title: "National Day",
    arabic: "اليوم الوطني",
    text: "The flags are out. Everyone gathers in the streets and on rooftops. The city wears green and red. The malls play patriotic songs on loop and you remember why you love this country.",
    options: [
      {
        label: "Host a small gathering at home",
        wasta: 5, rep: 8, money: -150, energy: -15,
        factions: { merchants: 3, tribal: 3, government: 3 },
      },
      {
        label: "Spray people with foam at the parade like everyone else",
        rep: 6, energy: -8,
        factions: { government: 4 },
      },
      {
        label: "Stay home — the noise gives you a headache",
        rep: -2, energy: 5,
      },
    ],
  },
  {
    id: "ramadan",
    triggerDay: 60,
    title: "Ramadan Begins",
    arabic: "رمضان كريم",
    text: "The first crescent is sighted. Daytime traffic is murderous. Iftar transforms the city. People who haven't spoken in years break fast at the same table.",
    options: [
      {
        label: "Host iftar gatherings every week",
        wasta: 8, rep: 6, money: -300, energy: -15,
        factions: { religious: 5, tribal: 3 },
      },
      {
        label: "Attend community iftars at the mosque",
        rep: 4, energy: -8, faction: "religious", factionAmt: 4,
      },
      {
        label: "Use the quieter days to close real work",
        wasta: 3, money: 200, rep: -1,
      },
    ],
  },
  {
    id: "eid_fitr",
    triggerDay: 90,
    title: "Eid Al-Fitr",
    arabic: "عيد الفطر",
    text: "Three days of visiting, eidiya envelopes for every child you know, and twenty-four cups of gahwa. Your stomach has not seen rest. Aunts you'd forgotten existed appear with full plates.",
    options: [
      {
        label: "Visit every relative properly (الواجب يقتل)",
        rep: 10, money: -200, energy: -20,
        factions: { tribal: 6 },
      },
      {
        label: "Make the rounds you can, skip the rest",
        rep: 3, energy: -10, money: -80,
      },
      {
        label: "Travel to escape it (Bahrain weekend)",
        rep: -4, money: -300, energy: 10, wasta: -2,
      },
    ],
  },
  {
    id: "election",
    triggerDay: 100,
    title: "The Diwaniya Election",
    arabic: "انتخابات المجلس",
    text: "Two figures from your circle are running for diwaniya leadership. The campaign WhatsApp groups are unbearable. People you barely know are sending you 'vote for X' voice notes.",
    options: [
      {
        label: "Back the older candidate (tradition)",
        wasta: 5, energy: -10,
        factions: { tribal: 6, merchants: -2 },
        branch: "election_old",
      },
      {
        label: "Back the reformer (modernity)",
        wasta: 5, energy: -10,
        factions: { government: 6, tribal: -2 },
        branch: "election_new",
      },
      {
        label: "Stay publicly neutral (the safest road)",
        rep: -2, wasta: -3,
        branch: "election_neutral",
      },
    ],
  },
  {
    id: "hala_february",
    triggerDay: 130,
    title: "Hala February",
    arabic: "هلا فبراير",
    text: "The shopping festival fills the malls. The Avenues is wall-to-wall. There's money in the air — and a lot of cousins asking what you got them.",
    options: [
      {
        label: "Run a luxury event at The Avenues",
        money: 600, wasta: 4, energy: -12, faction: "merchants", factionAmt: 5,
      },
      { label: "Quiet days are for closing real deals", money: 300, wasta: 6 },
      { label: "Skip the noise", rep: -1, energy: 8 },
    ],
  },
  {
    id: "diwan_scandal",
    triggerDay: 150,
    title: "The Audio Leak",
    arabic: "تسريب صوتي",
    text: "A voice note is circulating. Someone in your circle said something they shouldn't have. By morning, half the diwaniya has heard it. You're being asked: which side?",
    options: [
      {
        label: "Defend them publicly — they're family",
        rep: -3, wasta: 5, energy: -12,
        factions: { tribal: 5, merchants: -3 },
        branch: "defended_friend",
      },
      {
        label: "Distance yourself politely",
        rep: 2, wasta: -3,
        factions: { government: 3 },
      },
      {
        label: "Find out who leaked it and burn them",
        rep: -5, wasta: 8, energy: -15,
        branch: "hunted_leaker",
      },
    ],
  },
  {
    id: "summer_london",
    triggerDay: 160,
    title: "Summer Exodus",
    arabic: "صيف لندن",
    text: "Kuwait hits 51°C. Half the diwaniya is in London, the other half in Bodrum. The city empties. Gulf Air ticket prices triple. Your aunt is in Knightsbridge by the second week of June.",
    options: [
      {
        label: "Spend the summer in London like everyone else",
        money: -1500, rep: 5, energy: 15, wasta: 3, faction: "merchants", factionAmt: 3,
      },
      {
        label: "Stay in Kuwait, work through the dead months",
        money: 600, wasta: 8, energy: -10, rep: -2,
      },
      {
        label: "Salalah for the khareef",
        money: -500, rep: 2, energy: 20, faction: "tribal", factionAmt: 2,
      },
    ],
  },
  {
    id: "hajj_season",
    triggerDay: 200,
    title: "Hajj Season",
    arabic: "موسم الحج",
    text: "Sheikh Abdullah is leading a small group to Makkah. He has a place for you if you want it. Your mother has been asking for two years.",
    options: [
      {
        label: "Go for Hajj — it has been long overdue",
        rep: 25, money: -2000, energy: -30,
        faction: "religious", factionAmt: 15, wasta: 8,
        flag: "hajj_done",
      },
      {
        label: "Send your father in your place",
        rep: 8, money: -1500,
        faction: "religious", factionAmt: 5,
      },
      {
        label: "Not this year — work is too much",
        rep: -3, faction: "religious", factionAmt: -3,
      },
    ],
  },
];
