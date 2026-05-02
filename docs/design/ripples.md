# Design Spec — Ripple System (Phase 2)

The ripple system is the **glue that makes side actions feel like they're part of the story**. Without it, the game feels like disconnected tabs. With it, every action in the souq advances something in the diwaniya.

---

## The problem ripples solve

In Phase 1, the player does something — say, helps Mubarak in the souq — and gets stat rewards. The end. Side actions feel disconnected from story. The player thinks: *"why am I bothering with these?"*

With ripples: the same action **also** boosts Bu Khalid's relationship by 5 (because Mubarak mentions you favorably to him), sets a `mubarak_introduced` flag (which Bu Khalid's chain Step 1 reads — he opens the conversation differently), and **fires a toast**: *"السوق يتكلم: مبارك مدحك قدام أبو خالد. صار في كلمة طيبة بينكم قبل ما تتقابلون."*

Now the player thinks: *"oh — this game has a memory."*

---

## Architecture

### Where ripples live

`/lib/engine/ripples.ts` (Phase 2 — to be created).

### The registry pattern

```typescript
// Each ripple is a function: (state) => RippleResult | null
type RippleResult = {
  label: string;       // Toast eyebrow
  text: string;        // Toast body
  icon: string;        // ↻ ✦ ♟ ⊞ etc
  effects: GameEvent[]; // What changes in state
};

const ripples: Record<string, (s: GameState) => RippleResult | null> = {
  duelWon_gahwa: (s) => {
    const bk = s.relationships["Bu Khalid"] ?? 0;
    if (bk >= 30 && bk < 70) {
      return {
        label: "صدى الديوانية",
        text: "أبو خالد سمع عن قعدتك. اسمك صار يدور بين التجار.",
        icon: "♟",
        effects: [{ type: "REL_DELTA", npc: "Bu Khalid", amount: 5 }],
      };
    }
    return null;
  },
  // ... more
};

export function triggerRipple(key: string, state: GameState): RippleResult | null {
  const fn = ripples[key];
  if (!fn) return null;
  return fn(state);
}
```

### Where ripples fire

After the action completes:

```typescript
// In components/game/Arena.tsx, on duel end:
const ripple = triggerRipple(`duelWon_${duel.typeId}`, state);
if (ripple) {
  ripple.effects.forEach(dispatch);
  showRippleToast(ripple.label, ripple.text, ripple.icon);
  pushNotif(ripple.icon, ripple.text, "milestone");
}
```

---

## Initial ripple registry (port from Phase 1 HTML)

### Duels

| Trigger | Condition | Effect | Toast |
|---------|-----------|--------|-------|
| Win Gahwa | Bu Khalid rel 30-69 | rel +5 | صدى الديوانية: أبو خالد سمع عن قعدتك |
| Win Gahwa | Bu Khalid rel ≥70, chain unlocked | flag `khalidRespect++` | أبو خالد لاحظ |
| Win Debate | Bu Yousef rel 20-69 | rel +4, govt +2 | وصلت للوزارة |
| Win Falconry | (always) | tribal +4 | البر يحفظ اسمك |
| Lose any duel | location is diwaniya | tribal -2 | السمعة تتأثر |

### Helping NPCs

| Trigger | Condition | Effect | Toast |
|---------|-----------|--------|-------|
| Help Mubarak | Bu Khalid chain active | flag `mubarakIntroduced` | السوق يتكلم: مبارك مدحك قدام أبو خالد |
| Help Hajja Fatma | Sheikh Abdullah rel < 70 | rel +3 with Sheikh | المسجد يتذكر |
| Help Dalal | Sheikha Latifa rel < 70 | rel +2, merchants +2 | الصدى الإعلامي |
| Help Yaqoub | govt < 30 | govt +5 | الكاتب يحفظ |

### Faction thresholds (one-time)

| Trigger | Effect | Toast |
|---------|--------|-------|
| Tribal hits 30 first time | (none — pure flavor) | صرت من البر: ناصر بيدعيك للمسابقة الكبيرة قريب |
| Merchants hits 30 | (none) | السوق يعرفك |
| Government hits 30 | (none) | الوزارة فتحت لك بابها |
| Religious hits 30 | (none) | المسجد بيتك |

---

## Design rules for new ripples

### 1. Ripples should have *narrative* texture, not just stat changes

❌ *"+5 rep"*
✅ *"مبارك مدحك قدام أبو خالد"*

The number behind the curtain matters less than the story we tell about it.

### 2. Ripples should have a *radius*

A small action shouldn't ripple to 10 NPCs. Pick 1-2 plausible recipients.

❌ Helping Mubarak → +rel with all 4 tribal NPCs
✅ Helping Mubarak → +rel with Bu Khalid only (because they're business adjacent)

### 3. Ripples should fire **at the right moment**

Some ripples should fire immediately. Others should fire when the player next walks into a relevant zone.

```typescript
// Immediate
{ type: "REL_DELTA", npc: "Bu Khalid", amount: 5 }

// Deferred to next zone visit (Phase 2 enhancement):
{ type: "DEFER_RIPPLE", trigger: "enter_city", payload: {...} }
```

### 4. Ripples should *cap*

If the player keeps winning Gahwa duels, Bu Khalid shouldn't keep gaining +5 rel. Cap at the threshold of the next gate (e.g., max 70 for unlock-driven boosts).

### 5. Ripples should *unlock content*, not just numbers

The most exciting ripples make a chain step play out differently:

```typescript
// In Bu Khalid's chain step 1:
const introVariant = state.worldFlags.mubarakIntroduced
  ? "أبو خالد يستقبلك مبتسماً. 'مبارك كلمني عنك. قلت زين الولد.'"
  : "أبو خالد يطالعك من فوق نظارته. 'أنت ولد فلان؟ تعال خل أشوفك.'";
```

That's where the player feels the game watching them.

---

## What to build (Phase 2)

1. **Ripple registry** — port the table above into `/lib/engine/ripples.ts`
2. **Toast component** — gradient green toast at bottom-center, 4.5s display, Arabic, with icon + label + body. CSS already in Phase 1 v1 prototype, port it.
3. **Hook into actions** — after `helpThem`, `endDuel`, `checkFactionMilestone`, etc., call `triggerRipple` with the appropriate key
4. **Chain content variants** — author at least 3 chain steps that read ripple flags and play differently
5. **Notification log entries** — every ripple should also push to `notifications` so the player can scroll back

---

## Anti-patterns

- **Numeric inflation** — don't make every ripple +10 rel. Most should be subtle (+2 to +5).
- **Toast spam** — if 3 ripples fire from one action, queue them, don't stack.
- **Hidden ripples** — every ripple must have a visible toast, OR a clearly-readable chain-content change. Invisible ripples feel like bugs.
- **Generic copy** — *"good things happened"* is not a ripple. Specific phrasing about who said what to whom.

---

## Done = the player says "wait, did the game just remember that?"

That's the success metric. When a player helps Mubarak in the souq, walks to the city, opens Bu Khalid's chain, and sees a different opening line — that's when ripples are working.
