# Wasta Kuwait — وَسطة

A Kuwaiti life-sim/RPG. Single-player, mobile-first, deployed as a Next.js PWA.

**Choices have permanent consequences.** The character you become unlocks and locks content as you go.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Zustand for state, persisted to `localStorage`
- No backend — pure client-side
- PWA-installable (manifest + service worker)

## Run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build

```bash
npm run build && npm start
```

## Project layout

```
src/
├── app/               Next.js App Router shell (layout, page, globals)
├── components/        React UI — Avatar, Header, TabBar, Dialog, Toast,
│                      intro flow, the five views, DuelModal, NpcCard
├── data/              Game content — classes, backgrounds, personalities,
│                      zones, subLocations, npcs, duels, dilemmas,
│                      seasonalEvents, scandals, storyQuests, personalChains,
│                      milestones, endings
├── engine/            Logic — store (Zustand), actions, rewards, traits,
│                      duelEngine, eventEngine, progression, npcAppearance
└── lib/               Pure utils — types, avatarSvg, shadeHex, seedHash
```

## What's special

- **21 traits** in 4 mutually-exclusive pairs (ruthless ↔ honorable, loyal ↔ calculating, pious ↔ secular, diplomatic ↔ confrontational) plus earned designations (compromised, hajji, patron, betrayer, married, father, etc.). Gaining one removes its opposite.
- **5-act storyline**, every act branches with choices that grant traits and set world flags that gate downstream content.
- **8 personal NPC questlines** with their own branch points and duel climaxes.
- **40+ random dilemmas** — comedy, anger, shame, risk (probabilistic outcomes), family, romance, crisis, challenge.
- **8 seasonal events** day-triggered (Eid, Ramadan, Hajj, the Audio Leak, …).
- **4 duel types** (Gahwa, Debate, Falconry, Brawl) with stance-vs-stance resolution.
- **11 endings** computed from accumulated character — not just the Act 5 button you pressed.
- **14-layer SVG avatar** — fully customizable for the player, deterministically seeded for NPCs.

## License

Private project.
