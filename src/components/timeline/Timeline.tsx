import { motion } from "framer-motion";
import type { TimelineEvent } from "../../types";

interface Props {
  events: TimelineEvent[];
  onJumpToSection?: (sectionId: string) => void;
}

const CATEGORY_STYLES: Record<NonNullable<TimelineEvent["category"]>, { dot: string; ring: string; chip: string }> = {
  functional: {
    dot: "bg-brand-500",
    ring: "ring-brand-200 dark:ring-brand-800",
    chip: "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200",
  },
  organic: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-200 dark:ring-emerald-800",
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  },
  synthesis: {
    dot: "bg-violet-500",
    ring: "ring-violet-200 dark:ring-violet-800",
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200",
  },
  crisis: {
    dot: "bg-rose-500",
    ring: "ring-rose-200 dark:ring-rose-800",
    chip: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
  },
  general: {
    dot: "bg-amber-500",
    ring: "ring-amber-200 dark:ring-amber-800",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  },
};

const CATEGORY_LABELS: Record<NonNullable<TimelineEvent["category"]>, string> = {
  functional: "פונקציונלי",
  organic: "אורגני",
  synthesis: "סינתזה",
  crisis: "משבר",
  general: "כללי",
};

export default function Timeline({ events, onJumpToSection }: Props) {
  return (
    <div className="relative" dir="rtl">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(CATEGORY_STYLES) as Array<keyof typeof CATEGORY_STYLES>).map((cat) => (
          <span
            key={cat}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${CATEGORY_STYLES[cat].chip}`}
          >
            <span className={`w-2 h-2 rounded-full ${CATEGORY_STYLES[cat].dot}`} aria-hidden="true" />
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
      </div>

      {/* Vertical line */}
      <div className="absolute top-0 bottom-0 right-[19px] sm:right-[27px] w-0.5 bg-gradient-to-b from-brand-200 via-slate-200 to-slate-100 dark:from-brand-800 dark:via-slate-700 dark:to-slate-800" aria-hidden="true" />

      <ol className="space-y-4 relative">
        {events.map((e, i) => {
          const cat = e.category || "general";
          const style = CATEGORY_STYLES[cat];
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="relative pr-12 sm:pr-16"
            >
              {/* Dot */}
              <span
                className={`absolute right-3 sm:right-5 top-2 w-5 h-5 rounded-full ${style.dot} ring-4 ${style.ring} ring-opacity-50`}
                aria-hidden="true"
              />
              {/* Card */}
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 shadow-sm">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                    {e.year}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${style.chip}`}>
                    {CATEGORY_LABELS[cat]}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">
                  {e.label}
                </h4>
                {e.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {e.description}
                  </p>
                )}
                {e.sectionRef && onJumpToSection && (
                  <button
                    type="button"
                    onClick={() => onJumpToSection(e.sectionRef!)}
                    className="mt-2 text-[11px] font-bold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
                  >
                    ← קרא בקטע
                  </button>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
