"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { rest, advanceTime, logStory } from "@/engine/actions";
import { applyReward } from "@/engine/rewards";
import { tickProgression, currentAct } from "@/engine/progression";
import { pickDilemma, pickSeasonalEvent, pickScandal } from "@/engine/eventEngine";
import { Dialog } from "@/components/Dialog";
import { useToast } from "@/components/Toast";
import { DuelModal } from "@/components/duel/DuelModal";
import { hasTrait } from "@/engine/traits";
import { determineEnding } from "@/data/endings";
import type { Dilemma, EventOption, ScandalEvent, SeasonalEvent } from "@/lib/types";

export function HomeView() {
  const s = useGame((g) => g.state);
  const setStore = useGame((g) => g.set);
  const toast = useToast((t) => t.show);
  const act = currentAct(s);

  const [dilemma, setDilemma] = useState<Dilemma | null>(null);
  const [seasonal, setSeasonal] = useState<SeasonalEvent | null>(null);
  const [scandal, setScandal] = useState<ScandalEvent | null>(null);
  const [duel, setDuel] = useState<"gahwa" | "debate" | "falconry" | "brawl" | null>(null);
  const [endingOpen, setEndingOpen] = useState(false);

  function doRest() {
    setStore((s) => {
      rest(s);
      tickProgression(s);
    });
    // 100% chance of dilemma after rest
    const next = pickDilemma(useGame.getState().state);
    if (next) setDilemma(next);
    // Check seasonal event
    const seas = pickSeasonalEvent(useGame.getState().state);
    if (seas) setSeasonal(seas);
    // Check scandal
    const sc = pickScandal(useGame.getState().state);
    if (sc) setScandal(sc);
  }

  function passDay() {
    setStore((s) => {
      advanceTime(s, 6);
      tickProgression(s);
    });
    toast("Hours pass.");
  }

  function chooseDilemma(d: Dilemma, choice: "accept" | "refuse" | "third") {
    const opt = (choice === "third" ? d.third : d[choice])!;
    setStore((s) => {
      // Apply base option fields (rewards minus the label/risk/triggerDuel)
      const { label, risk, triggerDuel, ...rest } = opt;
      applyReward(s, rest);

      if (risk) {
        const roll = Math.random();
        const out = roll < risk.prob ? risk.win : risk.lose;
        applyReward(s, out);
        logStory(s, `[${d.title}] ${out.label || (roll < risk.prob ? "Won the gamble." : "Lost the gamble.")}`);
      } else {
        logStory(s, `[${d.title}] ${label}`);
      }

      if (d.oneShot) s.dilemmasSeen.push(d.id);
      tickProgression(s);
    });
    if (opt.triggerDuel) setDuel(opt.triggerDuel);
    setDilemma(null);
  }

  function applySeasonal(e: SeasonalEvent, opt: EventOption) {
    setStore((s) => {
      const { label, branch, triggerDuel, ...rest } = opt;
      applyReward(s, rest);
      s.eventsTriggered.push(e.id);
      logStory(s, `[${e.title}] ${label}`);
      tickProgression(s);
    });
    if (opt.triggerDuel) setDuel(opt.triggerDuel);
    setSeasonal(null);
  }

  function applyScandal(sc: ScandalEvent, opt: EventOption) {
    setStore((s) => {
      const { label, branch, triggerDuel, ...rest } = opt;
      applyReward(s, rest);
      s.eventsTriggered.push(sc.id);
      logStory(s, `[${sc.title}] ${label}`);
      tickProgression(s);
    });
    if (opt.triggerDuel) setDuel(opt.triggerDuel);
    setScandal(null);
  }

  const endingReady = !!s.endingPath && s.actsCompleted.includes("insider");

  return (
    <div className="space-y-4 fade-in">
      <section className="card p-5">
        <div className="ar text-xs text-[var(--muted)]">{act.arabic}</div>
        <h2 className="serif text-xl mt-1">Act {act.n}: {act.title}</h2>
        <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{act.intro}</p>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <button className="btn btn-primary text-center" onClick={doRest}>
          ◐ Rest
          <div className="text-[10px] opacity-80 font-normal">+30 energy · 4 hours · event</div>
        </button>
        <button className="btn text-center" onClick={passDay}>
          ❖ Let time pass
          <div className="text-[10px] opacity-70 font-normal">Skip 6 hours</div>
        </button>
      </section>

      {endingReady && (
        <section className="card p-4 border-2 border-emerald">
          <div className="ar text-xs text-[var(--muted)]">المصير</div>
          <h3 className="serif text-lg mt-1">An ending is ready.</h3>
          <p className="text-sm text-[var(--muted)] mt-1">The chapter you wrote can now be read.</p>
          <button className="btn btn-primary mt-3 text-center" onClick={() => setEndingOpen(true)}>
            See your ending
          </button>
        </section>
      )}

      <section className="card p-4">
        <h3 className="serif text-base mb-2">Recent</h3>
        {s.story.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nothing has happened yet. Go find something.</p>
        ) : (
          <ul className="space-y-2">
            {s.story.slice(0, 8).map((e, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <span className="text-[var(--muted)] text-xs mr-2">D{e.day}</span>
                {e.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      {s.traits.length > 0 && (
        <section className="card p-4">
          <h3 className="serif text-base mb-2">Who you are becoming</h3>
          <div className="flex flex-wrap gap-1.5">
            {s.traits.map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* Dilemma modal */}
      {dilemma && (
        <Dialog open onClose={() => setDilemma(null)} title={dilemma.title}>
          <div className="text-[11px] uppercase tracking-wide text-[var(--muted)] mb-2">
            {dilemma.tag} · {dilemma.category}
          </div>
          <p className="text-sm leading-relaxed mb-4">{dilemma.text}</p>
          <div className="space-y-2">
            <button className="btn btn-primary" onClick={() => chooseDilemma(dilemma, "accept")}>
              {dilemma.accept.label}
            </button>
            <button className="btn" onClick={() => chooseDilemma(dilemma, "refuse")}>
              {dilemma.refuse.label}
            </button>
            {dilemma.third && (!dilemma.third.requiresTrait || hasTrait(s, dilemma.third.requiresTrait)) && (
              <button className="btn" onClick={() => chooseDilemma(dilemma, "third")}>
                {dilemma.third.label}
              </button>
            )}
          </div>
        </Dialog>
      )}

      {/* Seasonal event */}
      {seasonal && (
        <Dialog open onClose={() => setSeasonal(null)} title={seasonal.title} arabic={seasonal.arabic}>
          <p className="text-sm leading-relaxed mb-4">{seasonal.text}</p>
          <div className="space-y-2">
            {seasonal.options.map((opt, i) => (
              <button key={i} className="btn" onClick={() => applySeasonal(seasonal, opt)}>{opt.label}</button>
            ))}
          </div>
        </Dialog>
      )}

      {/* Scandal */}
      {scandal && (
        <Dialog open onClose={() => setScandal(null)} title={scandal.title} arabic={scandal.arabic}>
          <p className="text-sm leading-relaxed mb-4">{scandal.text}</p>
          <div className="space-y-2">
            {scandal.options.map((opt, i) => (
              <button key={i} className="btn" onClick={() => applyScandal(scandal, opt)}>{opt.label}</button>
            ))}
          </div>
        </Dialog>
      )}

      {/* Duel */}
      {duel && (
        <DuelModal typeId={duel} open onClose={() => setDuel(null)} />
      )}

      {/* Ending */}
      {endingOpen && (
        <EndingDialog onClose={() => setEndingOpen(false)} />
      )}
    </div>
  );
}

function EndingDialog({ onClose }: { onClose: () => void }) {
  const s = useGame((g) => g.state);
  const ending = determineEnding(s);
  return (
    <Dialog open onClose={onClose} title={ending.title} arabic={ending.arabic}>
      <div className="serif text-base leading-relaxed whitespace-pre-line">{ending.epilogue}</div>
      <div className="mt-5 flex gap-2">
        <button className="btn flex-1" onClick={onClose}>Close</button>
        <button
          className="btn btn-primary flex-1"
          onClick={() => {
            useGame.getState().reset();
            onClose();
            window.location.reload();
          }}
        >New Game+</button>
      </div>
    </Dialog>
  );
}
