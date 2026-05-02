"use client";

import { useGame } from "@/engine/store";
import { rest } from "@/engine/actions";
import { currentAct, activeStoryQuest, ensureStoryQuestEntry } from "@/engine/progression";
import { getZone } from "@/data/zones";
import { useState } from "react";
import DilemmaModal from "@/components/dilemma/DilemmaModal";
import EventModal from "@/components/dilemma/EventModal";
import StoryQuestPanel from "@/components/story/StoryQuestPanel";
import { dueSeasonalEvent, dueScandal, pickDilemma } from "@/engine/eventEngine";
import type { Dilemma, ScandalEvent, SeasonalEvent } from "@/lib/types";

export default function HomeView() {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);
  const pushToast = useGame((s) => s.pushToast);

  const [activeDilemma, setActiveDilemma] = useState<Dilemma | null>(null);
  const [activeEvent, setActiveEvent] = useState<SeasonalEvent | ScandalEvent | null>(null);

  const zone = getZone(state.location);
  const act = currentAct(state);
  const sq = activeStoryQuest(state);
  if (sq) ensureStoryQuestEntry(state, sq.id);

  function handleRest() {
    setState((s) => {
      const r = rest(s);
      if (r.rollDilemma) {
        // draft state — defer dilemma roll outside
      }
    });
    pushToast("You rest. The day turns.");
    rollEvents();
  }

  function rollEvents() {
    // Highest priority: scandals, then seasonal, then dilemma
    const sc = dueScandal(state);
    if (sc) {
      setState((s) => s.eventsTriggered.push(sc.id));
      setActiveEvent(sc);
      return;
    }
    const se = dueSeasonalEvent(state);
    if (se) {
      setState((s) => s.eventsTriggered.push(se.id));
      setActiveEvent(se);
      return;
    }
    const d = pickDilemma(state);
    if (d) {
      setActiveDilemma(d);
      if (d.oneShot) setState((s) => s.eventsTriggered.push(d.id));
    }
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-page mx-auto fade-in">
      <section className="panel mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl" aria-hidden>{zone.icon}</span>
          <div className="display text-lg flex-1">{zone.en}</div>
          <span className="arabic text-sm text-ash">{zone.ar}</span>
        </div>
        <p className="text-sm text-ash">{zone.desc}</p>
      </section>

      {sq && (
        <StoryQuestPanel
          quest={sq}
          onChoiceMade={() => pushToast("The choice is made.")}
        />
      )}

      <section className="panel mb-3">
        <div className="flex items-baseline justify-between mb-2">
          <div className="display text-base">Act {act.n}: {act.title}</div>
          <span className="arabic text-sm text-ash">{act.arabic}</span>
        </div>
        <p className="text-sm text-ash leading-relaxed">{act.intro}</p>
      </section>

      <section className="panel mb-3">
        <div className="text-xs uppercase tracking-wide text-muted mb-2">Quick</div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={handleRest}>
            ☾ Rest until tomorrow
          </button>
          <button
            className="btn"
            onClick={() => {
              const d = pickDilemma(state);
              if (d) {
                setActiveDilemma(d);
                if (d.oneShot) setState((s) => s.eventsTriggered.push(d.id));
              } else {
                pushToast("The day is quiet.");
              }
            }}
          >
            ◇ Wander
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="text-xs uppercase tracking-wide text-muted mb-2">Recent</div>
        {state.story.length === 0 ? (
          <p className="text-sm text-ash">Nothing yet. The story is yours to write.</p>
        ) : (
          <ul className="text-sm text-ink space-y-1.5">
            {state.story
              .slice(-6)
              .reverse()
              .map((e, i) => (
                <li key={i} className="leading-snug">
                  <span className="chip mr-2">D{e.day}</span>
                  {e.text}
                </li>
              ))}
          </ul>
        )}
      </section>

      {activeDilemma && (
        <DilemmaModal
          dilemma={activeDilemma}
          onResolve={() => setActiveDilemma(null)}
        />
      )}

      {activeEvent && (
        <EventModal
          event={activeEvent}
          onResolve={() => setActiveEvent(null)}
        />
      )}
    </div>
  );
}
