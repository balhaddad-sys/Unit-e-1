# Adding Dilemmas

Dilemmas are **ethical micro-choices** that fire after rest (~50% rate). They're how we put moral pressure on the player without making them feel like the game is preaching.

---

## File location

`/lib/data/dilemmas/index.ts` — append to the `dilemmas` array.

---

## What makes a good dilemma

A good dilemma:

1. **Has two real choices.** Not "good" vs "evil" — both options have a cost.
2. **Costs something either way.** Even refusing has a price.
3. **Feels like a real Kuwaiti texture moment.** Not a generic moral test.
4. **Lasts 30 seconds.** Read, decide, move on.

Bad dilemma: "Help the orphan or steal his money?"
Good dilemma: "Your second cousin Faisal calls. He needs 50 KD until Thursday. He has needed 50 KD until Thursday for the past four Thursdays. He is your cousin."

The bad one has an obvious answer. The good one has texture, history, and ambivalence.

---

## Categories

| Category | When it fires | Notes |
|----------|--------------|-------|
| `social` | Always | Everyday Kuwaiti texture |
| `shame` | Always | Public reputation tests |
| `family` | Always | Extended-family obligations |
| `comedy` | Always | Light beats — keep them in rotation |
| `anger` | Always | Confrontation moments |
| `romance` | Day ≥ 20 | Heart-of-the-game moments |
| `crisis` | Day ≥ 30 | High-stakes life events |

---

## Anatomy

```typescript
{
  id: "stable_unique_id",
  tag: "Arabic short tag (3-4 words)",   // Shows above title
  title: "Arabic title (4-6 words)",
  category: "social",
  text: "The full Arabic narration. 2-4 sentences. End in tension.",
  available: (s) => s.day >= 20,         // Optional gate
  accept: {
    label: "اقبل [specific action]",
    wasta: 3, money: -50, rep: 2,
    factions: { merchants: 1 },
    energy: -10,
    flag: "accepted_kickback",            // Optional flag
  },
  refuse: {
    label: "ارفض",
    rep: -2,
  },
}
```

---

## Effects sizing

| Severity | rep | wasta | money | energy |
|----------|-----|-------|-------|--------|
| Light (most) | ±1 to ±3 | 0 to ±2 | 0 to ±50 | 0 to -10 |
| Medium | ±3 to ±5 | ±2 to ±5 | ±50 to ±300 | -10 to -20 |
| Heavy (rare) | ±5 to ±10 | ±5 to ±10 | ±300+ | -20 to -30 |

**Rule of thumb:** comedy dilemmas should be ≤ light. Crisis dilemmas should be ≥ medium.

---

## Voice checklist

Read `docs/design/voice-lock.md`. Then:

- [ ] Use Kuwaiti dialect (شلون / شنو / يبا / لسا / بس)
- [ ] No literary verbs
- [ ] The narration enters mid-action, not setting up
- [ ] Both option labels feel like things a real person would *say*, not announcer-narrate

✅ "خلّه يعدي — ما يستاهل المعركة"
❌ "تجاهل الموقف لتجنب المواجهة"

---

## Worked example — turning an idea into a dilemma

**Idea:** Your senior at work asks you to "fix" his nephew's exam grade through a connection.

```typescript
{
  id: "exam_fix",
  tag: "خدمة ثقيلة",
  title: "ابن أخوي",
  category: "social",
  text: `أبو يوسف يوقفك في الممر. يحط إيده على كتفك. «ابن أخوي تعب في الاختبار. تعرف فلان في وزارة التعليم. كلمة منك تفرق.» يبتسم بطريقة تعرف إنه مستعجب يطلب.`,
  accept: {
    label: "«والله أحاول. ما أوعد.»",
    wasta: 4,
    rep: -3,
    factions: { government: 2, religious: -2 },
    flag: "fixed_grade_for_yousef",
  },
  refuse: {
    label: "«والله يا أبو يوسف، هذا خط ما أعديه.»",
    rep: 4,
    wasta: -2,
    factions: { religious: 3 },
  },
},
```

Why this works:
- Both choices cost something real (lose rep + faction one way; lose wasta + a relationship-debt the other)
- The phrasing of both labels feels like real Kuwaiti speech
- It's specific to a relationship (Bu Yousef) so it has weight
- It encodes the player's actual ethics, not a generic test

---

## Anti-patterns

- **One-sided choices.** If 90% of players will pick the same option, it's not a dilemma — it's a checkbox.
- **Genre confusion.** Don't write a "comedy" dilemma that ends in tragedy. Match the category.
- **Inflation.** Most dilemmas should affect rep ±2-3, not ±10. Save the big ones for crisis category.
- **English thinking.** If your draft reads naturally in English first, it'll feel translated. Write in Kuwaiti from the start.

---

## Dilemma ideas open for adoption

Pick one and write it:

- [ ] You see your old high-school bully at the gym. He's nice now.
- [ ] Your sister's husband pulls you aside at a wedding to ask for "advice."
- [ ] A waiter at your favorite restaurant gets fired for an order you complained about.
- [ ] Your phone autocorrected a friend's name to a slur in a group chat.
- [ ] Someone parks blocking your car. They're sleeping in it. You can see them.
- [ ] A child in a Mall of Kuwait asks you for money. The mother is watching from afar, ashamed.
- [ ] Your father insists you wear his old watch to an important meeting. The watch is broken.
- [ ] A friend's wife confides in you about her marriage during a kid's birthday party.
