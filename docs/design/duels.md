# Design Spec — Duels (Phase 2)

Duels are how the game becomes a *game*. Each duel is a small mini-game with stance choices, real win/lose stakes, and consequences that ripple back into chains.

This doc specifies the **arena UI** that a Phase 2 dev needs to build. Data is already in `/lib/data/duels`.

---

## The four duel types

| ID | Arabic | Rounds | Setting |
|----|--------|--------|---------|
| `gahwa` | نزال الفنجان | 1 | Coffee duel — whoever has the last word |
| `debate` | مجادلة الديوانية | 3 | Public argument in a diwaniya |
| `falconry` | مسابقة الصقّارة | 3 | Falcon-handling competition in the desert |
| `brawl` | عراك | 3 | Physical fight — almost always a bad outcome to be in |

---

## Mechanics — rock-paper-scissors with stat modifiers

Each duel has 3 or 4 **stances**. Stances form a cycle (each beats one and loses to one). When the player picks a stance, the opponent simultaneously picks one. Resolution:

1. If player.beats === opponent.id → player wins round
2. If opponent.beats === player.id → player loses round
3. If tie (same stance) → roll stat bonus + small RNG

The stat bonus comes from `duel.statBonus(state)` which varies by type:
- Gahwa: `floor(rep / 8) + (discreet ? 2 : 0)`
- Debate: `floor(wasta / 10) + (ambitious ? 2 : 0)`
- Falconry: `floor(energy / 15) + (patient ? 3 : 0) + (tribal/10)`
- Brawl: `floor(energy / 12) + (ambitious ? 2 : 0) - 2`

So **a higher-rep player has an edge in gahwa duels, even when stances tie.**

---

## Arena UI spec

The arena is **full-screen, dark, cinematic**. Replaces the normal game shell while a duel is active.

### Layout

```
┌──────────────────────────────────────┐
│  [Top bar: duel name + round pips]   │
├──────────────────────────────────────┤
│  [Stake banner: "قصة أبو خالد:        │
│      كرامتك في الديوانية"]            │
├──────────────────────────────────────┤
│                                      │
│  [Opponent portrait + HP bar]        │
│  [Opponent mood: "يطالعك بثقة"]     │
│                                      │
│           [Combat log — italic]      │
│           [Momentum streak — gold]    │
│                                      │
│  [Player portrait + HP bar]          │
│  [Player mood: "جاهز"]               │
│                                      │
├──────────────────────────────────────┤
│  [Stance picker: 3-4 cards]          │
│  [اختر موقفك]                        │
│  [⚡ ذكاء] [☾ حكمة] [⌒ صبر]          │
└──────────────────────────────────────┘
```

### Visual states

**Round start:**
- Combat log: "أبو خالد ينتظر — اختر موقفك"
- Stance cards in idle state

**Stance selected (committed):**
- Picked card pulses with gold border
- Other cards fade to 40% opacity
- 350ms before resolution animates

**Resolution playing:**
- Combat log updates: "الذكاء يقطع الحكمة." (or equivalent)
- Combat log flashes (scale 1.08 + gold tint, 500ms)
- ~400ms later: portrait animation
  - Winner: portrait `hit` animation — scale 1.2, rotate -8°, brightness 1.5, gold drop-shadow
  - Loser: portrait `recoil` animation — translate +8px, rotate +8°, brightness 0.6
- Damage number floats up from hit portrait (28px, gold). Crit (during streak ≥ 2): 36px, red, "✦" prefix.
- HP bar drains with 500ms cubic-bezier transition
- Mood text updates

**Streak (player wins ≥ 2 in a row):**
- Above combat log, show "سلسلة × 2" in gold uppercase
- Next hit deals 1.5x damage and is a crit

**End-of-duel result overlay:**
- Backdrop blur over arena
- Banner: "ربحت" (green, glow), "خسرت" (red, glow), "تعادل" (gold)
- Narration text from `duel.winText/loseText/drawText`
- Reward chips
- "تابع" button bottom

---

## Damage values

- Base: 30 + random(0..12) per won round
- Crit (during streak ≥ 2): × 1.5
- Both combatants start at 100 HP
- Duel ends when:
  - One side hits 0 HP (KO) — that's a definitive win/lose
  - All rounds played — decided by remaining HP, draw if equal

---

## Opponent AI

The opponent is **smarter as the player gets stronger**. Strength formula:

```typescript
oppStrength = min(0.7, 0.3 + (state.day / 200) + (state.stats.rep / 200))
```

When `oppStrength` is high, the opponent picks the *counter* to whatever the player picked (this requires the engine to have already revealed player's choice — handled by stance commitment delay).

When low, opponent picks randomly.

Story-driven duels can override the default opponent strength via `opts.oppStrength`.

---

## Stake context

When a duel is launched as part of a chain step, the **stake banner** shows the chain context:

```typescript
openDuel("gahwa", onWin, onLose, {
  opponent: ["Critic", "Influencer", "diwaniya", 50, "merchants", "ع"],
  chainContext: "صفقة دلال",
  stakeText: "كرامة دلال أمام المنافس"
})
```

The stake banner is the **whole reason the player feels something**. Without it, every duel feels generic.

---

## Hook into ripples

When a duel ends, call `triggerDuelRipples(duel)` (see `docs/design/ripples.md`). This is what makes winning a Gahwa duel cascade into Bu Khalid's relationship and the merchant faction.

---

## Animation notes

Use **Framer Motion** for the overall arena enter/exit and result overlay. Use **CSS keyframes** for portrait hit/recoil — they're simpler and don't need orchestration.

Damage floats: spawn a div with absolute positioning at the portrait's coordinates, animate via CSS keyframe (1s float up + fade), remove on animation end.

---

## What to build first (recommended order)

1. **Layout** — empty arena with opponent + player + stance picker, no animation
2. **Stance commitment** — clicking a card highlights it, others fade
3. **Resolution logic** — wire the existing rock-paper-scissors logic, update HP without animation
4. **HP bar drain** — add the cubic-bezier transition
5. **Portrait animations** — hit/recoil keyframes
6. **Damage floats** — spawn + animate + remove
7. **Streak / crit indicator** — momentum text + crit damage
8. **Result overlay** — banner + narration + rewards
9. **Stake banner** — chain context
10. **Polish** — sound effects (gahwa pour, falcon screech, slap)

---

## Done = looks like a phone game, not a text adventure

The success metric: when a Phase 1 player who has only seen text dialogs sees their first Arena, they say "wait, this is actually a game."
