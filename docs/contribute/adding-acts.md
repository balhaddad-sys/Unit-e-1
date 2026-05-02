# Adding / Fleshing Out an Act

Acts are the emotional spine. Each one asks **one** question. Player choices answer it through actions (which we read via `worldFlags` and `traits`), and the act *closes* with a branch that crystallizes their answer.

---

## File location

`/lib/data/acts/index.ts` — edit the existing entries (Acts 2–5 are scaffolded).

---

## The 5-Act emotional arc

| # | Title | Question | Status |
|---|-------|----------|--------|
| 1 | الوحدة (Loneliness) | Why am I doing this? For whom? | ✓ Production |
| 2 | الاعتراف (Validation) | What am I willing to owe? | ◔ Scaffold |
| 3 | الانقسام (Identity Crisis) | Who am I when no one is watching? | ◔ Scaffold |
| 4 | الحِمل (Burden) | Can I carry this without becoming the thing I swore I wouldn't? | ◔ Scaffold |
| 5 | الحساب (Reckoning) | Was any of this worth it? | ◔ Scaffold |

---

## Anatomy of an act

```typescript
{
  id: "act2_validation",
  n: 2,
  titleEmotional: "الاعتراف",         // The feeling
  titleStructural: "الصاعد",          // The role/position
  introDefault: "...",                // Default intro narration
  introVariants: [...],               // 0–4 variants tied to flags/traits
  centralQuestion: "...",             // The one question this act asks
  quietBeat: { title: "...", text: "..." },  // Optional one-shot scene
  exitCond: (s) => boolean,           // When this act ends
  branches: {
    key: "act2_path",                 // Saved into worldFlags
    prompt: "...",                    // Question shown at branch time
    options: [...],                   // 2–6 ways to answer
  },
  closingDefault: "...",              // Default closing narration
  closingVariants: [...],             // Variants tied to which branch chosen
}
```

---

## The intro (and its variants)

The default intro is what plays if no variant matches. Then `introVariants` override it when their `check` predicate passes.

Order matters — the **first matching variant wins**. Most-specific checks should come first.

### Example

```typescript
introVariants: [
  // Most specific — branch from a previous act
  {
    check: (s) => hasFlag(s, "act1_by_force"),
    text: "بدأت الفصل الجديد وأبوي ما زال صامت من اليوم اللي قال لي فيه...",
  },
  // Trait-based
  {
    check: (s) => hasTrait(s, "ruthless"),
    text: "الناس بدوا يخافون قبل ما يحبون. هذا اللي اخترته بدون ما أنوي.",
  },
  // Flag from an earlier act
  {
    check: (s) => hasFlag(s, "act1_by_silence"),
    text: "لاحظت إن الديوانية صارت تسكت لما أدخل. مو لأني فرضت السكوت — لأني مثّلت السكوت.",
  },
],
```

---

## The exit condition

This is the predicate that closes the act. When it returns `true`, the branch dialog appears.

Tune for **player time, not stat thresholds alone**. A typical session is 15–30 minutes; an act should take 2–4 sessions.

### Reference values per act

| Act | Suggested exit | Roughly |
|-----|---------------|---------|
| 1 | `relationships ≥ 70 count >= 2 && questsDone >= 2` | 2–3 sessions |
| 2 | `questsDone >= 6 && wasta >= 25` | 3–4 sessions |
| 3 | `questsDone >= 12 && wasta >= 50 && rep >= 30` | 4–5 sessions |
| 4 | `questsDone >= 20 && wasta >= 90 && 2+ factions ≥ 30` | 5–7 sessions |
| 5 | (endgame branch — usually `false` and triggered manually) | 1 session |

---

## Branches

The branch is the **moment the act crystallizes**. Player makes a choice that defines who they are this season.

### Required: 4 base options

These should be available to all players:

```typescript
options: [
  { id: "by_service", label: "بالخدمة — ساعدت اللي احتاج لي", gainsTrait: "honorable", worldFlag: "act2_giver" },
  { id: "by_charm",   label: "باللباقة — ضحّكتهم وريّحتهم", gainsTrait: "diplomatic", worldFlag: "act2_charm" },
  { id: "by_force",   label: "بالقوة — ما خليتهم يتجاوزوني", gainsTrait: "confrontational", worldFlag: "act2_force" },
  { id: "by_family",  label: "باسم أبوي", gainsTrait: "loyal", worldFlag: "act2_family" },
],
```

