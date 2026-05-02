"use client";

import { useGame } from "@/engine/store";
import { zones } from "@/data/zones";
import { subLocationsForZone } from "@/data/subLocations";
import { travel, visitSubLocation } from "@/engine/actions";
import { useState } from "react";
import DilemmaModal from "@/components/dilemma/DilemmaModal";
import { pickDilemma } from "@/engine/eventEngine";
import type { Dilemma } from "@/lib/types";

export default function PlacesView() {
  const setState = useGame((s) => s.setState);
  const state = useGame((s) => s.state);
  const pushToast = useGame((s) => s.pushToast);
  const [dilemma, setDilemma] = useState<Dilemma | null>(null);

  function go(zoneId: string) {
    let didTravel = false;
    setState((s) => {
      const r = travel(s, zoneId);
      if (!r.ok) {
        pushToast(r.message);
      } else {
        didTravel = true;
        s.story.push({ day: s.day, time: s.time, text: r.message });
      }
    });
    // 30% chance of dilemma after travel (per spec)
    if (didTravel && Math.random() < 0.3) {
      const d = pickDilemma(state);
      if (d) {
        setDilemma(d);
        if (d.oneShot) setState((s) => s.eventsTriggered.push(d.id));
      }
    }
  }

  function visit(sublocId: string, energyCost: number) {
    setState((s) => {
      const r = visitSubLocation(s, sublocId, energyCost);
      if (!r.ok) pushToast(r.message);
      else s.story.push({ day: s.day, time: s.time, text: `${r.message}` });
    });
  }

  const subs = subLocationsForZone(state.location);

  return (
    <div className="px-4 pt-4 pb-24 max-w-page mx-auto fade-in">
      <h2 className="display text-xl mb-2">Travel</h2>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {zones.map((z) => {
          const here = z.id === state.location;
          const cant = state.stats.energy < z.cost;
          return (
            <button
              key={z.id}
              onClick={() => !here && go(z.id)}
              disabled={here || cant}
              className={`text-left panel ${
                here
                  ? "shadow-glow border-[var(--accent)]"
                  : cant
                  ? "opacity-40"
                  : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden>{z.icon}</span>
                  <div className="display text-sm">{z.en}</div>
                </div>
                <span className="arabic text-xs text-ash">{z.ar}</span>
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                {here ? "You are here" : `Energy ${z.cost}`}
              </div>
              <div className="text-[11px] text-ash mt-0.5 line-clamp-1">{z.desc}</div>
            </button>
          );
        })}
      </div>

      <h3 className="display text-lg mb-2">Within {zones.find((z) => z.id === state.location)?.en}</h3>
      {subs.length === 0 ? (
        <p className="text-sm text-ash">No notable sub-locations here yet.</p>
      ) : (
        <div className="grid gap-2">
          {subs.map((sl) => {
            const locked = sl.unlockCond ? !sl.unlockCond(state) : false;
            const here = state.subLocation === sl.id;
            return (
              <button
                key={sl.id}
                disabled={locked}
                onClick={() => visit(sl.id, sl.energyCost)}
                className={`text-left panel ${
                  here ? "shadow-glow border-[var(--accent)]" : ""
                } ${locked ? "opacity-40" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="display text-sm">{sl.name}</div>
                  <span className="arabic text-xs text-ash">{sl.ar}</span>
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  <span className="capitalize">{sl.flavor}</span> · energy {sl.energyCost}
                  {locked && " · locked"}
                </div>
                <div className="text-[12px] text-ash mt-0.5">{sl.desc}</div>
              </button>
            );
          })}
        </div>
      )}

      {dilemma && <DilemmaModal dilemma={dilemma} onResolve={() => setDilemma(null)} />}
    </div>
  );
}
