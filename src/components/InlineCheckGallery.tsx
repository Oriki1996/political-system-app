import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, Sparkles, ChevronRight, ChevronLeft, Brain, Eye, Target } from "lucide-react";
import type { ComprehensionQ, QuestionLevel } from "../types";

const LEVEL_META: Record<QuestionLevel, { label: string; color: string; Icon: typeof Brain }> = {
  recall: {
    label: "הבנה",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/50",
    Icon: Brain,
  },
  critical: {
    label: "ביקורתית",
    color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/50",
    Icon: Eye,
  },
  integration: {
    label: "אינטגרציה",
    color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:border-violet-800/50",
    Icon: Target,
  },
};

interface Props {
  questions: ComprehensionQ[];
}

export default function InlineCheckGallery({ questions }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});

  if (questions.length === 0) return null;
  const q = questions[idx];
  const cur = picked[idx];
  const showResult = cur !== undefined;
  const levelMeta = q.level ? LEVEL_META[q.level] : undefined;

  function pick(i: number) {
    if (cur !== undefined) return;
    setPicked((p) => ({ ...p, [idx]: i }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-2xl p-4 sm:p-5 bg-gradient-to-l from-brand-50 to-cyan-50 dark:from-brand-950/40 dark:to-cyan-950/30 border-2 border-brand-200 dark:border-brand-800/50"
    >
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-brand-800 dark:text-brand-200 font-bold text-sm">
          <HelpCircle size={16} />
          <span>שאלות הבנה</span>
          {questions.length > 1 && (
            <span className="text-brand-600/80 dark:text-brand-300/80 font-semibold">
              ({idx + 1}/{questions.length})
            </span>
          )}
          {levelMeta && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${levelMeta.color}`}>
              <levelMeta.Icon size={10} />
              {levelMeta.label}
            </span>
          )}
        </div>
        {questions.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + questions.length) % questions.length)}
              className="p-1 rounded-lg text-brand-700 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
              aria-label="שאלה קודמת"
            >
              <ChevronRight size={16} />
            </button>
            <div className="flex gap-1 mx-1">
              {questions.map((_, i) => {
                const answered = picked[i] !== undefined;
                const isCorrect = answered && picked[i] === questions[i].correct;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`עבור לשאלה ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === idx
                        ? "bg-brand-600 w-6"
                        : answered
                          ? isCorrect ? "bg-emerald-400" : "bg-rose-400"
                          : "bg-brand-300 dark:bg-brand-700"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % questions.length)}
              className="p-1 rounded-lg text-brand-700 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
              aria-label="שאלה הבאה"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3 leading-relaxed">{q.question}</p>

          <div className="space-y-1.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isPicked = i === cur;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={showResult}
                  className={`w-full text-right p-2.5 rounded-xl border transition-all text-sm font-medium ${
                    showResult
                      ? isCorrect
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100"
                        : isPicked
                          ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100"
                          : "border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 opacity-60"
                      : "border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="leading-relaxed">{opt}</span>
                    {showResult && isCorrect && <Check size={14} className="text-emerald-600 shrink-0" />}
                    {showResult && isPicked && !isCorrect && <X size={14} className="text-rose-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {cur !== q.correct && q.optionExplanations?.[cur] && (
                  <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-200 text-xs font-bold mb-1">
                      <X size={12} />
                      למה התשובה שבחרת אינה נכונה
                    </div>
                    <p className="text-sm text-rose-900 dark:text-rose-100 leading-relaxed">{q.optionExplanations[cur]}</p>
                  </div>
                )}
                {cur !== q.correct && q.optionExplanations?.[q.correct] && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-200 text-xs font-bold mb-1">
                      <Check size={12} />
                      למה התשובה הנכונה היא: "{q.options[q.correct]}"
                    </div>
                    <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">{q.optionExplanations[q.correct]}</p>
                  </div>
                )}
                <div className="bg-white/70 dark:bg-slate-900/60 border border-brand-100 dark:border-brand-800/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1">
                    <Sparkles size={12} />
                    {cur === q.correct ? "מצוין — הבנה עמוקה" : "המסקנה"}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{q.rationale}</p>
                  {questions.length > 1 && idx < questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setIdx(idx + 1)}
                      className="mt-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 flex items-center gap-1"
                    >
                      לשאלה הבאה <ChevronLeft size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
