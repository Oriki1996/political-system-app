import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SettingsPanel from "./components/SettingsPanel";
import AccessibilityStatement from "./components/AccessibilityStatement";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./lib/auth";
import { SettingsProvider } from "./lib/settings";
import { UNIT_METAS } from "./content";
import { getUnitScoreLite } from "./lib/scoring";

// Unit view (with its heavy exam/puzzle/drawer deps) is code-split — it only
// loads when the student opens a unit, keeping the initial bundle small.
const UnitView = lazy(() => import("./components/UnitView"));

type Route =
  | { view: "dashboard" }
  | { view: "unit"; id: string }
  | { view: "accessibility" };

function readRouteFromUrl(): Route {
  const path = window.location.pathname;
  if (path === "/accessibility") return { view: "accessibility" };
  const m = path.match(/^\/unit\/(unit\d+)$/);
  if (m) return { view: "unit", id: m[1] };
  return { view: "dashboard" };
}

function urlForRoute(r: Route): string {
  if (r.view === "accessibility") return "/accessibility";
  if (r.view === "unit") return `/unit/${r.id}`;
  return "/";
}

function Shell() {
  const { profile, loading } = useAuth();
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
        totalScore={totalScore}
      />
      {route.view === "dashboard" ? (
        <Dashboard onPickUnit={(id) => setRoute({ view: "unit", id })} />
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
