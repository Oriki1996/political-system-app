import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, Sparkles } from "lucide-react";
import type { ComprehensionQ, QuestionLevel } from "../types";

const LEVEL_META: Record<QuestionLevel, { label: string; ring: string; chip: string; iconBg: string }> = {
  recall: {
    label: "שאלת הבנה",
    ring: "border-emerald-300/60 dark:border-emerald-700/40 from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30",
    chip: "bg-emerald-200/80 text-emerald-800 dark:bg-emerald-800/70 dark:text-emerald-100",
    iconBg: "bg-emerald-500 text-white",
  },
  critical: {
    label: "שאלה ביקורתית",
    ring: "border-amber-300/60 dark:border-amber-700/40 from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30",
    chip: "bg-amber-200/80 text-amber-800 dark:bg-amber-800/70 dark:text-amber-100",
    iconBg: "bg-amber-500 text-white",
  },
  integration: {
    label: "שאלת אינטגרציה",
    ring: "border-violet-300/60 dark:border-violet-700/40 from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/30",
    chip: "bg-violet-200/80 text-violet-800 dark:bg-violet-800/70 dark:text-violet-100",
    iconBg: "bg-violet-500 text-white",
  },
};

const DEFAULT_LEVEL: QuestionLevel = "recall";

export default function InlineCheck({ q, index }: { q: ComprehensionQ; index?: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const meta = LEVEL_META[q.level || DEFAULT_LEVEL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-5 rounded-2xl p-5 bg-gradient-to-l ${meta.ring} border-2`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`rounded-lg ${meta.iconBg} p-1.5 shadow-soft`}>
          <HelpCircle size={14} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.chip}`}>
          {meta.label}{index ? ` ${index}` : ""}
        </span>
      </div>

      <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-4 text-[15px]">
        {q.question}
      </p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isPicked = i === picked;
          const showResult = picked !== null;
          const expl = q.optionExplanations?.[i];

          return (
            <div key={i}>
              <button
                onClick={() => picked === null && setPicked(i)}
                disabled={picked !== null}
                className={`w-full text-right p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  showResult
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100"
                      : isPicked
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100"
                        : "border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 opacity-60"
                    : "border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="leading-relaxed">{opt}</span>
                  {showResult && isCorrect && <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />}
                  {showResult && isPicked && !isCorrect && <X size={16} className="text-rose-600 mt-0.5 shrink-0" />}
                </div>
              </button>
              <AnimatePresence>
                {showResult && expl && (isCorrect || isPicked) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`text-xs mt-1.5 mr-3 pr-3 border-r-2 leading-relaxed ${
                      isCorrect
                        ? "border-emerald-400 text-emerald-900 dark:text-emerald-200"
                        : "border-rose-400 text-rose-800 dark:text-rose-200"
                    }`}>
                      {expl}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {picked !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 bg-white/80 dark:bg-slate-900/60 border border-brand-200/60 dark:border-brand-800/40 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1.5">
              <Sparkles size={12} />
              {picked === q.correct ? "מצוין — הבנה עמוקה" : "שווה לחזור"}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{q.rationale}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
