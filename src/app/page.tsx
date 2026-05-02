"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/engine/store";
import { Header } from "@/components/Header";
import { TabBar, type TabId } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { IntroFlow } from "@/components/intro/IntroFlow";
import { HomeView } from "@/components/views/HomeView";
import { PlacesView } from "@/components/views/PlacesView";
import { PeopleView } from "@/components/views/PeopleView";
import { QuestsView } from "@/components/views/QuestsView";
import { YouView } from "@/components/views/YouView";

export default function Page() {
  const hydrate = useGame((s) => s.hydrate);
  const hydrated = useGame((s) => s.hydrated);
  const givenName = useGame((s) => s.state.givenName);
  const [tab, setTab] = useState<TabId>("home");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="text-sm text-[var(--muted)]">Loading…</div>
      </main>
    );
  }

  if (!givenName) {
    return <IntroFlow onDone={() => setTab("home")} />;
  }

  return (
    <main className="min-h-dvh pb-24">
      <Header />
      <div className="max-w-screen mx-auto px-4 py-4">
        {tab === "home" && <HomeView />}
        {tab === "places" && <PlacesView />}
        {tab === "people" && <PeopleView />}
        {tab === "quests" && <QuestsView />}
        {tab === "you" && <YouView />}
      </div>
      <Toast />
      <TabBar tab={tab} onChange={setTab} />
    </main>
  );
}
