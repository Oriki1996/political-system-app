import { motion } from "framer-motion";
import { Lock, BookOpen, Sparkles, ChevronLeft } from "lucide-react";
import { UNITS } from "../content";
import type { UnitMeta } from "../types";

interface Props {
  onPickUnit: (id: string) => void;
}

const STATUS_BADGE = {
  ready: { label: "מוכן", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "in-progress": { label: "בעבודה", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  placeholder: { label: "בקרוב", className: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
};

export default function Dashboard({ onPickUnit }: Props) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 p-3 text-white shadow-soft shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              מערכת פוליטית ישראלית
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              מחברת אינטראקטיבית — 10 יחידות לפי הסילבוס, מבוססות על מאמרי החובה.
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              פרופ' דורון נבות · אוניברסיטת חיפה · תשפ"ו ב'
            </div>
          </div>
        </div>
      </motion.section>

      {/* Intro card */}
      <section className="card p-5 bg-gradient-to-l from-brand-50/80 to-accent-50/40 dark:from-brand-950/40 dark:to-accent-950/30 border-brand-200/60 dark:border-brand-800/40">
        <div className="flex items-start gap-3">
          <Sparkles className="text-accent-600 dark:text-accent-400 shrink-0 mt-1" size={20} />
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <p className="font-semibold mb-1">איך זה עובד</p>
            <p>
              כל יחידה מחולקת לכמה <b>קטעי לימוד</b>. בסוף כל קטע — בנק שאלות בשלוש רמות:{" "}
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">הבנה</span>,{" "}
              <span className="text-amber-700 dark:text-amber-400 font-semibold">ביקורתית</span>, ו-
              <span className="text-violet-700 dark:text-violet-400 font-semibold">אינטגרציה</span>.{" "}
              נסה לענות מהזיכרון לפני שאתה חושף את התשובה לדוגמה.
            </p>
          </div>
        </div>
      </section>

      {/* Units grid */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">
          יחידות לימוד
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {UNITS.map((unit, i) => (
            <UnitCard key={unit.id} unit={unit} index={i} onClick={() => onPickUnit(unit.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}

function UnitCard({
  unit,
  index,
  onClick,
}: {
  unit: UnitMeta;
  index: number;
  onClick: () => void;
}) {
  const locked = unit.status === "placeholder";
  const badge = STATUS_BADGE[unit.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 140 }}
      whileHover={!locked ? { y: -3 } : undefined}
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`card p-5 text-right group relative overflow-hidden ${
        locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:shadow-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-extrabold bg-gradient-to-br from-brand-500 to-accent-500 bg-clip-text text-transparent">
              {String(unit.number).padStart(2, "0")}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {unit.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {unit.subtitle}
          </p>
        </div>
        <div className="text-slate-400 dark:text-slate-600 shrink-0">
          {locked ? <Lock size={16} /> : <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />}
        </div>
      </div>
    </motion.button>
  );
}
