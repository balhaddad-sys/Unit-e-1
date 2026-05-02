import type { SeasonalEvent } from "@/lib/types";

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: "national_day",
    triggerDay: 25,
    title: "National Day",
    arabic: "اليوم الوطني",
    text: "Flags everywhere. The corniche is full. Children sing. You are invited to two parties at the same time — one in Salmiya, one at Sheikha Latifa's.",
    options: [
      { label: "Sheikha Latifa's reception (state circle)", rep: 5, factions: { government: 6 }, energy: -10 },
      { label: "Salmiya seafront with old friends",          rep: 4, factions: { merchants: 4 }, energy: -8 },
      { label: "Stay home — your father is tired",           rep: 2, factions: { tribal: 2 } },
    ],
  },
  {
    id: "ramadan",
    triggerDay: 60,
    title: "Ramadan Begins",
    arabic: "شهر رمضان",
    text: "The country rearranges itself. Fasting from dawn. Diwaniyat after iftar. The streets at 4am are still alive.",
    options: [
      { label: "Host iftar nightly — your house, every night", money: -800, rep: 10, factions: { religious: 6, tribal: 4 } },
      { label: "Attend others' iftars — be seen, eat well",     rep: 5, energy: -15 },
      { label: "Quiet Ramadan — pray, read, fast properly",     rep: 3, factions: { religious: 8 } },
    ],
  },
  {
    id: "eid",
    triggerDay: 90,
    title: "Eid Al-Fitr",
    arabic: "عيد الفطر",
    text: "Three days of visits. Money in envelopes. Children in their finest. The old aunts judging your tie.",
    options: [
      { label: "Visit every uncle, every aunt, every cousin", rep: 8, money: -300, energy: -20, factions: { tribal: 6 } },
      { label: "Travel — Bahrain or Salalah for the break",    money: -500, rep: -2, energy: 15 },
      { label: "Open house — let them come to you",            money: -250, rep: 5, factions: { merchants: 3 } },
    ],
  },
  {
    id: "diwaniya_election",
    triggerDay: 100,
    title: "The Diwaniya Election",
    arabic: "انتخابات الديوانية",
    text: "The diwaniya is choosing a new chair. Three candidates. Each wants your name behind theirs.",
    options: [
      { label: "The traditionalist (tribal favorite)", factions: { tribal: 8, merchants: -3 }, wasta: 4 },
      { label: "The reformer (Bu Yousef's candidate)",  factions: { government: 8, religious: -3 }, wasta: 4 },
      { label: "Stay neutral — bless all three",         rep: 3, wasta: 2 },
    ],
  },
  {
    id: "hala_february",
    triggerDay: 130,
    title: "Hala February",
    arabic: "هلا فبراير",
    text: "Festivals, concerts, cultural week. The city is dressed up. Sheikha Latifa wants you at the opening night.",
    options: [
      { label: "Attend the opening with full kit", rep: 6, money: -150, factions: { government: 4 } },
      { label: "Skip — go to a smaller poetry night instead", rep: 4, factions: { religious: 2 } },
      { label: "Host a private dinner same night", money: -400, rep: 5, factions: { merchants: 5 } },
    ],
  },
  {
    id: "audio_leak",
    triggerDay: 150,
    title: "The Audio Leak",
    arabic: "تسريب صوتي",
    text: "A recording is circulating. It's not you in it. But your name is mentioned twice. The diwaniya WhatsApp groups are working overtime.",
    options: [
      { label: "Issue a public statement — get ahead", rep: 4, wasta: -3, money: -200 },
      { label: "Let the lawyers handle it quietly",     wasta: 2, money: -500, rep: 1 },
      { label: "Lean in — reframe the leak as evidence of your importance", rep: 6, wasta: 5, factions: { merchants: -4 } },
    ],
  },
  {
    id: "summer_exodus",
    triggerDay: 160,
    title: "The Summer Exodus",
    arabic: "الصيف",
    text: "Forty-seven degrees. Half of Kuwait is in London. The other half is in Salalah. The third half says it never left.",
    options: [
      { label: "London for two months — be seen at the right cafés", money: -3000, rep: 4, factions: { merchants: 4, tribal: -2 } },
      { label: "Salalah — quieter, with the family",                  money: -1200, rep: 3, factions: { tribal: 4 }, energy: 15 },
      { label: "Stay — be the man who didn't leave",                  rep: 6, factions: { religious: 3 } },
    ],
  },
  {
    id: "hajj",
    triggerDay: 200,
    title: "The Hajj Season",
    arabic: "موسم الحج",
    text: "The dates are coming. Sheikh Abdullah is going. He has a place in his group, if you want it.",
    options: [
      { label: "Go for Hajj — all of it, properly",
        money: -2500, rep: 12, factions: { religious: 12, tribal: 4 }, energy: -30,
        flag: "hajj_done", trait: "hajji" },
      { label: "Send your mother instead",
        money: -2000, rep: 8, factions: { religious: 6, tribal: 5 } },
      { label: "Not this year — \"Insha'allah next year\"",
        rep: -2 },
    ],
  },
];
