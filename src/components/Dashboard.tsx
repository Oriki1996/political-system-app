import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, BookOpen, Sparkles, ChevronLeft } from "lucide-react";
import { UNIT_METAS } from "../content";
import type { UnitMeta } from "../types";
import { getUnitScoreLite } from "../lib/scoring";
import { useSettings } from "../lib/settings";
import ScoreChip from "./ScoreChip";

interface Props {
  onPickUnit: (id: string) => void;
}

const STATUS_BADGE = {
  ready: { label: "מוכן", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "in-progress": { label: "בעבודה", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  placeholder: { label: "בקרוב", className: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

export default function Dashboard({ onPickUnit }: Props) {
  const { settings } = useSettings();
  const [tick, setTick] = useState(0);

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

  return (
    <main id="main" role="main" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 p-3.5 text-white shadow-soft shrink-0">
            <BookOpen size={26} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              מערכת פוליטית ישראלית
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              מחברת אינטראקטיבית — 10 יחידות לפי הסילבוס, מבוססות על מאמרי החובה.
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              פרופ' דורון נבות · אוניברסיטת חיפה · תשפ"ו ב'
            </div>
            {settings.scoringEnabled && totalScore.possible > 0 && (
              <div className="mt-3">
                <ScoreChip
                  earned={totalScore.earned}
                  possible={totalScore.possible}
                  label={`ניקוד כללי בכל היחידות: ${totalScore.earned} מתוך ${totalScore.possible}`}
                />
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Intro */}
      <section className="card p-5 bg-gradient-to-l from-brand-50/80 to-accent-50/40 dark:from-brand-950/40 dark:to-accent-950/30 border-brand-200/60 dark:border-brand-800/40">
        <div className="flex items-start gap-3">
          <Sparkles className="text-accent-600 dark:text-accent-400 shrink-0 mt-1" size={20} />
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <p className="font-semibold mb-1">איך זה עובד</p>
            <p>
              כל יחידה מחולקת לכמה <b>סקשנים קצרים</b>. בסוף כל סקשן — שאלות multiple-choice בשלוש רמות:{" "}
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">הבנה</span>,{" "}
              <span className="text-amber-700 dark:text-amber-400 font-semibold">ביקורתית</span>, ו-
              <span className="text-violet-700 dark:text-violet-400 font-semibold">אינטגרציה</span>.{" "}
              בחר תשובה לפני שאתה רואה את ההסבר.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">יחידות לימוד</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {UNIT_METAS.map((unit, i) => (
            <UnitCard key={unit.id} unit={unit} index={i} onClick={() => onPickUnit(unit.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}

function UnitCard({ unit, index, onClick }: { unit: UnitMeta; index: number; onClick: () => void }) {
  const locked = unit.status === "placeholder";
  const badge = STATUS_BADGE[unit.status];
  const { settings } = useSettings();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener("psi-score-changed", onChange);
    return () => window.removeEventListener("psi-score-changed", onChange);
  }, []);

  const score = useMemo(() => getUnitScoreLite(unit.id), [unit.id, tick]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 140 }}
      whileHover={!locked ? { y: -3 } : undefined}
      onClick={locked ? undefined : onClick}
      disabled={locked}
      aria-label={`יחידה ${unit.number}: ${unit.title} — ${badge.label}${
        settings.scoringEnabled && score && score.possible > 0
          ? `. ניקוד: ${score.earned} מתוך ${score.possible}`
          : ""
      }`}
      className={`card text-right group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
        locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-soft"
      }`}
    >
      {/* Hero image strip */}
      <div className={`h-20 bg-gradient-to-bl ${unit.color || "from-brand-500 to-accent-500"} relative`}>
        {unit.heroImage && (
          <img
            src={unit.heroImage}
            alt=""
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
        <div className="absolute top-3 right-4 text-white">
          <div className="text-3xl font-extrabold drop-shadow-md">{String(unit.number).padStart(2, "0")}</div>
        </div>
        <div className="absolute top-3 left-4 flex flex-col items-end gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
          {settings.scoringEnabled && score && score.possible > 0 && score.earned > 0 && (
            <ScoreChip earned={score.earned} possible={score.possible} size="sm" />
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-snug">{unit.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{unit.subtitle}</p>
          </div>
          <div className="text-slate-400 dark:text-slate-600 shrink-0 mt-1">
            {locked ? <Lock size={16} /> : <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
