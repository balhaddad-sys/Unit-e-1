// src/data/dilemmas.ts
// 40+ random encounter events, fired during play.
//
// Categories: social · comedy · anger · shame · risk · family · romance · crisis · challenge
//
// Each dilemma has:
// - minDay/maxDay gating (e.g. romance only past day 20)
// - requiresTrait/forbidsTrait gating (e.g. family scandals only fire if compromised)
// - oneShot flag (one-time events that mark the world)
// - some have probabilistic risk outcomes
// - some chain into duels
//
// The system is designed so the player feels a steady drumbeat of decisions.

import type { Dilemma } from "@/lib/types";

export const dilemmas: Dilemma[] = [
  // ═══════════════════════════════════════════════════════════════
  // SOCIAL — the foundational dilemmas, always available
  // ═══════════════════════════════════════════════════════════════
  {
    id: "the_one_who_asks",
    tag: "Wasta",
    title: "The one who asks",
    category: "social",
    text: "Over gahwa they open: \"I need someone respected to push a paper through with me — your name opens the door.\" The favor pulls you toward one faction and away from another. You feel the room watching.",
    accept: {
      label: "Accept and use your name",
      wasta: 3, rep: 2, energy: -12,
      factions: { merchants: 2, government: -1 },
    },
    refuse: {
      label: "Decline politely — \"another time, brother\"",
      rep: -2, wasta: -1,
    },
  },

  {
    id: "the_unanswered_greeting",
    tag: "Reputation",
    title: "The unanswered greeting",
    category: "shame",
    text: "Someone mentioned in the diwaniya that you didn't return their salaam yesterday. You were on your phone. They are sensitive. The room has noticed. Umm Nasser is looking at you over her cup.",
    accept: {
      label: "Apologize publicly, in front of everyone",
      rep: 3, energy: -5,
    },
    refuse: {
      label: "Let it cool — they'll forget",
      rep: -2,
    },
  },

  {
    id: "between_two_cousins",
    tag: "The rift",
    title: "Between two cousins",
    category: "family",
    text: "Two members of your circle are at odds over inheritance. Each pulls you to their side. You can mediate and risk both. There's a wedding next month where everyone will be in the same room.",
    accept: {
      label: "Mediate the dispute",
      wasta: 4, rep: 1, energy: -15,
    },
    refuse: {
      label: "Stay neutral and pray",
      rep: -3,
    },
    third: {
      label: "Side with the one who's right (you can tell)",
      requiresTrait: "honorable",
      wasta: 2, rep: 5, factions: { tribal: 3 },
    },
  },

  {
    id: "money_or_face",
    tag: "Old debt",
    title: "Money or face",
    category: "social",
    text: "An old contact asks you to forgive a 200 KD debt. He's down on his luck — wife pregnant, car broke down, uncle won't help. Insisting could be seen as cold. Others are watching to see what you do.",
    accept: {
      label: "Forgive the debt — wallah it's nothing",
      money: -200, rep: 5, wasta: 3,
    },
    refuse: {
      label: "Insist — debts are debts",
      money: 200, rep: -3,
    },
  },

  {
    id: "the_whisper",
    tag: "The room",
    title: "A name dropped",
    category: "social",
    text: "You overhear a damaging rumor about someone you respect. It's false but plausible. The room is leaning in, eager. Do you correct it or let it travel?",
    accept: {
      label: "Correct the record",
      rep: 4, energy: -6,
      factions: { tribal: 2 },
    },
    refuse: {
      label: "Let it travel — not your business",
      rep: -1, wasta: 1,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // COMEDY — the texture events, lighter stakes but real flavor
  // ═══════════════════════════════════════════════════════════════
  {
    id: "wrong_shoes",
    tag: "Comedy",
    title: "The wrong shoes",
    category: "comedy",
    text: "You arrive at the diwaniya and look down. You are wearing two different shoes. One is brown, one is black. Bu Khalid notices. Then everyone notices.",
    accept: {
      label: "Lean into it — make a joke about it",
      rep: 3, energy: -3,
    },
    refuse: {
      label: "Hide your feet under the table all night",
      rep: -2,
    },
  },

  {
    id: "wrong_whatsapp",
    tag: "Comedy",
    title: "Wrong WhatsApp group",
    category: "comedy",
    text: "You meant to send the meme to your friend group. You sent it to the family group. Your grandmother is asking what 'sus' means. Your grandfather is typing.",
    accept: {
      label: "Apologize, explain, accept the teasing",
      rep: 1, energy: -2,
    },
    refuse: {
      label: "Delete-for-everyone — but they all saw",
      rep: -3,
    },
  },

  {
    id: "cousin_borrows_50",
    tag: "Comedy",
    title: "The cousin who borrows",
    category: "comedy",
    text: "Your second cousin Faisal calls. He needs 'just 50 KD until Thursday.' He has needed 50 KD until Thursday for the past four Thursdays. He is your cousin.",
    accept: {
      label: "Send it. Again. (مالك إلا الصبر)",
      money: -50, rep: 1,
    },
    refuse: {
      label: "Tell him you're broke",
      rep: -1, wasta: 1,
    },
    third: {
      label: "Give him 200 and say it's the last time",
      requiresTrait: "loyal",
      money: -200, rep: 4,
    },
  },

  {
    id: "phone_dishwasher",
    tag: "Comedy",
    title: "Phone in the dishwasher",
    category: "comedy",
    text: "Your mother, cleaning, mistook your phone for a small plate. She put it in the dishwasher. The full cycle. It is now a small clean brick. You have 200 missed calls.",
    accept: {
      label: "Buy a new one — what can you do, she meant well",
      money: -180, rep: 1, energy: -5,
    },
    refuse: {
      label: "Snap at her and regret it for a week",
      rep: -3, energy: -8,
    },
  },

  {
    id: "karak_emergency",
    tag: "Comedy",
    title: "Karak emergency",
    category: "comedy",
    text: "It's 3 PM. The chai karak shop down the street has run out. The substitute karak is — frankly — an insult. Bu Yousef is staring at his cup like it stole something from him.",
    accept: {
      label: "Drive 20 minutes to the good karak place",
      money: -15, rep: 2, energy: 5,
    },
    refuse: {
      label: "Drink the bad karak in silence",
      rep: -1,
    },
  },

  {
    id: "wedding_dance",
    tag: "Comedy",
    title: "The wedding dance",
    category: "comedy",
    text: "You're at a wedding. The groom's uncle has spotted you across the dance floor. He is making the universal gesture for 'come, dance.' Three hundred people are between you and the exit.",
    accept: {
      label: "Dance — commit fully — embarrass yourself with dignity",
      rep: 3, energy: -6,
      factions: { tribal: 2 },
    },
    refuse: {
      label: "Hide in the bathroom until they finish",
      rep: -2,
    },
  },

  {
    id: "eidiya_problem",
    tag: "Comedy",
    title: "The eidiya envelope",
    category: "comedy",
    minDay: 85,
    text: "Eid morning. You have prepared envelopes for the children. Your aunt's children have unexpectedly multiplied since last Eid. There are now nine where there were six. You have six envelopes.",
    accept: {
      label: "Withdraw cash from the secret stash, top up quickly",
      money: -90, rep: 4, energy: -3,
    },
    refuse: {
      label: "Stretch the envelopes — claim it's a misunderstanding",
      rep: -5, factions: { tribal: -3 },
    },
  },

  {
    id: "the_haircut",
    tag: "Comedy",
    title: "The haircut",
    category: "comedy",
    text: "Your barber, after fifteen years, has retired. The new barber is enthusiastic and very, very wrong. You walk out looking different. The diwaniya falls silent when you enter.",
    accept: {
      label: "Own it — claim it was on purpose",
      rep: 2, energy: -2,
    },
    refuse: {
      label: "Wear a ghutra low for two weeks",
      rep: -1,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // ANGER — confrontations, the hot moments
  // ═══════════════════════════════════════════════════════════════
  {
    id: "honking_man",
    tag: "Confrontation",
    title: "The honking man",
    category: "anger",
    text: "You're at the traffic light. The man behind you is honking before the light has even turned green. Three times. Long. Like he's calling a goat. Your blood is rising.",
    accept: {
      label: "Get out of the car and have words",
      rep: -2, energy: -8,
    },
    refuse: {
      label: "Breathe. Let it pass.",
      rep: 1, energy: -2,
    },
  },

  {
    id: "line_skipper",
    tag: "Confrontation",
    title: "The line skipper",
    category: "anger",
    text: "You've been in this Ministry queue for 90 minutes. A man walks past everyone, says 'just one signature,' and goes to the front. He is wearing sunglasses indoors.",
    accept: {
      label: "Call him out loudly. Everyone needs to hear.",
      rep: 3, wasta: -2, energy: -10,
    },
    refuse: {
      label: "Say nothing — pick your battles",
      rep: -1, energy: -3, wasta: 1,
    },
  },

  {
    id: "the_accused",
    tag: "Honor",
    title: "The accused",
    category: "anger",
    text: "Someone in the diwaniya — drunk on their own importance — implies your family did something dishonorable. The room has gone silent. Everyone waits.",
    accept: {
      label: "Stand — defend the family name",
      rep: 6, wasta: 3, energy: -12,
      factions: { tribal: 4 },
    },
    refuse: {
      label: "Sit silent — and lose everything that mattered",
      rep: -8, wasta: -4,
    },
    third: {
      label: "Challenge him to a Gahwa Duel right there",
      requiresTrait: "confrontational",
      triggerDuel: "gahwa",
      label_extra: "(triggers Gahwa Duel)",
    } as any,
  },

  {
    id: "bad_service",
    tag: "Confrontation",
    title: "Bad service",
    category: "anger",
    text: "The waiter has been ignoring your table for an hour. He just gave the next table their order — they arrived after you. Your patience is finished.",
    accept: {
      label: "Speak to the manager — politely",
      rep: 1, money: -30, energy: -5,
    },
    refuse: {
      label: "Tip badly and leave",
      rep: -1, energy: -2,
    },
  },

  {
    id: "the_broken_lift",
    tag: "Confrontation",
    title: "The broken lift",
    category: "anger",
    text: "Your building's elevator has been broken for three weeks. The owner is dodging calls. You live on the 8th floor. You meet him by chance at the corniche.",
    accept: {
      label: "Confront him publicly — embarrass him into fixing it",
      rep: 2, energy: -8,
    },
    refuse: {
      label: "Keep climbing the stairs — stay civil",
      rep: 1, energy: -5,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // SHAME / NUZUL — the painful moments
  // ═══════════════════════════════════════════════════════════════
  {
    id: "wrong_name",
    tag: "Shame",
    title: "Wrong name",
    category: "shame",
    text: "You greet Bu Khalid's wife by the name of his ex-wife. There is no recovering from this. The room is staring at you like you set fire to something sacred.",
    accept: {
      label: "Apologize fifteen times — send flowers",
      rep: -8, wasta: -3, energy: -10, money: -100,
    },
    refuse: {
      label: "Pretend it didn't happen",
      rep: -15, factions: { merchants: -5 },
    },
  },

  {
    id: "butt_dial",
    tag: "Shame",
    title: "The phone call mistake",
    category: "shame",
    text: "You butt-dialed a senior figure during a private conversation about — them. They heard everything. They are calling you back. Right now.",
    accept: {
      label: "Pick up. Apologize. Take the consequences.",
      rep: -5, wasta: 2, energy: -15,
    },
    refuse: {
      label: "Let it ring out — hide for three days",
      rep: -12, wasta: -6,
    },
  },

  {
    id: "forgotten_wedding",
    tag: "Shame",
    title: "The forgotten wedding",
    category: "shame",
    text: "You forgot to attend a cousin's wedding. They are calling. Their mother is calling. Their father is — somehow — also calling. From three different numbers.",
    accept: {
      label: "Show up to the after-party with a huge gift",
      money: -200, rep: -3, wasta: -2, energy: -12,
    },
    refuse: {
      label: "Make up an illness — pray they don't ask which doctor",
      rep: -10, factions: { tribal: -5 },
    },
  },

  {
    id: "the_misquote_circulated",
    tag: "Shame",
    title: "The misquote",
    category: "shame",
    text: "In a public WhatsApp group with 200+ members, someone misquoted you. The misquote is making you look foolish. Two friends have already privately asked, \"Did you really say that?\"",
    accept: {
      label: "Demand a public Diwaniya Debate",
      energy: -12, rep: 8, wasta: 4,
      triggerDuel: "debate",
    },
    refuse: {
      label: "Address it privately — let the group forget",
      rep: -5,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // RISK — probabilistic outcomes, the gambling category
  // ═══════════════════════════════════════════════════════════════
  {
    id: "oil_services_investment",
    tag: "Risk",
    title: "The investment",
    category: "risk",
    minDay: 15,
    text: "A man you barely know but who came recommended is offering an oil-services investment. \"Triple in six months, brother.\" His shoes are very nice. You've heard one of two things happen with these.",
    accept: {
      label: "Invest 500 KD",
      money: -500,
      risk: {
        prob: 0.45,
        win: { money: 1500, rep: 3, label: "It worked. The cheque clears Tuesday." },
        lose: { rep: -5, label: "He vanished. So did your money. And your trust in clean shoes." },
      },
    },
    refuse: {
      label: "Decline — too good to be true",
      rep: 1,
    },
  },

  {
    id: "card_game",
    tag: "Risk",
    title: "The card game",
    category: "risk",
    text: "Cousins are playing baloot at the diwaniya. Stakes are real. Bu Mishari winks at you — \"Come, just one round.\" One round, of course, has never been one round.",
    accept: {
      label: "Sit down — play one round",
      energy: -8,
      risk: {
        prob: 0.5,
        win: { money: 300, rep: 2, label: "You won. They take it well — mostly." },
        lose: { money: -300, rep: -3, label: "You lost. And the next hand. And the one after." },
      },
    },
    refuse: {
      label: "Bow out — \"My wife will kill me\"",
      rep: 1,
    },
  },

  {
    id: "falcon_bet",
    tag: "Risk",
    title: "Dinar on the bird",
    category: "risk",
    minDay: 30,
    text: "Talal is taking bets on which falcon catches first at this morning's hunt. The favorite is a Saudi import. Talal's own bird is the underdog. Tribal honor is on the table.",
    accept: {
      label: "Bet on Talal's bird (3-to-1)",
      money: -200,
      risk: {
        prob: 0.4,
        win: { money: 600, rep: 4, faction: "tribal", factionAmt: 5, label: "Talal's bird took it. The desert remembers the believers." },
        lose: { rep: -2, label: "His bird came back empty. Talal won't make eye contact for a week." },
      },
    },
    refuse: { label: "Don't bet — just watch", rep: 0 },
  },

  {
    id: "real_estate_tip",
    tag: "Risk",
    title: "Real estate tip",
    category: "risk",
    minDay: 45,
    text: "Rashed has 'inside information' about a parcel of land in Sabah Al-Salem. \"Going to be rezoned in three months. Get in now.\" The land is real. The information may not be.",
    accept: {
      label: "Buy the parcel (3,000 KD)",
      money: -3000,
      risk: {
        prob: 0.55,
        win: { money: 8000, rep: 5, faction: "merchants", factionAmt: 6, label: "The rezoning came through. You sold for triple." },
        lose: { rep: -3, faction: "government", factionAmt: -3, label: "The rezoning didn't happen. The land sits useless. Rashed has 'lost his phone.'" },
      },
    },
    refuse: { label: "Pass — too speculative", rep: 1 },
  },

  // ═══════════════════════════════════════════════════════════════
  // FAMILY — the obligations and warmth and friction
  // ═══════════════════════════════════════════════════════════════
  {
    id: "the_proposal",
    tag: "Family",
    title: "The proposal",
    category: "family",
    minDay: 35,
    forbidsTrait: "married",
    text: "Your mother has been arranging things. A family is coming this Thursday with their daughter. They've been told you are 'ready.' You are not ready. The dishdashas are being ironed.",
    accept: {
      label: "Sit through the meeting — be polite",
      rep: 3, money: -100, energy: -15,
      factions: { tribal: 3, religious: 2 },
      flag: "met_proposal",
    },
    refuse: {
      label: "Tell your mother no — finally",
      rep: -5,
      factions: { tribal: -3 },
    },
  },

  {
    id: "the_funeral",
    tag: "Family",
    title: "The funeral",
    category: "family",
    text: "A relative has passed. The aza is starting tonight. You barely knew him — but the family expects you. Three days of sitting, condolences, gahwa, more condolences.",
    accept: {
      label: "Attend all three days",
      rep: 8, energy: -25,
      factions: { tribal: 5, religious: 3 },
    },
    refuse: {
      label: "Send your apologies — appear briefly day one",
      rep: -8, factions: { tribal: -6 },
    },
  },

  {
    id: "borrowed_car",
    tag: "Family",
    title: "The borrowed car",
    category: "family",
    text: "Your nephew Saud took your car without asking. He returned it. There is a new dent. He is denying it. The dent is the same shape as the curb at his university.",
    accept: {
      label: "Pay for the repair — let him save face",
      money: -80, rep: 1,
    },
    refuse: {
      label: "Confront him — make him pay",
      rep: -3, energy: -8,
    },
  },

  {
    id: "bahraini_aunt",
    tag: "Family",
    title: "The visiting aunt",
    category: "family",
    text: "Your aunt from Bahrain is here for two weeks. She has commentary on everything. Your weight. Your job. Your unmarried state. Your house. Your hair. Your driving.",
    accept: {
      label: "Smile and nod for two weeks",
      rep: 2, energy: -15,
    },
    refuse: {
      label: "Snap at her — and hear about it for ten years",
      rep: -5, factions: { tribal: -3 },
    },
  },

  {
    id: "father_sick",
    tag: "Family",
    title: "Father is sick",
    category: "family",
    minDay: 60,
    oneShot: true,
    text: "Your father has been admitted to the hospital. The doctors are calm but careful. Your mother has not slept. You can drop everything for a week or you can manage from a distance.",
    accept: {
      label: "Stay at the hospital — let work wait",
      rep: 12, money: -200, energy: -25, wasta: -5,
      factions: { tribal: 6 },
      flag: "stayed_for_father",
    },
    refuse: {
      label: "Visit briefly each evening — keep working",
      rep: -3,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // ROMANCE — only fires past day 20
  // ═══════════════════════════════════════════════════════════════
  {
    id: "childhood_crush",
    tag: "Heart",
    title: "The childhood crush",
    category: "romance",
    minDay: 20,
    forbidsTrait: "married",
    oneShot: true,
    text: "At a wedding, you see them again. The one your family didn't approve of, ten years ago. They're alone. They smile. The room is loud, but you can hear them somehow.",
    accept: {
      label: "Speak to them — risk it again",
      rep: -2, wasta: -1, energy: -8,
      flag: "rekindled",
    },
    refuse: {
      label: "Walk past — the past is the past",
      rep: 1,
    },
  },

  {
    id: "letter",
    tag: "Heart",
    title: "A letter that arrives",
    category: "romance",
    minDay: 30,
    forbidsTrait: "married",
    text: "A letter, hand-written, in your mailbox. No return address. The handwriting is from someone you used to know. You haven't been written a letter in fifteen years.",
    accept: {
      label: "Reply — what do you have to lose?",
      energy: -5, rep: 1,
      flag: "replied_to_letter",
    },
    refuse: {
      label: "Burn it. Some doors close for a reason.",
      rep: 0,
    },
  },

  {
    id: "the_cafe_meeting",
    tag: "Heart",
    title: "Coffee at the corniche",
    category: "romance",
    minDay: 50,
    requiresFlag: "replied_to_letter",
    text: "You meet at the corniche cafe. They ask if you're happy. You realize you don't know how to answer. They wait — they have been waiting for years.",
    accept: {
      label: "Pursue this — you are not getting younger",
      rep: -2, wasta: -3, energy: -10,
      flag: "courting",
    },
    refuse: {
      label: "End it cleanly. Marry someone your family chooses.",
      rep: 2,
      factions: { tribal: 2 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CRISIS — late game high-stakes
  // ═══════════════════════════════════════════════════════════════
  {
    id: "the_audit",
    tag: "Crisis",
    title: "The audit",
    category: "crisis",
    minDay: 60,
    text: "A government audit has flagged something in your records. It might be a misunderstanding. It might be career-ending. Bu Yousef called you, off the books, to warn you.",
    accept: {
      label: "Hire the best lawyer — fight clean",
      money: -800, wasta: -5, energy: -20, rep: 3,
    },
    refuse: {
      label: "Hope it goes away (it will not)",
      wasta: -15, rep: -10,
      factions: { government: -10 },
      flag: "compromised_papers",
    },
  },

  {
    id: "public_humiliation",
    tag: "Crisis",
    title: "Public humiliation",
    category: "crisis",
    minDay: 70,
    text: "A video of you — taken out of context — is circulating. It looks bad even though you did nothing wrong. The diwaniya WhatsApp groups are on fire.",
    accept: {
      label: "Make a public statement, hire a media person",
      rep: -8, wasta: -3, energy: -25, money: -300,
    },
    refuse: {
      label: "Disappear from public for a month",
      rep: -20, wasta: -10,
      factions: { merchants: -5, government: -5 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // CHALLENGE — duel hooks
  // ═══════════════════════════════════════════════════════════════
  {
    id: "new_face",
    tag: "Challenge",
    title: "The new face",
    category: "challenge",
    text: "A man you don't know walks into the diwaniya. Confident. Loud. Within an hour he is comparing himself to you — favorably. The room glances at you. The cup is in his hand.",
    accept: {
      label: "Challenge him to a Gahwa Duel",
      energy: -10, rep: 5, wasta: 3,
      triggerDuel: "gahwa",
    },
    refuse: {
      label: "Let him have the room — for now",
      rep: -3, wasta: -2,
    },
  },

  {
    id: "young_lion",
    tag: "Challenge",
    title: "The young lion",
    category: "challenge",
    minDay: 50,
    text: "A young man with a famous father is trying to make a name. He has chosen yours to climb on. He challenges you — quite publicly — to a Diwaniya Debate.",
    accept: {
      label: "Accept — show him what experience looks like",
      energy: -15, rep: 6, wasta: 4,
      triggerDuel: "debate",
    },
    refuse: {
      label: "Refuse — \"my time is more valuable than this\"",
      rep: -5, wasta: -3,
    },
  },
];
