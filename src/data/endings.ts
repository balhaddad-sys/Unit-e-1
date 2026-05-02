// src/data/endings.ts
// 11 endings determined by accumulated character.

import type { Ending, GameState } from "@/lib/types";
import { hasTrait } from "@/engine/traits";

export const endings: Ending[] = [
  {
    id: "broker",
    title: "The Power Broker",
    arabic: "رجل الكلمة",
    epilogue:
      "Years pass. The seat at the long table becomes yours by default. " +
      "Ministers call you before they decide. Your name appears in no newspaper, " +
      "but every policy that matters has your fingerprint somewhere on it. " +
      "On winter evenings you sit in the diwaniya with old friends, and they " +
      "speak of you when you leave the room. Bu Khalid retires. Umm Nasser passes. " +
      "Their children call you uncle. Your father, before he died, said one " +
      "thing about you: 'He understood the country.' That is what they will write.",
    check: (s) =>
      s.endingPath === "broker" &&
      hasTrait(s, "trusted") &&
      !hasTrait(s, "compromised"),
  },

  {
    id: "independent",
    title: "The Free Hand",
    arabic: "اليد الحرة",
    epilogue:
      "You refused the seat. Some called it foolish. A few — the ones " +
      "who mattered — called it wisdom. From outside the room, you had a " +
      "different kind of leverage: you could say no, and that no carried weight. " +
      "Every prime minister in your lifetime came to you for counsel they could " +
      "not get from their own ministers. You took no formal title and built no " +
      "dynasty, but you remained — until your last breath — the man whose phone " +
      "call always got returned. Sheikha Latifa, in her later memoirs, wrote: " +
      "'He was the only one of us who chose freedom over the seat. I have never " +
      "stopped envying him for it.'",
    check: (s) =>
      s.endingPath === "independent" && hasTrait(s, "honorable"),
  },

  {
    id: "betrayer_king",
    title: "The Betrayer King",
    arabic: "ملك الخيانات",
    epilogue:
      "You took the seat. You sit at the long table. The room defers to you. " +
      "But when you leave, the room exhales. You have no friends now — only " +
      "people who fear you and people who want what you can give. Bu Khalid " +
      "stopped returning your calls years ago. Umm Nasser will not look at you " +
      "across a wedding hall. The young men at your diwaniya are paid to be there. " +
      "You won. You won by every measure that can be measured. " +
      "On Eid morning, you sit alone in a very large house with very fine coffee. " +
      "The maid pours it. Your son will not visit. " +
      "Your wife sleeps in a separate wing. " +
      "The country owes you. You own pieces of it. " +
      "And in the long evening of your life you understand, with great clarity, " +
      "what you traded for what. The trade was good — by every measure that can be measured.",
    check: (s) =>
      s.endingPath === "broker" &&
      (hasTrait(s, "ruthless") || hasTrait(s, "compromised") || hasTrait(s, "betrayer")) &&
      s.stats.wasta >= 100,
  },

  {
    id: "beloved",
    title: "The Beloved",
    arabic: "المحبوب",
    epilogue:
      "You hold no formal title. You did not need one. " +
      "When you walk through Souq Mubarakiya, three traders refuse your money. " +
      "Children at Sheikh Abdullah's mosque know your name without being told. " +
      "When the floods came in '32, the line at your door went around the block. " +
      "When your daughter married, every faction sent representatives, and they " +
      "sat at the same table for the first time in eleven years. " +
      "You were the bridge. You did not call yourself that. Others did. " +
      "Your funeral, when it eventually came, closed three streets. " +
      "The Emir attended. So did the man who used to sweep the diwaniya floor. " +
      "They stood next to each other. They were equally heartbroken.",
    check: (s) =>
      hasTrait(s, "trusted") &&
      hasTrait(s, "honorable") &&
      Object.values(s.factions).filter((v) => v >= 30).length >= 3 &&
      !hasTrait(s, "compromised") &&
      s.endingPath !== "broker",
  },

  {
    id: "patriarch",
    title: "The Patriarch",
    arabic: "كبير العائلة",
    epilogue:
      "Power comes in many forms. You chose the oldest one: family. " +
      "Your three children grew. The first works in the Ministry. " +
      "The second runs the trading company you started in Souq Mubarakiya. " +
      "The third went into medicine and married into a Salmiya family you " +
      "had quietly approved of for years. Your grandchildren — there are " +
      "eight, then twelve — know the diwaniya as a place that has always " +
      "existed and always smelled like cardamom. You step back from public " +
      "life early enough to be present for them. You teach the eldest grandson " +
      "to play baloot. He cheats. You let him win once, then never again. " +
      "When you die, three generations sit aza for you. " +
      "The diwaniya you started becomes 'the diwaniya of so-and-so's grandfather.' " +
      "There is no greater Kuwaiti immortality.",
    check: (s) =>
      (hasTrait(s, "father") || hasTrait(s, "mother")) &&
      s.family.children.length >= 2 &&
      s.businesses.length >= 1,
  },

  {
    id: "ascetic",
    title: "The Quiet Path",
    arabic: "الطريق الهادئ",
    epilogue:
      "You stepped back. Slowly at first — a meeting missed here, an event " +
      "declined there. Then more decisively. You started teaching at Sheikh " +
      "Abdullah's mosque on Friday afternoons. The class began with twelve students. " +
      "By the third year it was sixty. You never wrote a book. You wrote no policies. " +
      "You sat with three young men who would have made very bad decisions and " +
      "talked them into making better ones. None of them ever knew that the man " +
      "who saved their lives was once supposed to sit at the long table. " +
      "You died in winter, on a Tuesday, between dawn and noon prayers. " +
      "The mosque was full. They buried you simply. No headstone. The way you wanted.",
    check: (s) =>
      s.endingPath === "ascetic" ||
      (hasTrait(s, "pious") && hasTrait(s, "hajji") && s.factions.religious >= 50),
  },

  {
    id: "exiled",
    title: "The Long Drive",
    arabic: "الرحيل الطويل",
    epilogue:
      "The audit became something larger. The case became a file. The file became " +
      "a year of court. You were not convicted of anything that would be on a " +
      "passport. But your name was on the wrong list, and in this country that " +
      "is enough. You moved to London — for the schools, you said. " +
      "You did not come back for Eid. You did not come back for funerals. " +
      "You did not come back. The diwaniya you used to sit in stopped having a " +
      "chair for you years before you noticed. " +
      "On a winter evening in Knightsbridge you sit in a flat with a view of a " +
      "park you did not grow up around, and you write a letter to a son who is " +
      "more British than Kuwaiti now. " +
      "You wonder if you would do anything differently. " +
      "You don't finish the letter. You have started it many times.",
    check: (s) =>
      (hasTrait(s, "compromised") && hasTrait(s, "exiled")) ||
      (s.factions.government < -10 && s.stats.rep < 0),
  },

  {
    id: "ruined",
    title: "The Forgotten Name",
    arabic: "الاسم المنسي",
    epilogue:
      "There is a kind of falling that has no bottom. " +
      "You hit it. You hit it again. You hit it a third time. " +
      "Friends who would have helped didn't return calls — not from cruelty, but " +
      "from exhaustion. There is a limit to what people can carry on your behalf, " +
      "and you had passed it. " +
      "You do not become a villain in any story. You become a name that drops " +
      "out of stories — first from the diwaniya gossip, then from the family " +
      "WhatsApp groups, then from your father's birthday list. " +
      "You are alive somewhere in Kuwait. You are quiet. You are forty-eight " +
      "years old and you have stopped trying to be anyone in particular. " +
      "Some nights you walk to the corniche and watch the towers light up at dusk. " +
      "You do not feel sorry for yourself. " +
      "You do not feel anything in particular.",
    check: (s) =>
      s.stats.wasta < 20 &&
      s.stats.rep < 0 &&
      Object.values(s.relationships).filter((v) => v >= 50).length === 0,
  },

  {
    id: "merchant_lord",
    title: "The Merchant Lord",
    arabic: "تاجر الديرة",
    epilogue:
      "The third stall became seven. Seven became seventeen. " +
      "By the time you turned fifty, the family name was on three buildings, " +
      "two of them in Sharq, one of them in Riyadh. Mubarak's grandchildren " +
      "worked under your nephew. You opened the office in Dubai — quietly, the " +
      "way these things must be done. You missed three Eids in a row to close " +
      "the Indonesia deal. Your daughter forgave you eventually. " +
      "Bu Khalid said, at your sixtieth, raising a cup: 'This man — this man " +
      "took the souq to the world.' The room laughed. He was not exaggerating. " +
      "When you finally retire, you do it the way you did everything else: " +
      "all at once, with a clear plan, on a Thursday morning. " +
      "Your son inherits the company. He is not as good as you. He is good enough.",
    check: (s) =>
      hasTrait(s, "calculating") &&
      s.stats.money >= 15000 &&
      s.factions.merchants >= 50 &&
      s.businesses.length >= 2,
  },

  {
    id: "tribe_head",
    title: "The Father of the Family",
    arabic: "كبير القبيلة",
    epilogue:
      "When your father's brother passed without sons, the question of who " +
      "would lead the family was settled before it was asked. You went to the " +
      "desert. You stayed. The Thursday majlis became your majlis. The young " +
      "men of the family who had drifted to Hawally and Salmiya started " +
      "coming back. The Friday gatherings grew until they had to be moved outdoors. " +
      "You arbitrated three land disputes that had outlasted everyone who " +
      "started them. You buried two of your uncles, married off seven cousins, " +
      "and stood as wakil for thirteen weddings. " +
      "On a winter evening at the camp, with the fire going and the whole " +
      "family around it, your son asks why you didn't take the council seat. " +
      "You point at the fire. 'This,' you say. 'This is the seat.' " +
      "He does not understand yet. He will.",
    check: (s) =>
      s.endingPath === "tribe_head" ||
      (hasTrait(s, "loyal") && s.worldFlags.tribal_son === true && s.factions.tribal >= 60),
  },

  {
    id: "imam",
    title: "The Inheritor of the Mosque",
    arabic: "وارث المنبر",
    epilogue:
      "When Sheikh Abdullah grew too tired to climb the minbar, you climbed it. " +
      "Not because you wanted to — because there was no one else he trusted. " +
      "Your khutbahs were not the most quoted in the country. They were the " +
      "ones men remembered when their fathers died. You were not asked to " +
      "appear on television and you would have refused. The mosque grew. The " +
      "Friday class — Hajja Fatma's class, originally — became a network " +
      "of teachers across three governorates. " +
      "When the new minister of awqaf wanted to consult you, you made him come " +
      "to the mosque. You served him bad coffee and good advice. " +
      "You died in sujood, on a Friday, in the second rakah of fajr. " +
      "The mosque was packed for your janaza. " +
      "It rained. They said even the sky.",
    check: (s) =>
      hasTrait(s, "pious") &&
      hasTrait(s, "hajji") &&
      s.factions.religious >= 60 &&
      (s.relationships["Sheikh Abdullah"] || 0) >= 90,
  },
];

export function determineEnding(s: GameState): Ending {
  const priority: string[] = [
    "tribe_head",
    "imam",
    "merchant_lord",
    "patriarch",
    "exiled",
    "ruined",
    "ascetic",
    "betrayer_king",
    "beloved",
    "broker",
    "independent",
  ];

  for (const id of priority) {
    const e = endings.find((x) => x.id === id);
    if (e && e.check(s)) return e;
  }

  return endings.find((e) => e.id === "independent")!;
}
