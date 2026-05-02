# Adding a Personal Chain

Personal chains are the spine of the game. Each named NPC has one. They unlock when the player's relationship with that NPC reaches 70+.

This guide walks through adding one.

---

## File location

`/lib/data/chains/index.ts` — append to the `personalChains` object, keyed by the NPC's English ID.

---

## The 3-beat structure (recommended)

Every chain that ships should follow the **Trauma → Struggle → Mastery** arc:

1. **Trauma** — The wound is revealed. Something the NPC has carried alone, often for years. Player witnesses or learns of it.
2. **Struggle** — A test. Where losing might be more meaningful than winning. The player chooses what kind of partner they're going to be.
3. **Mastery** — Visible change. The NPC, the player, and the world are different now.

Bu Khalid's chain (`/lib/data/chains/index.ts`) is the cleanest reference.

---

## Minimum required fields

```typescript
{
  npc: "Their English ID",         // Must match an entry in /lib/data/npcs.ts
  title: "آخر صفقة",                // Arabic chain title
  desc: "Short Arabic description that hints at the underlying wound, not just the surface task.",
  steps: [
    {
      title: "Arabic step title",
      desc: "What to do this step. Set the emotional stakes.",
      zone: "city",                 // Where it must be done
      energy: 8,                    // Cost
      rewards: { wasta: 2, rep: 1 }, // Mostly modest — final step gets bigger
    },
    // ... typically 3 steps for a full arc
  ],
  completion: "The closing line — usually the NPC saying or doing something that lands the emotional resolution.",
}
```

---

## Voice checklist

Before submitting, every line must pass:

- [ ] No `إنت رجال...` opener
- [ ] Uses شلون / شنو / الحين / يبا / لسا / بس where natural
- [ ] No literary verbs (يطاردك, إنّ, قد, يَتدرَّج)
- [ ] Reads like spoken Kuwaiti, not novel-Arabic
- [ ] Reviewed against `docs/design/voice-lock.md`

---

## Optional fields

### `requiresDuel`

If the climactic step should require winning a duel:

```typescript
{
  title: "عشاء الإقفال",
  desc: "...",
  zone: "diwaniya",
  energy: 18,
  rewards: { wasta: 12, money: 600, rep: 5 },
  requiresDuel: "gahwa",  // or "debate" / "falconry" / "brawl"
}
```

The player can't complete the step until they've won this duel type elsewhere — ideally against an NPC tied to this chain.

### `unlockAt`

Default unlock threshold is 70. Override only if the NPC is unusual:

```typescript
unlockAt: 50,  // Easier — for early-game tutorial NPCs
unlockAt: 85,  // Harder — for distant/proud characters
```

---

## Step zones

Spread steps across zones so the player has to travel:

✅ Step 1 in `city`, Step 2 in `souq`, Step 3 in `diwaniya`
❌ All 3 steps in the same zone (player just clicks 3 times)

---

## Reward economics

| Step | Wasta | Money (د.ك) | Rep |
|------|-------|--------------|-----|
| 1 (Trauma reveal) | 2 | 0–150 | 1–3 |
| 2 (Struggle test) | 3–6 | 150–400 | 2–4 |
| 3 (Mastery / climax, often with duel) | 8–14 | 400–800 | 4–8 |

Add a **faction reward** to the climax step if the chain pulls the player toward a specific faction:

```typescript
rewards: { wasta: 12, money: 600, rep: 5, faction: "merchants", factionAmt: 6 }
```

---

## Worked example — adding "Talal's Falcon"

```typescript
// In /lib/data/chains/index.ts

"Talal": {
  npc: "Talal",
  title: "الصقر الجديد",
  desc: "طلال يدرب صقر صغير. بس الصقر مو الموضوع — الموضوع إنه ما حد علمه إنه يستاهل اسمه.",
  steps: [
    {
      title: "زيارة المدرّب",
      desc: "اقعد مع طلال في المخيم. اسمع شنو يبي. (الموضوع أكبر من الصقر.)",
      zone: "desert",
      energy: 8,
      rewards: { rep: 2, faction: "tribal", factionAmt: 2 },
    },
    {
      title: "الاختبار",
      desc: "صقّار مغرور يحكم على طلال. واجهه نيابة عنه.",
      zone: "desert",
      energy: 16,
      rewards: { wasta: 4, rep: 4, faction: "tribal", factionAmt: 3 },
      requiresDuel: "debate",
    },
    {
      title: "اليوم الكبير",
      desc: "احضر مسابقة طلال الأولى. اربح كزميله.",
      zone: "desert",
      energy: 22,
      rewards: { wasta: 10, money: 500, rep: 6, faction: "tribal", factionAmt: 5 },
      requiresDuel: "falconry",
    },
  ],
  completion:
    "طلال يعطيك ريشة من الصقر. ما يقول شي طويل، بس عيونه تقول كل شي. «صار اسمي معروف الحين. واسمك معاه.»",
},
```

---

## Submitting

1. Add your chain to `/lib/data/chains/index.ts`
2. Run `npm run type-check` — TypeScript will catch any missing fields
3. Run `npm run lint`
4. Test it manually: in dev mode, set the relationship to 70+ via console (`useGameStore.getState().dispatch({ type: 'REL_DELTA', npc: 'Talal', amount: 100 })`) and walk through your chain
5. PR with the chain + a screen recording of you playing through it

Voice review by Bader is required before merge.
