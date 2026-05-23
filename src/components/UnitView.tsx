import { motion } from "framer-motion";
import { Target, Compass, FileText } from "lucide-react";
import type { Unit } from "../types";
import SectionView from "./SectionView";

export default function UnitView({ unit }: { unit: Unit }) {
  const isPlaceholder = unit.status === "placeholder";
  const hasContent = unit.sections && unit.sections.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero cover */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {unit.heroImage && (
          <div className={`h-32 sm:h-44 bg-gradient-to-bl ${unit.color || "from-brand-500 to-accent-500"} relative`}>
            <img
              src={unit.heroImage}
              alt=""
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 right-4 text-white">
              <div className="text-xs font-bold opacity-90">יחידה {String(unit.number).padStart(2, "0")}</div>
            </div>
          </div>
        )}
        <div className="p-6 sm:p-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {unit.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{unit.subtitle}</p>
          <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FileText size={14} className="mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">מאמרי חובה:</span> {unit.articles.join(" · ")}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lead question */}
      {unit.leadQuestion && (
        <section className="card p-5 border-r-4 border-accent-500 dark:border-accent-400">
          <div className="flex items-start gap-3">
            <Compass className="text-accent-600 dark:text-accent-400 shrink-0 mt-1" size={20} />
            <div>
              <div className="text-xs font-bold text-accent-700 dark:text-accent-300 mb-1">
                שאלת-העל של היחידה
              </div>
              <p className="text-[15px] italic text-slate-800 dark:text-slate-200 leading-relaxed">
                {unit.leadQuestion}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Objectives */}
      {unit.objectives && unit.objectives.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-emerald-600 dark:text-emerald-400" size={20} />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">בסיום היחידה תוכל ל…</h3>
          </div>
          <ul className="space-y-1.5 text-[14px] text-slate-700 dark:text-slate-200 leading-relaxed">
            {unit.objectives.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sections */}
      {hasContent ? (
        <div className="space-y-5">
          {unit.sections!.map((s, i) => (
            <SectionView key={s.id} section={s} index={i + 1} />
          ))}
        </div>
      ) : isPlaceholder ? (
        <section className="card p-8 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1.5">היחידה בתהליך בנייה</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            התוכן יתווסף בסשנים הבאים, לפי סדר הסילבוס.
          </p>
        </section>
      ) : null}
    </main>
  );
}
