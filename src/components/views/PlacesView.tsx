"use client";

import { useState } from "react";
import { useGame } from "@/engine/store";
import { zones } from "@/data/zones";
import { subLocations } from "@/data/subLocations";
import { travel, visitSubLocation } from "@/engine/actions";
import { tickProgression } from "@/engine/progression";
import { pickDilemma } from "@/engine/eventEngine";
import { useToast } from "@/components/Toast";
import { Dialog } from "@/components/Dialog";
import type { Dilemma } from "@/lib/types";
import { applyReward } from "@/engine/rewards";
import { logStory } from "@/engine/actions";

export function PlacesView() {
  const s = useGame((g) => g.state);
  const setStore = useGame((g) => g.set);
  const toast = useToast((t) => t.show);
  const [dilemma, setDilemma] = useState<Dilemma | null>(null);

  const currentZone = zones.find((z) => z.id === s.location);
  const subs = subLocations.filter((sl) => sl.zone === s.location && (!sl.unlockCond || sl.unlockCond(s)));

  function go(zoneId: string) {
    const z = zones.find((x) => x.id === zoneId);
    if (!z) return;
    let success = false;
    setStore((g) => {
      success = travel(g, z);
      if (success) tickProgression(g);
    });
    if (!success) {
      toast("Too tired to travel.");
      return;
    }
    if (Math.random() < 0.3) {
      const next = pickDilemma(useGame.getState().state);
      if (next) setDilemma(next);
    }
  }

  function visit(sub: typeof subs[number]) {
    let success = false;
    setStore((g) => {
      success = visitSubLocation(g, sub.id, sub.name, sub.energyCost);
      if (success) tickProgression(g);
    });
    if (!success) toast("Too tired.");
  }

  function chooseDilemma(d: Dilemma, choice: "accept" | "refuse" | "third") {
    const opt = (choice === "third" ? d.third : d[choice])!;
    setStore((s) => {
      const { label, risk, ...rest } = opt;
      applyReward(s, rest);
      if (risk) {
        const out = Math.random() < risk.prob ? risk.win : risk.lose;
        applyReward(s, out);
        logStory(s, `[${d.title}] ${out.label || ""}`);
      } else {
        logStory(s, `[${d.title}] ${label}`);
      }
      if (d.oneShot) s.dilemmasSeen.push(d.id);
      tickProgression(s);
    });
    setDilemma(null);
  }

  return (
    <div className="space-y-4 fade-in">
      <section className="card p-4">
        <div className="ar text-xs text-[var(--muted)]">{currentZone?.ar}</div>
        <h2 className="serif text-xl">{currentZone?.en}</h2>
        <p className="text-sm text-[var(--muted)] mt-1">{currentZone?.desc}</p>
      </section>

      {subs.length > 0 && (
        <section className="card p-4">
          <h3 className="serif text-base mb-3">Places nearby</h3>
          <div className="space-y-2">
            {subs.map((sl) => (
              <button key={sl.id} className={`btn ${s.subLocation === sl.id ? "ring-2 ring-emerald" : ""}`} onClick={() => visit(sl)}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{sl.name}</span>
                  <span className="ar text-xs text-[var(--muted)]">{sl.ar}</span>
                  <span className="ml-auto text-[10px] uppercase text-[var(--muted)]">{sl.flavor} · {sl.energyCost}⚡</span>
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">{sl.desc}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="serif text-base mb-3">Travel</h3>
        <div className="grid grid-cols-2 gap-2">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => go(z.id)}
              disabled={z.id === s.location}
              className={`card p-3 text-left ${z.id === s.location ? "opacity-50" : ""}`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-base">{z.icon}</span>
                <span className="font-semibold text-sm">{z.en}</span>
              </div>
              <div className="ar text-xs text-[var(--muted)] mt-0.5">{z.ar}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] mt-1.5">{z.cost}⚡</div>
            </button>
          ))}
        </div>
      </section>

      {dilemma && (
        <Dialog open onClose={() => setDilemma(null)} title={dilemma.title}>
          <div className="text-[11px] uppercase tracking-wide text-[var(--muted)] mb-2">
            {dilemma.tag} · {dilemma.category}
          </div>
          <p className="text-sm leading-relaxed mb-4">{dilemma.text}</p>
          <div className="space-y-2">
            <button className="btn btn-primary" onClick={() => chooseDilemma(dilemma, "accept")}>{dilemma.accept.label}</button>
            <button className="btn" onClick={() => chooseDilemma(dilemma, "refuse")}>{dilemma.refuse.label}</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
