import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import type { Question } from "../types";

const LEVEL_META = {
  recall: {
    label: "שאלת הבנה",
    bgClass: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40",
    pillClass: "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/60 dark:text-emerald-200",
  },
  critical: {
    label: "שאלה ביקורתית",
    bgClass: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40",
    pillClass: "bg-amber-200 text-amber-800 dark:bg-amber-800/60 dark:text-amber-200",
  },
  integration: {
    label: "שאלת אינטגרציה",
    bgClass: "bg-violet-50/80 dark:bg-violet-950/30 border-violet-200/60 dark:border-violet-800/40",
    pillClass: "bg-violet-200 text-violet-800 dark:bg-violet-800/60 dark:text-violet-200",
  },
};

export default function QuizQuestion({ question, index }: { question: Question; index: number }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const meta = LEVEL_META[question.level];

  return (
    <div className={`rounded-2xl border ${meta.bgClass} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.pillClass}`}>
          {meta.label} {index}
        </span>
      </div>

      <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-3">
        {question.text}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {question.hint && (
          <button
            onClick={() => setShowHint((s) => !s)}
            className="text-xs inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <HelpCircle size={14} />
            {showHint ? "הסתר רמז" : "רמז"}
          </button>
        )}
        <button
          onClick={() => setShowAnswer((s) => !s)}
          className="text-xs inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 font-medium"
        >
          {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
          {showAnswer ? "הסתר תשובה" : "חשוף תשובה לדוגמה"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showHint && question.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-sm text-slate-600 dark:text-slate-300 italic mb-2 px-3 py-2 rounded-lg bg-slate-50/80 dark:bg-slate-900/40">
              💡 רמז: {question.hint}
            </div>
          </motion.div>
        )}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 px-4 py-3 rounded-lg bg-white/80 dark:bg-slate-900/60 border-r-4 border-brand-400 dark:border-brand-600">
              <div className="text-[11px] font-bold text-brand-700 dark:text-brand-300 mb-1">▸ תשובה לדוגמה</div>
              {question.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
