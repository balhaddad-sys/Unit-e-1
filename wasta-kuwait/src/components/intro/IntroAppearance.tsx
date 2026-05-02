"use client";

import { useGame } from "@/engine/store";
import Avatar from "@/components/Avatar";
import {
  styles,
  skinTones,
  ghutraColors,
  shaylaColors,
  beardStyles,
  eyeStyles,
  eyebrowStyles,
  ageLevels,
  glassesStyles,
  randomAppearance,
} from "@/data/appearance";
import type { Appearance } from "@/lib/types";

type Field = keyof Appearance;

export default function IntroAppearance({ accent }: { accent: string }) {
  const setState = useGame((s) => s.setState);
  const appearance = useGame((s) => s.state.appearance);

  function setField<K extends Field>(k: K, v: Appearance[K]) {
    setState((s) => {
      s.appearance[k] = v;
    });
  }

  const styleObj = styles.find((s) => s.id === appearance.style)!;

  return (
    <section className="mt-3 fade-in">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="display text-xl">Your face</h2>
        <span className="arabic text-base text-ash">الوجه</span>
      </div>

      <div className="panel flex flex-col items-center gap-3">
        <Avatar appearance={appearance} accent={accent} size={140} ring />
        <button
          className="btn"
          onClick={() => setState((s) => (s.appearance = randomAppearance(styleObj.female)))}
        >
          ↻ Surprise me
        </button>
      </div>

      <Picker
        title="Style"
        options={styles.map((s) => ({ id: s.id, label: s.name }))}
        value={appearance.style}
        onChange={(v) => setField("style", v as Appearance["style"])}
      />

      <Picker
        title="Skin"
        options={skinTones.map((s, i) => ({ id: s.id, label: `Tone ${i + 1}`, color: s.hex }))}
        value={appearance.skin}
        onChange={(v) => setField("skin", v as Appearance["skin"])}
      />

      {styleObj.hasHead && !styleObj.hijab && (
        <Picker
          title="Ghutra color"
          options={ghutraColors.map((g) => ({ id: g.id, label: g.name, color: g.hex }))}
          value={appearance.ghutra}
          onChange={(v) => setField("ghutra", v as Appearance["ghutra"])}
        />
      )}

      {styleObj.hijab && (
        <Picker
          title="Shayla color"
          options={shaylaColors.map((c) => ({ id: c.id, label: c.name, color: c.hex }))}
          value={appearance.shayla}
          onChange={(v) => setField("shayla", v as Appearance["shayla"])}
        />
      )}

      {styleObj.hasBeard && (
        <Picker
          title="Beard"
          options={beardStyles.map((b) => ({ id: b.id, label: b.name }))}
          value={appearance.beard}
          onChange={(v) => setField("beard", v as Appearance["beard"])}
        />
      )}

      <Picker
        title="Eyes"
        options={eyeStyles.map((e) => ({ id: e.id, label: e.name, color: e.hex }))}
        value={appearance.eyes}
        onChange={(v) => setField("eyes", v as Appearance["eyes"])}
      />

      <Picker
        title="Eyebrows"
        options={eyebrowStyles.map((e) => ({ id: e.id, label: e.name }))}
        value={appearance.eyebrows}
        onChange={(v) => setField("eyebrows", v as Appearance["eyebrows"])}
      />

      <Picker
        title="Age"
        options={ageLevels.map((a) => ({ id: a.id, label: a.name }))}
        value={appearance.age}
        onChange={(v) => setField("age", v as Appearance["age"])}
      />

      <Picker
        title="Glasses"
        options={glassesStyles.map((g) => ({ id: g.id, label: g.name }))}
        value={appearance.glasses}
        onChange={(v) => setField("glasses", v as Appearance["glasses"])}
      />
    </section>
  );
}

function Picker({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: string; label: string; color?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-wide text-muted mb-1.5">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              className={`panel flex items-center gap-2 justify-center py-2 text-xs ${
                active ? "shadow-glow border-[var(--accent)]" : ""
              }`}
            >
              {o.color && (
                <span
                  className="inline-block w-4 h-4 rounded-full border border-line"
                  style={{ background: o.color }}
                />
              )}
              <span>{o.label || "—"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
