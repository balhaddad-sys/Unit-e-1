// src/data/storyQuests.ts
// The 5-act storyline. Every branch leaves marks.

import type { Act, StoryQuest } from "@/lib/types";
import { addTrait } from "@/engine/traits";

// ============================================================
// ACTS — overall arc
// ============================================================
export const acts: Act[] = [
  {
    id: "newcomer",
    n: 1,
    title: "The Newcomer",
    arabic: "الوافد",
    intro:
      "You arrive in the diwaniya not yet known. Names are exchanged but not yet remembered. A man can be many things in this season — anything, almost. The room is watching.",
    enterCond: () => true,
    exitCond: (s) =>
      Object.values(s.relationships).filter((v) => v >= 70).length >= 2 &&
      (s.questsDone || 0) >= 2,
    closingScene:
      "Your first season closes. People nod when you arrive. The room knows your face. Bu Khalid asked your father about you, and your father called proudly that night.",
  },
  {
    id: "riser",
    n: 2,
    title: "The Riser",
    arabic: "الصاعد",
    intro:
      "Word travels in this country. Doors that were closed loosen on their hinges. People want to know what you'll do — and who you'll do it with.",
    enterCond: () => true,
    exitCond: (s) => (s.questsDone || 0) >= 6 && s.stats.wasta >= 25,
    closingScene:
      "You have built a name. Bu Yousef calls you 'akhuy' — my brother — without smirking. The next test is what you do with what you've built.",
  },
  {
    id: "operator",
    n: 3,
    title: "The Operator",
    arabic: "المُحرِّك",
    intro:
      "You no longer wait to be invited. The diwaniya watches your moves and weighs them. People begin to align themselves around you — for or against.",
    enterCond: () => true,
    exitCond: (s) =>
      (s.questsDone || 0) >= 12 && s.stats.wasta >= 50 && s.stats.rep >= 30,
    closingScene:
      "Your reputation precedes the room. People shape conversations around you now. The tribal elders ask about you. So do the new families. You are no longer riding currents — you are one.",
  },
  {
    id: "insider",
    n: 4,
    title: "The Insider",
    arabic: "صاحب المجلس",
    intro:
      "You sit close to the head of the room now. What you say carries — and what you choose not to say carries more. Old friends watch you for signs of change. Some wait to see if you'll forget them.",
    enterCond: () => true,
    exitCond: (s) =>
      (s.questsDone || 0) >= 20 &&
      s.stats.wasta >= 90 &&
      Object.values(s.factions).filter((v) => v >= 30).length >= 2,
    closingScene:
      "The city has accepted you among its quiet powers. There is one chapter left — and it asks the question every Kuwaiti man must eventually face: what kind of power do you actually want?",
  },
  {
    id: "broker",
    n: 5,
    title: "The Power Broker",
    arabic: "رجل الكلمة",
    intro:
      "You no longer chase doors — they open for you. But everything you hold is balanced on what you owe and what is owed to you. The ground is firmer than it has ever been. And further to fall.",
    enterCond: () => true,
    exitCond: () => false,
    closingScene: "",
  },
];