### Optional: 1–2 personalized options

These are gated by what the player did before. They reward attentive play.

```typescript
{
  id: "by_silence",
  label: "بالسكوت — لاحظت الكل ولاحظوني بدون ما أقول شي",
  requiresTrait: "calculating",       // Hidden unless player has this trait
  gainsTrait: "calculating",
  worldFlag: "act2_by_silence",
},
{
  id: "by_father_legacy",
  label: "ما عرفوني — عرفوا أبوي فيّ، وأنا قبلت هذا",
  requiresFlag: "p2_silent",          // Hidden unless flag set
  gainsTrait: "loyal",
  worldFlag: "act2_father_through_me",
},
```

---

## Closing variants

Tied to which branch was chosen. Lets the closing narration acknowledge **what the player just did**.

```typescript
closingVariants: [
  {
    check: (s) => hasFlag(s, "act2_force"),
    text: "خلص الموسم. الناس تعرفني — بس بطريقة ما توقعتها. أبوي قال بصوت خفيف: 'الرجال اللي يفرض احترامه يحتاج عمر يثبته.'",
  },
],
```

---

## Voice checklist

Same as everything else:
- [ ] No `إنت رجال...` opener
- [ ] Spoken Kuwaiti — شلون / شنو / الحين / يبا / لسا / بس
- [ ] No literary verbs
- [ ] Em-dashes for pauses
- [ ] Mid-thought entries — start scenes already in motion

See `docs/design/voice-lock.md` for the full rulebook.

---

## Worked example — turning the Act 2 scaffold into production

The scaffold:

```typescript
{
  id: "act2_validation",
  n: 2,
  titleEmotional: "الاعتراف",
  titleStructural: "الصاعد",
  introDefault: "الباب فتح. مو على مصراعيه...",
  introVariants: [],              // ← TODO
  centralQuestion: "شنو اللي راح تَدين فيه؟",
  exitCond: (s) => s.questsDone >= 6 && s.stats.wasta >= 25,
  branches: { ... },
  closingDefault: "...",
  closingVariants: [],            // ← TODO
}
```

### Step 1 — Add intro variants

```typescript
introVariants: [
  {
    check: (s) => hasFlag(s, "act1_by_force"),
    text: `الباب ما فتح بسهولة. كل دعوة جت معاها صمت قبلها — كأنهم يحسبون قبل ما يدعونني.

اللي بنيته بالقوة، صار يحتاج صبر عشان يطعّم بالاحترام. وأنا — صادفت لأول مرة إن الواسطة مو لعبة قوة. هي لعبة ذكاء.`,
  },
  {
    check: (s) => hasFlag(s, "act1_by_silence"),
    text: `الباب فتح بطريقة مختلفة عما توقعت. الناس صاروا يبحثون عني، مو العكس. السكوت اللي تعلمته في الفصل الأول صار يثقل في الغرفة.

بس السؤال الجديد: لما يسمعون قبل ما تتكلم، شنو راح تقول؟`,
  },
],
```

### Step 2 — Add closing variants

```typescript
closingVariants: [
  {
    check: (s) => hasFlag(s, "act2_giver"),
    text: `خلص الفصل الثاني. تركت إيدي مفتوحة طول هالأسابيع. كل واحد ساعدته صار يعرف اسمي — بس بدا اللي يعرف اسمي وايد. صرت أحس إن في حدود ما خططت لها.`,
  },
  {
    check: (s) => hasFlag(s, "act2_selective"),
    text: `خلص الفصل الثاني. اخترت بعناية. الناس اللي ساعدتهم قليلين، بس كل واحد منهم صار حليف حقيقي. وأنا — تعلمت إن الرفض بأدب يبني سمعة أحسن من القبول العشوائي.`,
  },
],
```

### Step 3 — PR + voice review

Submit a PR. Bader reviews. Iterate until "Good" lands.

---

## Anti-patterns to avoid

- **Generic intros that don't reference Act 1.** Every intro should feel like the player's specific season-one path led here.
- **All branches feel the same in tone.** "Force" should *feel* different on the page from "service" — different vocabulary, rhythm, length.
- **Closings that reset.** The closing should change *next act's intro*. That's why we have `worldFlags` and `gainsTrait`.
- **Padded prose.** If you can cut a sentence, cut it. Spoken Kuwaiti is dense.
