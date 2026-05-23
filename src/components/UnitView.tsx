import { motion } from "framer-motion";
import { Target, Compass, FileText } from "lucide-react";
import type { UnitMeta } from "../types";
import SegmentView from "./SegmentView";

export default function UnitView({ unit }: { unit: UnitMeta }) {
  const isPlaceholder = unit.status === "placeholder";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Cover */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 sm:p-8 bg-gradient-to-bl from-brand-50/80 to-accent-50/40 dark:from-brand-950/40 dark:to-accent-950/30"
      >
        <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">
          יחידה {String(unit.number).padStart(2, "0")}
        </div>
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

      {/* Segments */}
      {unit.segments && unit.segments.length > 0 ? (
        <div className="space-y-5">
          {unit.segments.map((seg) => (
            <SegmentView key={seg.id} segment={seg} />
          ))}
        </div>
      ) : isPlaceholder ? (
        <section className="card p-8 text-center">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            היחידה בתהליך בנייה
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            התוכן יתווסף בסשנים הבאים, לפי סדר הסילבוס.
          </p>
        </section>
      ) : (
        <section className="card p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          קטעים נוספים יתווספו בקרוב.
        </section>
      )}
    </main>
  );
}
