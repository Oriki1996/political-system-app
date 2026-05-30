import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/layout/Login";
import ClassBoard from "./components/board/ClassBoard";
import SettingsPanel from "./components/layout/SettingsPanel";
import AccessibilityStatement from "./components/layout/AccessibilityStatement";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import { AuthProvider, useAuth } from "./lib/auth";
import { SettingsProvider } from "./lib/settings";
import { UNIT_METAS } from "./content";
import { getUnitScoreLite } from "./lib/scoring";
import { upsertUnitScore } from "./lib/cloudScores";

// Unit view (with its heavy exam/puzzle/drawer deps) is code-split — it only
// loads when the student opens a unit, keeping the initial bundle small.
const UnitView = lazy(() => import("./components/unit/UnitView"));

type Route =
  | { view: "dashboard" }
  | { view: "unit"; id: string }
  | { view: "board" }
  | { view: "accessibility" };

function readRouteFromUrl(): Route {
  const path = window.location.pathname;
  if (path === "/accessibility") return { view: "accessibility" };
  if (path === "/board") return { view: "board" };
  const m = path.match(/^\/unit\/(unit\d+)$/);
  if (m) return { view: "unit", id: m[1] };
  return { view: "dashboard" };
}

function urlForRoute(r: Route): string {
  if (r.view === "accessibility") return "/accessibility";
  if (r.view === "board") return "/board";
  if (r.view === "unit") return `/unit/${r.id}`;
  return "/";
}

function Shell() {
  const { profile, loading, user } = useAuth();
  const [route, setRouteState] = useState<Route>(() => readRouteFromUrl());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tick, setTick] = useState(0);

  // Sync route with URL (back/forward navigation)
  useEffect(() => {
    const onPop = () => setRouteState(readRouteFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setRoute = (r: Route) => {
    const url = urlForRoute(r);
    if (window.location.pathname !== url) {
      window.history.pushState({}, "", url);
    }
    setRouteState(r);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  // Listen to score changes (for Header global chip)
  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("psi-score-changed", onChange);
    return () => window.removeEventListener("psi-score-changed", onChange);
  }, []);

  // Cloud sync (best-effort): push local exam scores up so the class board is
  // current. On login, upload everything once; then on each score change.
  useEffect(() => {
    if (!user) return;
    for (const u of UNIT_METAS) {
      const s = getUnitScoreLite(u.id);
      if (s.possible > 0) upsertUnitScore(user.id, u.id, s.earned, s.possible);
    }
    const onChange = (e: Event) => {
      const unitId = (e as CustomEvent).detail?.unitId;
      if (!unitId) return;
      const s = getUnitScoreLite(unitId);
      upsertUnitScore(user.id, unitId, s.earned, s.possible);
    };
    window.addEventListener("psi-score-changed", onChange);
    return () => window.removeEventListener("psi-score-changed", onChange);
  }, [user]);

  const totalScore = useMemo(() => {
    let earned = 0;
    let possible = 0;
    for (const u of UNIT_METAS) {
      const s = getUnitScoreLite(u.id);
      earned += s.earned;
      possible += s.possible;
    }
    return { earned, possible };
  }, [tick]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] grid place-items-center" role="status" aria-live="polite">
        <div className="text-slate-500 dark:text-slate-400 animate-pulse">טוען...</div>
      </div>
    );
  }

  // Accessibility statement is accessible even without login
  if (route.view === "accessibility") {
    return (
      <div className="min-h-screen">
        <SkipLink />
        <Header
          onHome={() => setRoute({ view: "dashboard" })}
          showBack
          onOpenSettings={() => setSettingsOpen(true)}
          totalScore={totalScore}
        />
        <AccessibilityStatement onBack={() => setRoute({ view: "dashboard" })} />
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <SiteFooter onAccessibility={() => setRoute({ view: "accessibility" })} />
      </div>
    );
  }

  if (!profile) {
    return <Login />;
  }

  const goHome = () => setRoute({ view: "dashboard" });

  return (
    <div className="min-h-screen">
      <SkipLink />
      <Header
        onHome={goHome}
        showBack={route.view !== "dashboard"}
        onOpenSettings={() => setSettingsOpen(true)}
        onBoard={() => setRoute({ view: "board" })}
        totalScore={totalScore}
      />
      {route.view === "dashboard" ? (
        <Dashboard onPickUnit={(id) => setRoute({ view: "unit", id })} />
      ) : route.view === "board" ? (
        <ClassBoard />
      ) : (
        <ErrorBoundary resetKey={route.id}>
          <Suspense
            fallback={
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center text-slate-500 dark:text-slate-400 animate-pulse" role="status">
                טוען יחידה…
              </div>
            }
          >
            <UnitView unitId={route.id} meta={UNIT_METAS.find((u) => u.id === route.id)!} />
          </Suspense>
        </ErrorBoundary>
      )}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SiteFooter onAccessibility={() => setRoute({ view: "accessibility" })} />
    </div>
  );
}

function SkipLink() {
  return (
    <a
      href="#main"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus();
        }
      }}
    >
      דלג ישירות לתוכן הראשי
    </a>
  );
}

function SiteFooter({ onAccessibility }: { onAccessibility: () => void }) {
  return (
    <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 mt-8 text-center text-xs text-slate-500 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60" role="contentinfo">
      <div className="space-y-2">
        <div>מבוסס על מאמרי החובה של הסילבוס · עיצוב למידה אישי לאורי בן-דוד</div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onAccessibility}
            className="text-brand-700 dark:text-brand-300 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded px-1"
          >
            הצהרת נגישות
          </button>
          <span aria-hidden="true">·</span>
          <a
            href="mailto:oribendavid1996@gmail.com"
            className="text-brand-700 dark:text-brand-300 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded px-1"
          >
            צרו קשר
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </SettingsProvider>
  );
}
