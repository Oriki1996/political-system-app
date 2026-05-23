import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, GraduationCap,
  Check, RotateCcw, Trophy, Flag, AlertCircle,
} from "lucide-react";
import type { ComprehensionQ } from "../types";

interface ExamModeProps {
  unitTitle: string;
  unitNumber: number;
  questions: ComprehensionQ[];
  /** how many questions to draw from the bank for one exam attempt. Default = all */
  examSize?: number;
  onClose: () => void;
}

type Phase = "in-progress" | "submitted";

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamMode({ unitTitle, unitNumber, questions, examSize, onClose }: ExamModeProps) {
  // Build the exam: random subset of N questions in random order
  const examQuestions = useMemo(() => {
    const pool = shuffleArr(questions);
    return examSize ? pool.slice(0, examSize) : pool;
  }, [questions, examSize]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<Phase>("in-progress");
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Keyboard: Esc to close, arrows for nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (phase === "submitted" || answeredCount === 0) onClose();
        else setConfirmSubmit(true);
      } else if (phase === "in-progress") {
        if (e.key === "ArrowRight" && idx > 0) setIdx((i) => i - 1);
        if (e.key === "ArrowLeft" && idx < examQuestions.length - 1) setIdx((i) => i + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, idx, examQuestions.length]);

  const q = examQuestions[idx];
  const total = examQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  // Score calculation
  const correctCount = useMemo(
    () => examQuestions.reduce((n, qq, i) => n + (answers[i] === qq.correct ? 1 : 0), 0),
    [examQuestions, answers],
  );
  const scorePercent = Math.round((correctCount / total) * 100);

  function pick(option: number) {
    setAnswers((a) => ({ ...a, [idx]: option }));
  }

  function submit() {
    setConfirmSubmit(false);
    setPhase("submitted");
    setIdx(0);
  }

  function reset() {
    setAnswers({});
    setIdx(0);
    setPhase("in-progress");
  }

  return (
    <motion.div
      key="exam-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/30 overflow-y-auto"
      dir="rtl"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => (phase === "submitted" || answeredCount === 0 ? onClose() : setConfirmSubmit(true))}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
            aria-label="סגור מבחן"
          >
            <X size={18} />
            <span>{phase === "submitted" ? "סגור" : "יציאה"}</span>
          </button>

          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
            <GraduationCap size={18} />
            <span>מבחן יחידה {String(unitNumber).padStart(2, "0")}</span>
          </div>

          {phase === "in-progress" ? (
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
              {idx + 1} <span className="text-slate-300 dark:text-slate-600">/</span> {total}
              <span className="text-slate-400 mx-1.5">·</span>
              {answeredCount}/{total} ענית
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
              ציון: {correctCount}/{total} ({scorePercent}%)
            </div>
          )}
        </div>
        {/* Progress */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${phase === "submitted" ? 100 : (answeredCount / total) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`h-full bg-gradient-to-l ${
              phase === "submitted"
                ? scorePercent >= 70
                  ? "from-emerald-500 to-green-500"
                  : scorePercent >= 50
                    ? "from-amber-500 to-orange-500"
                    : "from-rose-500 to-red-500"
                : "from-brand-500 to-accent-500"
            }`}
          />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {phase === "in-progress" ? (
          <ExamQuestion
            q={q}
            picked={answers[idx]}
            onPick={pick}
            idx={idx}
            total={total}
            unitTitle={unitTitle}
          />
        ) : (
          <ExamReview
            questions={examQuestions}
            answers={answers}
            scorePercent={scorePercent}
            correctCount={correctCount}
            total={total}
            currentIdx={idx}
            onJump={setIdx}
            onReset={reset}
            onClose={onClose}
          />
        )}
      </div>

      {/* Bottom navigation (in-progress only) */}
      {phase === "in-progress" && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm shadow-sm"
            >
              <ChevronRight size={16} />
              <span>השאלה הקודמת</span>
            </button>

            {idx < total - 1 ? (
              <button
                type="button"
                onClick={() => setIdx((i) => i + 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-brand-600 to-accent-600 text-white hover:shadow-lg transition-shadow font-bold text-sm"
              >
                <span>השאלה הבאה</span>
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (allAnswered ? submit() : setConfirmSubmit(true))}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-shadow ${
                  allAnswered
                    ? "bg-gradient-to-l from-emerald-600 to-emerald-700 text-white hover:shadow-xl"
                    : "bg-gradient-to-l from-amber-500 to-orange-600 text-white hover:shadow-xl"
                }`}
              >
                <Flag size={16} />
                <span>{allAnswered ? "סיים מבחן" : `סיים — דילגת על ${total - answeredCount}`}</span>
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="mt-6 flex flex-wrap gap-1.5 justify-center">
            {examQuestions.map((_, i) => {
              const answered = answers[i] !== undefined;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`עבור לשאלה ${i + 1}`}
                  className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all ${
                    i === idx
                      ? "bg-brand-600 text-white ring-2 ring-brand-300 dark:ring-brand-700"
                      : answered
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm submit modal */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm grid place-items-center px-4"
            onClick={() => setConfirmSubmit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 max-w-md w-full bg-white dark:bg-slate-900"
            >
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {allAnswered ? "סיים את המבחן?" : `דילגת על ${total - answeredCount} שאלות`}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {allAnswered
                      ? "אחרי הסיום לא תוכל לשנות תשובות (אך תוכל להתחיל מבחן חדש)."
                      : `אם תסיים עכשיו, השאלות שלא ענית ייספרו כשגויות. תוכל לבטל ולחזור להשלים, או לסיים בכל זאת.`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={() => setConfirmSubmit(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  ביטול
                </button>
                <button
                  onClick={submit}
                  className="px-4 py-2 rounded-xl bg-gradient-to-l from-emerald-600 to-emerald-700 text-white font-bold hover:shadow-lg transition-shadow text-sm"
                >
                  סיים מבחן
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ----------------------------------------------------------------------

function ExamQuestion({
  q, picked, onPick, idx, total, unitTitle,
}: {
  q: ComprehensionQ;
  picked: number | undefined;
  onPick: (i: number) => void;
  idx: number;
  total: number;
  unitTitle: string;
}) {
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
        שאלה {idx + 1} מתוך {total}
      </div>
      <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-4 truncate">{unitTitle}</div>

      <div className="bg-white dark:bg-slate-900/80 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
        <p className="text-[16px] font-semibold text-slate-900 dark:text-slate-100 leading-[1.85] mb-5">
          {q.question}
        </p>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPick(i)}
                className={`w-full text-right p-3.5 rounded-xl border-2 transition-all text-sm font-medium ${
                  isPicked
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    isPicked
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600"
                  }`}>
                    {String.fromCharCode(1488 + i)}{/* א ב ג ד */}
                  </div>
                  <span className="leading-relaxed flex-1">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------

function ExamReview({
  questions, answers, scorePercent, correctCount, total, currentIdx, onJump, onReset, onClose,
}: {
  questions: ComprehensionQ[];
  answers: Record<number, number>;
  scorePercent: number;
  correctCount: number;
  total: number;
  currentIdx: number;
  onJump: (i: number) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const grade =
    scorePercent >= 90 ? { label: "מצוין", emoji: "🏆", color: "emerald" } :
    scorePercent >= 75 ? { label: "טוב", emoji: "✨", color: "brand" } :
    scorePercent >= 60 ? { label: "עובר", emoji: "📚", color: "amber" } :
    { label: "צריך לחזור", emoji: "🔄", color: "rose" };

  return (
    <div className="space-y-5">
      {/* Score banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900/80 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8 text-center"
      >
        <div className="text-5xl mb-2">{grade.emoji}</div>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-1 tabular-nums">
          {scorePercent}%
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {correctCount} מתוך {total} שאלות נכונות · <b>{grade.label}</b>
        </div>
        <div className="flex gap-2 mt-5 justify-center">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-l from-brand-600 to-accent-600 text-white font-bold text-sm hover:shadow-lg transition-shadow"
          >
            <RotateCcw size={14} /> מבחן חדש
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            סיום
          </button>
        </div>
      </motion.div>

      {/* Per-question review */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base px-1">
          סקירה — כל השאלות
        </h3>
        {questions.map((q, i) => {
          const a = answers[i];
          const isCorrect = a === q.correct;
          const isCurrent = i === currentIdx;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-2xl border-2 p-5 ${
                isCurrent ? "ring-2 ring-brand-400 dark:ring-brand-600" : ""
              } ${
                isCorrect
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
                  : "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50"
              }`}
              onClick={() => onJump(i)}
              role="button"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-7 h-7 rounded-full grid place-items-center shrink-0 ${
                  isCorrect ? "bg-emerald-500" : "bg-rose-500"
                } text-white`}>
                  {isCorrect ? <Check size={14} /> : <X size={14} />}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    שאלה {i + 1} {isCorrect ? "· נכון" : "· שגוי"}
                  </div>
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {q.question}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 mr-10">
                {q.options.map((opt, j) => {
                  const isCorrectOpt = j === q.correct;
                  const isPicked = j === a;
                  return (
                    <div
                      key={j}
                      className={`text-sm p-2.5 rounded-lg border ${
                        isCorrectOpt
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium"
                          : isPicked
                            ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100"
                            : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{String.fromCharCode(1488 + j)}.</span>
                        <span className="flex-1">{opt}</span>
                        {isCorrectOpt && <Check size={14} className="text-emerald-600" />}
                        {isPicked && !isCorrectOpt && <X size={14} className="text-rose-600" />}
                      </div>
                    </div>
                  );
                })}
                {a === undefined && (
                  <div className="text-xs text-amber-700 dark:text-amber-300 font-bold mt-1">
                    ⚠ דילגת על שאלה זו
                  </div>
                )}
              </div>

              {/* Rationale */}
              <div className="mt-4 mr-10 bg-white/70 dark:bg-slate-900/60 border border-brand-100 dark:border-brand-800/40 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1">
                  <Trophy size={12} /> הסבר
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{q.rationale}</p>
              </div>

              {/* Per-option explanation for the user's wrong choice (if any) */}
              {!isCorrect && a !== undefined && q.optionExplanations?.[a] && (
                <div className="mt-2 mr-10 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-200 text-xs font-bold mb-1">
                    <X size={12} /> למה הבחירה שלך אינה נכונה
                  </div>
                  <p className="text-sm text-rose-900 dark:text-rose-100 leading-relaxed">
                    {q.optionExplanations[a]}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
