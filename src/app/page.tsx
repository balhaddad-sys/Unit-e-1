"use client";

import { useEffect, useState } from "react";
import { useGame, isCharacterReady } from "@/engine/store";
import Header from "@/components/Header";
import TabBar, { Tab } from "@/components/TabBar";
import HomeView from "@/components/views/HomeView";
import PlacesView from "@/components/views/PlacesView";
import PeopleView from "@/components/views/PeopleView";
import QuestsView from "@/components/views/QuestsView";
import YouView from "@/components/views/YouView";
import Toast from "@/components/Toast";
import Intro from "@/components/intro/Intro";
import { getAccent } from "@/data/accents";

export default function Page() {
  const hydrate = useGame((s) => s.hydrate);
  const hydrated = useGame((s) => s.hydrated);
  const state = useGame((s) => s.state);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const a = getAccent(state.accent);
    const root = document.documentElement;
    root.style.setProperty("--accent", a.c);
    root.style.setProperty("--accent2", a.c2);
    root.style.setProperty("--accent-bg", a.bg);
  }, [hydrated, state.accent]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center text-ash">
        <div className="text-sm">Loading…</div>
      </main>
    );
  }

  if (!isCharacterReady(state)) {
    return <Intro onDone={() => setTab("home")} />;
  }

  return (
    <main className="min-h-screen pb-16">
      <Header />
      {tab === "home" && <HomeView />}
      {tab === "places" && <PlacesView />}
      {tab === "people" && <PeopleView />}
      {tab === "quests" && <QuestsView />}
      {tab === "you" && <YouView />}
      <TabBar active={tab} setActive={setTab} />
      <Toast />
    </main>
  );
}
