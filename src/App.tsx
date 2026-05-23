import { useEffect, useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import UnitView from "./components/UnitView";
import { UNITS } from "./content";

type Route = { view: "dashboard" } | { view: "unit"; id: string };

export default function App() {
  const [route, setRoute] = useState<Route>({ view: "dashboard" });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  const goHome = () => setRoute({ view: "dashboard" });

  return (
    <div className="min-h-screen">
      <Header onHome={goHome} showBack={route.view !== "dashboard"} />
      {route.view === "dashboard" ? (
        <Dashboard onPickUnit={(id) => setRoute({ view: "unit", id })} />
      ) : (
        <UnitView unit={UNITS.find((u) => u.id === route.id)!} />
      )}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-500 dark:text-slate-500">
        מבוסס על שמעוני 2001 ומאמרי החובה האחרים בסילבוס · עיצוב למידה אישי לאורי בן-דוד
      </footer>
    </div>
  );
}