// ============================================================
// STORY QUESTS — the act-defining quest for each act
// ============================================================
export const storyQuests: StoryQuest[] = [
  {
    id: "sq_act1",
    act: "newcomer",
    title: "Cup of Welcome",
    arabic: "فنجان الترحيب",
    npc: "Umm Nasser",
    zone: "diwaniya",
    desc: "Umm Nasser sits at the heart of every gathering. To establish yourself, you need her to nod when your name is spoken. She does not give that nod easily — and once it is given, it cannot easily be retracted.",
    steps: [
      {
        label: "Visit Umm Nasser at the Diwaniya District",
        check: (s) => s.location === "diwaniya",
      },
      {
        label: "Build her relationship to Friendly (70+)",
        check: (s) => (s.relationships["Umm Nasser"] || 0) >= 70,
      },
      {
        label: "Do an unprompted favor for her",
        check: (s) =>
          s.favors.some((f) => f.who === "Umm Nasser" && f.kind === "owedToYou"),
      },
    ],
    rewards: { wasta: 8, rep: 5, money: 200, faction: "tribal", factionAmt: 5 },
    closing:
      "Umm Nasser pours you a third cup. \"You're welcome here,\" she says quietly. The room hears it. Your name carries something now. Then she leans closer: \"But understand — what kind of welcome you accept now will shape what kind of man you are seen to be.\"",
    branch: {
      key: "act1_path",
      prompt: "How do you accept her welcome?",
      options: [
        {
          id: "tribal_embrace",
          label: "Bow your head — accept the tribal embrace fully",
          gainsTrait: "loyal",
          unlocksFlag: "umm_nasser_inner_circle",
          effect: (s) => {
            s.factions.tribal += 8;
            s.factions.merchants -= 2;
            addTrait(s, "loyal");
            s.worldFlags.umm_nasser_inner_circle = true;
          },
        },
        {
          id: "polite_distance",
          label: "Thank her warmly — but keep some distance",
          gainsTrait: "calculating",
          unlocksFlag: "kept_distance",
          effect: (s) => {
            s.factions.merchants += 4;
            s.factions.tribal += 2;
            addTrait(s, "calculating");
            s.worldFlags.kept_distance = true;
          },
        },
        {
          id: "honest_refusal",
          label: "\"I have not yet earned this — let me deserve it first\"",
          gainsTrait: "honorable",
          unlocksFlag: "earned_respect",
          effect: (s) => {
            s.stats.rep += 8;
            s.factions.tribal += 4;
            s.factions.religious += 4;
            addTrait(s, "honorable");
            s.worldFlags.earned_respect = true;
          },
        },
      ],
    },
  },

  {
    id: "sq_act2",
    act: "riser",
    title: "The Permits Crisis",
    arabic: "أزمة الأختام",
    npc: "Bu Yousef",
    zone: "govzone",
    desc: "Bu Yousef's department is in trouble. A backlog of permits has built up over months. Tempers are short and the minister is asking questions. Bu Yousef needs a name to lean on. He calls yours.",
    steps: [
      {
        label: "Meet Bu Yousef at the Ministry District",
        check: (s) => s.location === "govzone",
      },
      {
        label: "Build relationship with him to 75+",
        check: (s) => (s.relationships["Bu Yousef"] || 0) >= 75,
      },
      {
        label: "Have at least 25 wasta in reserve",
        check: (s) => s.stats.wasta >= 25,
      },
      {
        label: "Win a Diwaniya Debate to set the public tone",
        check: (s) => (s.debatesWon || 0) >= 1,
      },
    ],
    rewards: { wasta: 15, rep: 10, money: 500, faction: "government", factionAmt: 8 },
    closing:
      "The papers move again. The backlog clears. Bu Yousef pulls you aside in the parking garage and says — quietly — \"I won't forget this.\" He doesn't ask you to forget it either.",
    branch: {
      key: "act2_method",
      prompt: "How did you handle the crisis?",
      options: [
        {
          id: "public_reform",
          label: "Took the public win — let your name be on the headline",
          gainsTrait: "diplomatic",
          unlocksFlag: "public_figure",
          effect: (s) => {
            s.stats.rep += 8;
            s.factions.government += 5;
            addTrait(s, "diplomatic");
            s.worldFlags.public_figure = true;
          },
        },
        {
          id: "quiet_maneuver",
          label: "Worked behind the scenes — let Bu Yousef have the credit",
          gainsTrait: "loyal",
          unlocksFlag: "owed_major_favor_yousef",
          effect: (s) => {
            s.stats.wasta += 10;
            s.factions.government += 3;
            addTrait(s, "loyal");
            s.worldFlags.owed_major_favor_yousef = true;
            s.favors.push({
              who: "Bu Yousef",
              kind: "owedToYou",
              weight: "major",
              reason: "He owes you the Permits Crisis.",
            });
            addTrait(s, "owed_major");
          },
        },
        {
          id: "leveraged_for_self",
          label: "Used the chaos to push your own deal through first",
          gainsTrait: "ruthless",
          unlocksFlag: "compromised_papers",
          effect: (s) => {
            s.stats.money += 600;
            s.stats.wasta += 5;
            s.stats.rep -= 5;
            s.factions.government += 1;
            s.factions.religious -= 4;
            addTrait(s, "ruthless");
            s.worldFlags.compromised_papers = true;
          },
        },
      ],
    },
  },

  {
    id: "sq_act3",
    act: "operator",
    title: "The Falcon and the Flag",
    arabic: "الصقر والراية",
    npc: "Nasser Al-Qallaf",
    zone: "desert",
    desc: "Nasser is hosting the winter falconry gathering — the most-watched tribal event of the year. The same evening, Sheikha Latifa is hosting a state dinner in the city. Both want you there. Both have asked publicly. You can be in only one place.",
    steps: [
      {
        label: "Travel to the Desert Camp",
        check: (s) => s.location === "desert",
      },
      {
        label: "Win a Falconry Contest",
        check: (s) => (s.falconryWon || 0) >= 1,
      },
      {
        label: "Reach Tribal faction at 30+",
        check: (s) => (s.factions["tribal"] || 0) >= 30,
      },
    ],
    rewards: { wasta: 25, rep: 15, money: 800, faction: "tribal", factionAmt: 12 },
    closing:
      "By the firelight, Nasser presents you a kufiya knotted in tribal red. The room around the fire becomes still. \"You belong with us now,\" he says. The honor is real and the obligation is real — they are the same thing.",
    branch: {
      key: "act3_alignment",
      prompt: "Which fire do you sit by tonight?",
      options: [
        {
          id: "stand_with_desert",
          label: "Stand with the desert — accept the kufiya, miss the city dinner",
          gainsTrait: "loyal",
          unlocksFlag: "tribal_son",
          effect: (s) => {
            s.factions.tribal += 12;
            s.factions.merchants -= 6;
            s.factions.government -= 3;
            s.stats.rep += 10;
            addTrait(s, "loyal");
            s.worldFlags.tribal_son = true;
          },
        },
        {
          id: "honor_city",
          label: "Honor the city patron — leave the desert before the contest",
          gainsTrait: "calculating",
          unlocksFlag: "city_aligned",
          effect: (s) => {
            s.factions.merchants += 10;
            s.factions.government += 6;
            s.factions.tribal -= 8;
            s.stats.money += 800;
            addTrait(s, "calculating");
            s.worldFlags.city_aligned = true;
          },
        },
        {
          id: "split_evening",
          label: "Try to do both — make it to both events for an hour each",
          gainsTrait: "diplomatic",
          unlocksFlag: "split_loyalty",
          effect: (s) => {
            s.factions.tribal += 4;
            s.factions.merchants += 4;
            s.stats.rep -= 4;
            s.stats.energy -= 30;
            addTrait(s, "diplomatic");
            s.worldFlags.split_loyalty = true;
          },
        },
        {
          id: "neither_quietly",
          label: "Skip both — claim a family emergency",
          gainsTrait: "calculating",
          forbidsTrait: "loyal",
          unlocksFlag: "ducked",
          effect: (s) => {
            s.factions.tribal -= 5;
            s.factions.merchants -= 5;
            s.stats.rep -= 10;
            s.stats.energy += 10;
            addTrait(s, "calculating");
            s.worldFlags.ducked = true;
          },
        },
      ],
    },
  },

  {
    id: "sq_act4",
    act: "insider",
    title: "The Mediator's Burden",
    arabic: "حِمل الواسطة",
    npc: "Sheikh Abdullah",
    zone: "govzone",
    desc: "Sheikh Abdullah summons you to a private meeting at his mosque. Two old families — the Al-Subaihi and the Al-Mutairi — are in dispute over land that belonged to a shared ancestor. Each family has a claim. Each has called him for support. He believes you can mediate. \"They will accept you,\" he says, \"if you accept the burden.\"",
    steps: [
      {
        label: "Win a Gahwa Duel against a skeptic to demonstrate wisdom",
        check: (s) => (s.gahwaWon || 0) >= 1,
      },
      {
        label: "Reach Religious faction at 25+",
        check: (s) => (s.factions["religious"] || 0) >= 25,
      },
      {
        label: "Have rep 50+",
        check: (s) => s.stats.rep >= 50,
      },
      {
        label: "Speak with Hajja Fatma about the matter",
        check: (s) => (s.relationships["Hajja Fatma"] || 0) >= 70,
      },
    ],
    rewards: { wasta: 40, rep: 20, money: 1500, faction: "religious", factionAmt: 10 },
    closing:
      "After three weeks of meetings, the two families sit in the same room for the first time in eleven years. They sign the agreement. The room is silent — not awkward silence, the other kind, the kind that arrives when something important has happened. Sheikh Abdullah looks at you for a long moment. \"You did the right thing,\" he says — and from him, that is everything.",
    branch: {
      key: "act4_resolution",
      prompt: "How did you reach the agreement?",
      options: [
        {
          id: "true_mediation",
          label: "Found a genuine middle path — both families gave something real",
          gainsTrait: "honorable",
          unlocksFlag: "true_mediator",
          effect: (s) => {
            s.factions.religious += 12;
            s.factions.tribal += 8;
            s.stats.rep += 25;
            s.stats.wasta += 15;
            addTrait(s, "honorable");
            addTrait(s, "trusted");
            s.worldFlags.true_mediator = true;
          },
        },
        {
          id: "favor_one_side",
          label: "Tilted the deal — privately took payment from the Al-Mutairi",
          gainsTrait: "ruthless",
          unlocksFlag: "tilted_mediation",
          effect: (s) => {
            s.stats.money += 3000;
            s.stats.wasta += 10;
            s.factions.religious -= 8;
            s.stats.rep -= 5;
            addTrait(s, "ruthless");
            s.worldFlags.tilted_mediation = true;
            s.worldFlags.bribed_someone = true;
          },
        },
        {
          id: "refuse_burden",
          label: "Decline — \"This is not mine to settle\"",
          gainsTrait: "honorable",
          unlocksFlag: "refused_mediation",
          effect: (s) => {
            s.stats.rep += 5;
            s.factions.religious -= 3;
            s.stats.wasta -= 10;
            addTrait(s, "honorable");
            s.worldFlags.refused_mediation = true;
          },
        },
        {
          id: "exhausting_balance",
          label: "Spend three weeks and most of your money making it work",
          gainsTrait: "honorable",
          unlocksFlag: "exhausted_mediator",
          effect: (s) => {
            s.factions.religious += 8;
            s.factions.tribal += 6;
            s.stats.rep += 15;
            s.stats.money -= 2000;
            s.stats.energy -= 40;
            addTrait(s, "honorable");
            s.worldFlags.exhausted_mediator = true;
          },
        },
      ],
    },
  },

  {
    id: "sq_act5",
    act: "broker",
    title: "The Quiet Throne",
    arabic: "العرش الصامت",
    npc: "Sheikha Latifa",
    zone: "city",
    desc: "Sheikha Latifa invites you to a meeting that has been long in coming. The room is small, lined with old books. She offers you a seat on the council that decides Kuwait's quiet matters — the things that never reach the newspapers. Acceptance changes your life. Refusing keeps you free. There are a third and fourth option that few see clearly enough to choose.",
    steps: [
      {
        label: "Have wasta 100+",
        check: (s) => s.stats.wasta >= 100,
      },
      {
        label: "Have at least 3 factions at 30+",
        check: (s) => Object.values(s.factions).filter((v) => v >= 30).length >= 3,
      },
      {
        label: "Complete 8 personal NPC chains",
        check: (s) => (s.personalQuestsDone || 0) >= 8,
      },
    ],
    rewards: { wasta: 60, rep: 30, money: 5000 },
    closing:
      "She watches you across the table. The choice you make in this room will be the one your name carries.",
    branch: {
      key: "act5_choice",
      prompt: "What do you choose?",
      options: [
        {
          id: "accept_seat",
          label: "Accept the seat — take your place at the long table",
          gainsTrait: "trusted",
          effect: (s) => {
            s.endingPath = "broker";
            s.factions.government += 15;
            s.stats.wasta += 30;
            addTrait(s, "trusted");
          },
        },
        {
          id: "refuse_freedom",
          label: "Refuse — \"I will help from outside\"",
          gainsTrait: "honorable",
          effect: (s) => {
            s.endingPath = "independent";
            s.stats.wasta += 20;
            s.stats.rep += 15;
            addTrait(s, "honorable");
          },
        },
        {
          id: "ascetic_path",
          label: "Step back from public life entirely — take to teaching at the mosque",
          gainsTrait: "pious",
          requiresTrait: "pious",
          effect: (s) => {
            s.endingPath = "ascetic";
            s.factions.religious += 25;
            s.stats.rep += 20;
            addTrait(s, "pious");
          },
        },
        {
          id: "tribe_return",
          label: "Return to the desert — lead your father's family",
          gainsTrait: "loyal",
          requiresTrait: "loyal",
          effect: (s) => {
            s.endingPath = "tribe_head";
            s.factions.tribal += 25;
            s.stats.rep += 15;
            addTrait(s, "loyal");
          },
        },
      ],
    },
  },
];
