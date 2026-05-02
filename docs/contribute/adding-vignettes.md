# Adding Vignettes

Vignettes are **one-shot, hand-written scenes** tied to a zone + time of day. They fire at ~20% probability when the player travels into a matching zone.

They are NOT dilemmas (random ethical choices). They are NOT side quests (multi-step errands). They're **moments**. A two-paragraph cinematic.

---

## File location

`/lib/data/vignettes/index.ts` — append to the `vignettes` array.

---

## What makes a good vignette

A vignette captures a specific texture of Kuwaiti life that:

1. **Tells you something about the city** — not just the player's progress
2. **Has emotional weight** but doesn't demand a huge choice
3. **Lasts 30–60 seconds** of player time
4. **Resonates after the player closes the app**

Examples that work:
- An old woman in the souq who calls the player by their grandfather's name
- A child losing a balloon at the corniche
- A WhatsApp message from a cousin in London on a Friday morning
- The pharmacist who's been there 20 years remembering the player from when they were a kid

Examples that DON'T work:
- "You see a man buying coffee" — no specificity
- "The shopkeeper offers you a discount" — feels like a tutorial
- Anything that requires understanding a complex worldFlag chain — too gated

---

## Anatomy

```typescript
{
  id: "souq_old_woman",          // Stable ID — used to prevent re-firing
  title: "صوت من زمان",          // Arabic title — shown briefly when triggered
  zone: "souq",                  // Required — gate to a specific zone
  timeOfDay: "morning",          // Optional — "morning" | "afternoon" | "evening" | "night" | "fajr"
  dayOfWeek: "friday",           // Optional — "thursday" | "friday" | "saturday" | "any"
  minDay: 14,                    // Optional — only after this many days
  maxDay: 60,                    // Optional — won't trigger after this
  requiresTrait: "loyal",        // Optional — gate by trait
  forbidsTrait: "ruthless",      // Optional — block if player has this trait
  requiresFlag: "p2_silent",     // Optional — gate by flag
  setting: "Arabic setting line",      // Italic line that opens the scene
  text: "Multi-paragraph Arabic narration. Use \\n\\n for paragraph breaks.",
  options: [
    {
      id: "thank_quietly",
      label: "(تومّى براسك بصمت)",
      storyNote: "Brief Arabic summary written into journal.",
      effects: { rep: 3, factions: { merchants: 2 } },
    },
    // ... 2–4 options total
  ],
}
```

---

## Voice rules (same as everywhere)

Read `docs/design/voice-lock.md` first. Quick recap:

- Spoken Kuwaiti only — شلون / شنو / الحين / يبا / لسا
- No literary verbs (يطاردك, يَكتشف)
- Mid-thought entry — start the scene already in motion
- Em-dashes for pauses
- Setting line is italic and short — sets the scene in 8 words or less

---

## Effects sizing

Vignettes are **small moments**. Effects should match:

- `rep` ±1 to ±3
- `wasta` 0 to ±2
- `money` 0 to ±50
- `energy` 0 to -5
- `factions` ±1 to ±3

If you want bigger consequences, that's a dilemma or a chain step, not a vignette.

---

## Worked example

```typescript
// "Pharmacist who remembers"

{
  id: "pharmacy_bangladeshi",
  title: "صيدلي قديم",
  zone: "souq",
  timeOfDay: "morning",
  setting: "صيدلية صغيرة جنب السوق. الصبح.",
  text: `وقفت تسأل عن دوا. الصيدلي كبير في السن، بنغالي، يطالعك من خلف العداد.

«إنت ولد فلان؟» تقول إيه. يومّى براسه ويبتسم. «أبوك كان يجيب الدوا لجدّك من عندي. ٢٥ سنة. كنت طفل صغير معاهم. ما عرفتك أول.»

يحط الدوا في كيس بدون فلوس. «لا تسحبه — ذكرى من زمان زين.»`,
  options: [
    {
      id: "insist_pay",
      label: "«والله ما يصير. خذ.»",
      storyNote: "أصرّيت تدفع للصيدلي. شيء بسيط بس وصل.",
      effects: { money: -10, rep: 2 },
    },
    {
      id: "accept_and_thank",
      label: "(تأخذ الكيس بصمت وتقول 'الله يحفظك')",
      storyNote: "قبلت الذكرى. الصيدلي بتذكرك.",
      effects: { rep: 3, factions: { merchants: 2 } },
    },
  ],
},
```

---

## How vignettes are triggered (engine reference)

Phase 2 work — not yet implemented. The plan:

```typescript
// On TRAVEL event:
function maybeFireVignette(state: GameState) {
  if (Math.random() > 0.20) return;
  const eligible = vignettes.filter((v) => {
    if (state.worldFlags[`vignette_${v.id}_seen`]) return false;
    if (v.zone && v.zone !== state.location) return false;
    if (v.timeOfDay && getTimeOfDay(state.time) !== v.timeOfDay) return false;
    if (v.dayOfWeek && v.dayOfWeek !== "any" && getDayOfWeek(state.day) !== v.dayOfWeek) return false;
    if (v.minDay && state.day < v.minDay) return false;
    if (v.maxDay && state.day > v.maxDay) return false;
    if (v.requiresTrait && !hasTrait(state, v.requiresTrait)) return false;
    if (v.forbidsTrait && hasTrait(state, v.forbidsTrait)) return false;
    if (v.requiresFlag && !hasFlag(state, v.requiresFlag)) return false;
    return true;
  });
  if (eligible.length === 0) return;
  return eligible[Math.floor(Math.random() * eligible.length)];
}
```

---

## Submitting

1. Add to `/lib/data/vignettes/index.ts`
2. `npm run type-check`
3. PR with the vignette + a brief explanation of *why this moment matters* (1–2 sentences)
4. Voice review by Bader required

---

## Vignette ideas to fill out

These are open requests. If you want to pick one up, claim it in Discord:

- [ ] Wedding you weren't invited to — overhear at a coffee shop
- [ ] Driving past your old school — strangers' kids in the playground
- [ ] National Day fireworks alone on the rooftop
- [ ] A stranger tells you "أبوك صلّى يم أبوي اليوم" — your dads prayed together this morning
- [ ] The cleaning lady at your office building remembers you from when you were 10
- [ ] Ramadan iftar at someone you barely know, who insists
- [ ] Eid morning, no one calls — but five hours later, someone unexpected does
- [ ] A child asks you in pure innocence "ليش ما عندك ولد؟"
- [ ] Funeral you attended out of obligation, where you cried for someone else
