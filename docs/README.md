<div align="center">

# Wasta · واسطة

**A Kuwaiti life-sim RPG where wasta is power — and power costs something.**

You return to Kuwait after seven years away. Your father's oldest friend doesn't recognize you at the airport. Your father, without looking at you, says: *"I wish you'd seen your uncle Saad before he died."* On the corniche the next morning, three women walk past, and one asks her friend: *"Is that Bu Fulan's son?"* — *Ibn man.* Son of who.

The wound is the question. Build a name. Choose what to betray for what.

[Concept](#concept) · [Architecture](#architecture) · [Contributing](#contributing) · [Roadmap](#roadmap) · [Voice & Style](#voice--style)

</div>

---

## Status

**Phase 1 (current)** — Foundation + vertical slice. Production-grade architecture, prologue → tutorial → Act 1 opening → meet Umm Nasser → first chain step. Other content scaffolded.

This is a **multi-week build** intended to ship as a real product (Vercel → eventually App Store). The codebase is structured for collaborators (designers, devs, content writers) to work in parallel.

---

## Concept

### The five emotional acts

The game is structured as a 5-act emotional arc, not a structural one. Each act asks one question.

| Act | Title | Question |
|-----|-------|----------|
| 1 | الوحدة (Loneliness) | Why am I doing this? For whom? |
| 2 | الاعتراف (Validation) | What am I willing to owe? |
| 3 | الانقسام (Identity Crisis) | Who am I when no one is watching? |
| 4 | الحِمل (Burden) | Can I carry this without becoming the thing I swore I wouldn't? |
| 5 | الحساب (Reckoning) | Was any of this worth it? |

### The mechanics

- **Wasta** — the influence currency. Earned through favors, lost through betrayal.
- **Reputation** — public-facing, can go negative.
- **Faction standing** — tribal / merchants / government / religious. Most paths require you to choose.
- **Relationships** — 0–100 with each named NPC. At 70+, their personal questline unlocks. These are the spine.
- **Traits** — accumulated through choices, mutually exclusive on opposing axes. Honorable ↔ Ruthless, Loyal ↔ Calculating, etc. NPCs react based on these.
- **Reflections** — every 7 days, a quiet beat fires. The game shows you what you've become in one line of Arabic. This is the engagement engine.

### The voice

Voice is **locked Kuwaiti dialect** — informal, spoken, real. See [`docs/design/voice-lock.md`](./docs/design/voice-lock.md). When in doubt, ask Bader.

---

## Architecture

```
wasta-v2/
├─ app/                      Next.js 15 App Router
│  ├─ page.tsx               Landing — title screen, save check
│  ├─ new/                   Character creation flow
│  └─ play/                  Game shell (sticky header + tab bar)
│     ├─ layout.tsx          GoalBar + StatsBar + RewardStack + LevelUpBanner
│     ├─ page.tsx            Home view — current place + active story
│     ├─ places/             Travel
│     ├─ people/             Meet/help NPCs
│     ├─ quests/             Story / chains / side quests
│     ├─ you/                Character sheet
│     └─ prologue/           3-scene wound-establishing opener
│
├─ components/
│  ├─ ui/                    Reusable primitives (GoalBar, StatsBar, TabBar, etc.)
│  └─ game/                  Game-specific (PrologueScene, ActTransition, Tutorial)
│
├─ lib/
│  ├─ types/                 Single source of truth for all data shapes
│  │  ├─ game.ts             GameState, GameEvent, Character, etc.
│  │  └─ content.ts          PrologueScene, Act, NPC, Chain, Quest, etc.
│  │
│  ├─ engine/                Pure functions — never touch the DOM
│  │  ├─ initialState.ts     createInitialState(character) → GameState
│  │  ├─ reducer.ts          (state, event) → state — the only mutator
│  │  ├─ goalCompute.ts      "What should the player do next?" — heart of UX
│  │  └─ persistence.ts      localStorage save/load with schema versioning
│  │
│  ├─ data/                  All static content (acts, NPCs, prologue, ...)
│  │  ├─ zones.ts
│  │  ├─ npcs.ts
│  │  ├─ prologue/
│  │  ├─ acts/
│  │  ├─ chains/
│  │  ├─ quests/
│  │  ├─ dilemmas/
│  │  ├─ reflections/
│  │  ├─ vignettes/
│  │  └─ duels/
│  │
│  └─ store.ts               Zustand store wrapping reducer + persistence
│
├─ styles/globals.css        Tailwind + RTL + animation keyframes
└─ docs/                     Design specs + contributor guides
```

### State flow

```
User action
   ↓
Component dispatches GameEvent
   ↓
Zustand store (lib/store.ts)
   ↓
Reducer (lib/engine/reducer.ts) — pure, exhaustive
   ↓
New GameState
   ↓
Auto-save to localStorage
   ↓
React re-renders subscribed components
   ↓
Goal bar recomputes via computeNextGoal()
```

### Why this architecture

1. **Pure reducer** = predictable. Easy to test. No race conditions.
2. **Discriminated union events** = TypeScript catches every missing case.
3. **Data separated from logic** = content authors edit `/lib/data/*` without touching the engine.
4. **Zustand over Context** = fewer re-renders, simpler selectors, no provider hell.
5. **Schema versioning on saves** = we can change `GameState` shape later without breaking saved games.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm or pnpm

### Run locally

```bash
git clone <repo>
cd wasta-v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Type checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Format

```bash
npm run format
```

---

## Deploying

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

That's it. No env vars needed for v1 (game is fully client-side).

### Production build

```bash
npm run build
npm run start
```

---

## Contributing

This is a long-term, multi-contributor build. Designers, writers, and devs work in different files — the architecture keeps you from stepping on each other.

### For content writers

You don't need to touch any TypeScript logic. All content lives in `/lib/data/`. Each folder has a README explaining its shape.

- **Acts** — see [`docs/contribute/adding-acts.md`](./docs/contribute/adding-acts.md)
- **Personal chains** — see [`docs/contribute/adding-chains.md`](./docs/contribute/adding-chains.md)
- **Vignettes** — see [`docs/contribute/adding-vignettes.md`](./docs/contribute/adding-vignettes.md)
- **Dilemmas** — see [`docs/contribute/adding-dilemmas.md`](./docs/contribute/adding-dilemmas.md)

**Voice lock:** All Arabic must follow [`docs/design/voice-lock.md`](./docs/design/voice-lock.md). When in doubt, write less formal not more.

### For designers

The visual system is defined in `tailwind.config.ts` (palette + fonts). Component styles live in `/components/ui` and `/components/game`. The shell layout is in `/app/play/layout.tsx`.

Design philosophy: warm cream surfaces, single emerald accent, gold for milestones. Inspired by Apple system apps, Things 3, Linear.

### For devs

- Add new event types to `GameEvent` in `lib/types/game.ts`
- Add the corresponding case to `reducer.ts` (the exhaustive `never` check will yell at you if you miss it)
- Update affected components

**Don't:**
- Mutate state outside the reducer
- Put random/Date.now/I/O in the reducer
- Hardcode Arabic strings in components when they belong in `/lib/data`

---

## Roadmap

### Phase 1 — Foundation (this drop) ✓
- [x] Type system, reducer, persistence, store
- [x] Prologue (3 scenes, locked voice)
- [x] Act 1 fully fleshed (intro variants, branches, closings)
- [x] Acts 2–5 scaffolded
- [x] Goal bar, reward popups, level-up banner, notification feed
- [x] Tutorial overlay
- [x] Character creation flow
- [x] Home / Places / People / Quests / You views
- [x] Umm Nasser personal chain (the vertical slice anchor)
- [x] Bu Khalid + Sheikh Abdullah chains
- [x] All 5 story quests wired
- [x] 12 dilemmas in locked Arabic
- [x] 20+ reflections in locked voice
- [x] All 4 duel types defined (data only — UI comes Phase 2)
- [x] 4 vignettes

### Phase 2 — Make it sing
- [ ] **Duel arena UI** — full-screen with HP bars, animated stances, momentum streaks. Spec in `docs/design/duels.md` (TODO).
- [ ] **Ripple system** — cause/effect web. Helping Mubarak in souq advances Bu Khalid's chain. Spec in `docs/design/ripples.md` (TODO).
- [ ] **Dilemma & vignette engine** — random firing on rest/travel.
- [ ] **Reflection engine** — weekly trigger on rest.
- [ ] **Side quest generator** — procedural errands tied to zones.
- [ ] Ports remaining 7 chains in locked voice.
- [ ] 30+ more dilemmas.
- [ ] 12 vignettes total.

### Phase 3 — Endings + polish
- [ ] **11 endings** — based on traits, faction standings, choices made
- [ ] **NPC reaction profiles** — 16 NPCs with full reaction tables
- [ ] **Animations** — Framer Motion transitions throughout
- [ ] **Sound** — minimal, ambient (gahwa pour, diwaniya murmur, fajr azan)
- [ ] **Audio narration** of key scenes (Kuwaiti VO)

### Phase 4 — Ship
- [ ] PWA wrapper (installable on iOS/Android)
- [ ] Native shell (Capacitor) for App Store
- [ ] Cloud saves (optional, opt-in)
- [ ] Analytics (privacy-respecting)
- [ ] Localization English fallback layer

---

## Voice & Style

This is a **Kuwaiti** game. The protagonist, the NPCs, the narration — all speak Kuwaiti, not formal Arabic.

### Words we use

شلون · شنو · الحين · يبا · لسا · بس · يم · وايد · صراحة · يعني · والله

### Words we don't

يطاردك · الذي · إنّ · قد · يتدرّج · يَنتهي · يَكتشف

### The opener trap

Never use the formula **«إنت رجال...»** — it's preachy. Use first-person where natural: «صرت أفهم...» / «حسيت إن...» / «ما توقعت إنه...»

### When in doubt

Less formal, not more. The narrator is reflecting in the player's head, not lecturing them.

Full guide: [`docs/design/voice-lock.md`](./docs/design/voice-lock.md).

---

## Credits

Built by **Bader Al-Haddad** — physician, builder, Kuwaiti — with Claude as collaborator.

This game is a love letter to a city, a question, and a generation that left and came back.

---

## License

UNLICENSED — proprietary. All rights reserved. Contact Bader for commercial collaboration.
