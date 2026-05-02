// src/data/personalChains.ts
// 8 NPC personal questlines.

import type { PersonalChain } from "@/lib/types";
import { addTrait } from "@/engine/traits";

export const personalChains: Record<string, PersonalChain> = {
  "Bu Khalid": {
    npc: "Bu Khalid",
    title: "The Last Headline",
    arabic: "الصفقة الأخيرة",
    desc: "Bu Khalid is chasing one final retirement deal — a contract that will set the family up for two generations. He has chosen you to help him close it. You are flattered. You should also be nervous.",
    steps: [
      {
        title: "The Initial Conversation",
        desc: "Meet Bu Khalid at his office on the 38th floor of Al Hamra. He outlines what he wants. The view from his window is the country.",
        zone: "city",
        energy: 8,
        rewards: { wasta: 2, rep: 1 },
      },
      {
        title: "Sound Out the Market",
        desc: "Speak with Mubarak Al-Hawaj at the souq. The merchant network knows things the office network doesn't.",
        zone: "souq",
        energy: 10,
        rewards: { wasta: 3, money: 150, faction: "merchants", factionAmt: 2 },
      },
      {
        title: "The Sensitive Letter",
        desc: "Hand-deliver a letter to Sheikha Latifa. Don't open it. He doesn't want it on email and he doesn't want a courier.",
        zone: "city",
        energy: 12,
        rewards: { wasta: 5, rep: 3, faction: "government", factionAmt: 3 },
      },
      {
        title: "The Rival's Move",
        desc: "A competing firm is muscling in. They send a representative — confident, well-dressed — to the diwaniya. He's testing you. Win a Diwaniya Debate.",
        zone: "diwaniya",
        energy: 16,
        rewards: { wasta: 7, rep: 4, faction: "merchants", factionAmt: 3 },
        requiresDuel: "debate",
      },
      {
        title: "The Closing Dinner",
        desc: "The deal closes tonight at the Sharq Marina restaurant. Bu Khalid wants you there to read the room. Win a Gahwa Duel against the rival's lieutenant who shows up to disrupt.",
        zone: "city",
        energy: 18,
        rewards: { wasta: 12, money: 600, rep: 5, faction: "merchants", factionAmt: 6 },
        requiresDuel: "gahwa",
        branch: {
          key: "khalid_finale",
          options: [
            {
              id: "honorable_close",
              label: "Close the deal cleanly — refuse the side payment Bu Khalid offers",
              gainsTrait: "honorable",
              effect: (s) => {
                s.stats.rep += 12;
                addTrait(s, "honorable");
                s.worldFlags.khalid_clean = true;
              },
            },
            {
              id: "take_kickback",
              label: "Accept the 5,000 KD 'finder's fee' Bu Khalid quietly hands you",
              gainsTrait: "calculating",
              effect: (s) => {
                s.stats.money += 5000;
                s.stats.rep -= 3;
                addTrait(s, "calculating");
                s.worldFlags.khalid_kickback = true;
                s.favors.push({
                  who: "Bu Khalid",
                  kind: "youOwe",
                  weight: "major",
                  reason: "You took the kickback.",
                });
                addTrait(s, "indebted");
              },
            },
          ],
        },
      },
    ],
    completion:
      "Bu Khalid raises his cup. \"It's done.\" He retires the next month. Your name is on the contract beside his. He calls you twice a year for the next decade — sometimes for advice, sometimes just to talk.",
    gainsTrait: "trusted",
  },

  "Umm Nasser": {
    npc: "Umm Nasser",
    title: "Keeper of the Ledger",
    arabic: "أم نصر والدفاتر",
    desc: "Umm Nasser keeps the unwritten ledger of who owes whom in this city. She has decided you should learn it. There is no greater inheritance.",
    steps: [
      {
        title: "Sit in on a Diwaniya",
        desc: "Quietly. Listen. Don't speak unless asked. Watch who looks at whom when names come up.",
        zone: "diwaniya",
        energy: 6,
        rewards: { rep: 3 },
      },
      {
        title: "Recover a Forgotten Favor",
        desc: "There is someone — Umm Nasser tells you who — who owes her from a matter she helped with twelve years ago. Find them at the souq. Remind them gently. Bring back what they offer.",
        zone: "souq",
        energy: 14,
        rewards: { wasta: 4, rep: 2, faction: "tribal", factionAmt: 3 },
      },
      {
        title: "Mediate a Small Dispute",
        desc: "Two merchants are arguing over an unpaid balance. Umm Nasser is too tired to handle it. She wants you to. Win a Diwaniya Debate.",
        zone: "diwaniya",
        energy: 16,
        rewards: { wasta: 6, rep: 4 },
        requiresDuel: "debate",
      },
      {
        title: "The Ledger Itself",
        desc: "She invites you into her sitting room — the small one, behind the formal one. There is a notebook. She does not show it to you. She just lets you understand that it exists.",
        zone: "diwaniya",
        energy: 4,
        rewards: { wasta: 5, rep: 6, faction: "tribal", factionAmt: 5 },
      },
      {
        title: "Your First Entry",
        desc: "She has decided to record one favor on your behalf — a real one, owed by a real person, that she will collect for you when the time is right. You must choose: a small immediate one (paid this year) or a major one (paid possibly never, but enormous if called).",
        zone: "diwaniya",
        energy: 8,
        rewards: { wasta: 8, rep: 5 },
        branch: {
          key: "ledger_choice",
          options: [
            {
              id: "small_certain",
              label: "Take the small certain favor",
              effect: (s) => {
                s.stats.money += 800;
                s.stats.wasta += 3;
                s.favors.push({
                  who: "the ledger",
                  kind: "owedToYou",
                  weight: "small",
                  reason: "Umm Nasser called in a small one for you.",
                });
              },
            },
            {
              id: "major_uncertain",
              label: "Hold for the major one — it may never come",
              gainsTrait: "calculating",
              effect: (s) => {
                addTrait(s, "owed_major");
                s.favors.push({
                  who: "the ledger",
                  kind: "owedToYou",
                  weight: "major",
                  reason: "Umm Nasser holds a major one for you. Use it carefully.",
                });
                s.worldFlags.major_favor_held = true;
              },
            },
          ],
        },
      },
    ],
    completion:
      "Umm Nasser smiles for the first time you've seen. \"Now you understand.\" She marks something in a notebook only she can read. You realize, walking home that night, that you have been entered onto its pages.",
    gainsTrait: "loyal",
  },

  "Nasser Al-Qallaf": {
    npc: "Nasser Al-Qallaf",
    title: "Training the Shaheen",
    arabic: "تدريب الشاهين",
    desc: "Nasser is training a new falcon — a shaheen — for the winter regional contest. The bird is wild and proud. Nasser has decided you should be his partner.",
    steps: [
      {
        title: "The First Visit",
        desc: "Spend an evening at the camp. Listen to the falcon's habits as Nasser describes them. The bird studies you back.",
        zone: "desert",
        energy: 10,
        rewards: { rep: 2, faction: "tribal", factionAmt: 2 },
      },
      {
        title: "The Dawn Hunt",
        desc: "Help Nasser hunt at dawn. Small game. The bird performs well, but the desert is a teacher with a long memory.",
        zone: "desert",
        energy: 18,
        rewards: { wasta: 3, rep: 3, faction: "tribal", factionAmt: 3 },
      },
      {
        title: "The Disagreement",
        desc: "Nasser disagrees with you about training method. The argument grows. Win a Gahwa Duel — or accept his way and learn from it.",
        zone: "desert",
        energy: 12,
        rewards: { wasta: 4, rep: 3 },
        requiresDuel: "gahwa",
      },
      {
        title: "The Regional Contest",
        desc: "You compete as Nasser's teammate at the regional falconry contest. The bird is ready. So are you.",
        zone: "desert",
        energy: 22,
        rewards: { wasta: 8, rep: 5, money: 400, faction: "tribal", factionAmt: 5 },
        requiresDuel: "falconry",
      },
    ],
    completion:
      "Nasser presents you with a small falcon-feather charm at the camp's last fire of the season. \"A piece of the desert is yours now.\" He places it in your hand. You feel the weight of it.",
    gainsTrait: "loyal",
  },

  "Sheikha Latifa": {
    npc: "Sheikha Latifa",
    title: "The Mentorship Circle",
    arabic: "حلقة الإرشاد",
    desc: "Sheikha Latifa is building a women-led mentorship initiative that will quietly reshape part of the country. She wants respected names attached. She is choosing carefully.",
    steps: [
      {
        title: "Attend the Launch",
        desc: "Show up. Be seen. Speak briefly. Do not steal the room.",
        zone: "city",
        energy: 8,
        rewards: { rep: 4, faction: "government", factionAmt: 3 },
      },
      {
        title: "Bring in Hajja Fatma",
        desc: "The circle needs a religious anchor. Hajja Fatma is the right woman. Convince her — gently — to lend her name.",
        zone: "diwaniya",
        energy: 12,
        rewards: { wasta: 4, rep: 3, faction: "religious", factionAmt: 3 },
      },
      {
        title: "The First Cohort",
        desc: "Help select the first cohort of mentees. The criteria are not academic. They are about who will carry this forward.",
        zone: "city",
        energy: 14,
        rewards: { rep: 5, faction: "government", factionAmt: 4 },
      },
      {
        title: "The Critic",
        desc: "A senior figure in the press is mocking the initiative as 'a hobby project for bored women of means.' Win a Gahwa Duel against him at a private dinner.",
        zone: "city",
        energy: 18,
        rewards: { wasta: 8, rep: 6 },
        requiresDuel: "gahwa",
      },
      {
        title: "The Annual Gathering",
        desc: "One year on. The circle has produced its first results. You are asked to speak.",
        zone: "city",
        energy: 16,
        rewards: { wasta: 10, rep: 10, faction: "government", factionAmt: 6 },
      },
    ],
    completion:
      "Sheikha Latifa places a hand on your shoulder. \"You understand what we're building. That matters more than any title.\" Years later, when she is honored at a state event, your name appears in the program as a founding patron. You did not ask for this. She did it anyway.",
    gainsTrait: "patron",
    unlocksFlag: "patron_status",
  },

  "Mubarak Al-Hawaj": {
    npc: "Mubarak Al-Hawaj",
    title: "The Third Stall",
    arabic: "البسطة الثالثة",
    desc: "Mubarak wants to expand his shop in Souq Mubarakiya into a third stall before Ramadan. The neighbors are skeptical. The current owner of the space is reluctant.",
    steps: [
      {
        title: "Walk the Souq Together",
        desc: "Help him scout locations. He talks more than he walks. You learn things you didn't know.",
        zone: "souq",
        energy: 10,
        rewards: { wasta: 2, money: 100 },
      },
      {
        title: "Negotiate the Lease",
        desc: "The current owner is reluctant. Win a Diwaniya Debate to talk him into reasonable terms.",
        zone: "souq",
        energy: 16,
        rewards: { wasta: 6, money: 300, faction: "merchants", factionAmt: 4 },
        requiresDuel: "debate",
      },
      {
        title: "The Permit",
        desc: "The expansion needs a renovation permit. Speak with Bu Yousef. Be careful — owe him too much, and he'll come collecting.",
        zone: "govzone",
        energy: 12,
        rewards: { wasta: 4, faction: "government", factionAmt: 3 },
      },
      {
        title: "Opening Day",
        desc: "Bring three respectable names with you to the opening. Mubarak will not forget who came and who did not.",
        zone: "souq",
        energy: 14,
        rewards: { wasta: 8, rep: 5, money: 500, faction: "merchants", factionAmt: 5 },
      },
    ],
    completion:
      "The third stall opens to a crowd. Mubarak gives you an embroidered shawl in front of the assembled traders. \"Tell whoever asks: I owe you.\" He repeats it once, slowly, so the men around him hear. The merchant network now sees you as one of theirs.",
    gainsTrait: "trusted",
  },

  "Bu Yousef": {
    npc: "Bu Yousef",
    title: "Reform from Within",
    arabic: "إصلاح هادئ",
    desc: "Bu Yousef wants to modernize his department without making enemies. This is harder than making enemies. The old guard sees reform as criticism. He needs allies who can frame it differently.",
    steps: [
      {
        title: "Shadow Day",
        desc: "Spend a full day inside the Ministry. See where the rot actually is. (Hint: not where the press thinks.)",
        zone: "govzone",
        energy: 14,
        rewards: { rep: 3, faction: "government", factionAmt: 2 },
      },
      {
        title: "Build the Coalition",
        desc: "Recruit Yaqoub and Rashed to the cause. Yaqoub is afraid. Rashed is suspicious. Both can be convinced.",
        zone: "govzone",
        energy: 16,
        rewards: { wasta: 5, faction: "government", factionAmt: 5 },
      },
      {
        title: "The Quiet Memo",
        desc: "Help draft the reform memo. Keep names off it. Frame the reform as continuity with the founding minister's vision.",
        zone: "govzone",
        energy: 12,
        rewards: { wasta: 6, rep: 4 },
      },
      {
        title: "The Hearing",
        desc: "The reform is brought before the senior committee. Defend it. Win a Diwaniya Debate against the most powerful skeptic.",
        zone: "govzone",
        energy: 22,
        rewards: { wasta: 10, rep: 7, money: 500, faction: "government", factionAmt: 8 },
        requiresDuel: "debate",
      },
      {
        title: "Implementation",
        desc: "The reform passes — barely. Now the harder work: making it real. You spend three weeks helping Bu Yousef restructure the team.",
        zone: "govzone",
        energy: 20,
        rewards: { wasta: 8, rep: 8, faction: "government", factionAmt: 5 },
      },
    ],
    completion:
      "Six months later, Bu Yousef hands you a sealed envelope. \"From the minister.\" Inside: a personal thank you, hand-written, on the ministry's old stationery. The kind they don't print anymore. You frame it. You don't show it to anyone.",
    gainsTrait: "trusted",
  },

  "Hajja Fatma": {
    npc: "Hajja Fatma",
    title: "The Friday Class",
    arabic: "درس الجمعة",
    desc: "Hajja Fatma teaches Quran to young girls every Friday at her home. She wants to grow the class but cannot do it alone. The class is more important than she lets on — it is the only space many of these girls have to think.",
    steps: [
      {
        title: "Attend a Session",
        desc: "Sit quietly at the back. Show respect. Do not perform interest — show real interest.",
        zone: "diwaniya",
        energy: 6,
        rewards: { rep: 3, faction: "religious", factionAmt: 3 },
      },
      {
        title: "A Larger Space",
        desc: "Speak with Sheikh Abdullah about a room at the mosque. He is cautious about a women's class on the mosque grounds. Persuade him.",
        zone: "govzone",
        energy: 12,
        rewards: { rep: 4, faction: "religious", factionAmt: 4 },
      },
      {
        title: "The First Big Class",
        desc: "Help on the inaugural day at the new space. Greet every family. Remember faces. They will remember yours.",
        zone: "diwaniya",
        energy: 14,
        rewards: { wasta: 4, rep: 8, faction: "religious", factionAmt: 5 },
      },
      {
        title: "The Mother's Concern",
        desc: "A mother comes to you privately, worried about something her daughter heard in class. Listen. Do not promise. Then quietly look into it.",
        zone: "diwaniya",
        energy: 8,
        rewards: { rep: 6, faction: "religious", factionAmt: 4 },
      },
    ],
    completion:
      "Hajja Fatma blesses you in a way that makes the room go silent. The mothers remember. Your name moves through their networks for years afterward — not as a public figure, but as the kind of man whose advice can be sought when something serious happens. You become, without realizing it, a quiet pillar.",
    gainsTrait: "pious",
  },

  Dalal: {
    npc: "Dalal",
    title: "The Brand Deal",
    arabic: "صفقة الدلال",
    desc: "Dalal is chasing a brand deal that would change her life. She has the followers. She doesn't have the introductions. She has decided you do.",
    steps: [
      {
        title: "Coffee at The Avenues",
        desc: "Listen to her pitch. She is good. She is also asking for something specific — and you must decide if it is a good idea before agreeing.",
        zone: "avenues",
        energy: 8,
        rewards: { rep: 2 },
      },
      {
        title: "The Introduction",
        desc: "Bring her into the same room as Lulwa for the first time. The meeting matters. Your role is to be a bridge, not a feature.",
        zone: "avenues",
        energy: 12,
        rewards: { wasta: 4, money: 200, faction: "merchants", factionAmt: 3 },
      },
      {
        title: "The Public Mockery",
        desc: "A jealous rival posts a video mocking Dalal. It goes viral. Win a public Gahwa Duel against the rival at a high-profile event.",
        zone: "avenues",
        energy: 16,
        rewards: { wasta: 8, rep: 6 },
        requiresDuel: "gahwa",
      },
      {
        title: "The Signing",
        desc: "The deal closes. Dalal posts about you the next week. The video reaches eighty thousand. Your phone doesn't stop ringing for a day.",
        zone: "avenues",
        energy: 8,
        rewards: { wasta: 6, money: 300, rep: 5 },
      },
    ],
    completion:
      "Dalal's career changes. She remembers you in interviews — \"a quiet man who knew the right people, and used them generously.\" That phrase, slightly edited, becomes a brand of its own.",
    gainsTrait: "diplomatic",
  },
};
