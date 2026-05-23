import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, RotateCcw, Puzzle as PuzzleIcon,
  ChevronLeft, ChevronRight, Sparkles, ExternalLink,
} from "lucide-react";
import type { Puzzle } from "../types";

interface Props {
  puzzles: Puzzle[];
  unitNumber: number;
  onClose: () => void;
  onOpenSection?: (sectionId: string) => void;
}

type PlacementMap = Record<string, string | null>; // blankId -> poolItemId or null

export default function PuzzleMode({ puzzles, unitNumber, onClose, onOpenSection }: Props) {
  const [idx, setIdx] = useState(0);
  const [placement, setPlacement] = useState<PlacementMap>({});
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const current = puzzles[idx];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    // Reset when switching puzzles
    setPlacement({});
    setSelectedPool(null);
    setChecked(false);
  }, [idx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Map of which pool items are placed (so we can disable them in the pool)
  const placedPoolIds = useMemo(
    () => new Set(Object.values(placement).filter((v): v is string => v !== null)),
    [placement],
  );

  function selectPool(poolId: string) {
    if (checked) return;
    setSelectedPool(selectedPool === poolId ? null : poolId);
  }

  function placeAt(blankId: string) {
    if (checked) return;
    if (!selectedPool) {
      // Click on a placed blank → remove
      if (placement[blankId]) {
        setPlacement((p) => ({ ...p, [blankId]: null }));
      }
      return;
    }
    setPlacement((p) => {
      const next = { ...p };
      // Remove the selectedPool from any other blank first
      for (const k of Object.keys(next)) if (next[k] === selectedPool) next[k] = null;
      next[blankId] = selectedPool;
      return next;
    });
    setSelectedPool(null);
  }

  function clearBlank(blankId: string) {
    if (checked) return;
    setPlacement((p) => ({ ...p, [blankId]: null }));
  }

  function check() {
    setChecked(true);
  }

  function reset() {
    setPlacement({});
    setSelectedPool(null);
    setChecked(false);
  }

  // Per-blank correctness
  const blankResult = (blankId: string): "correct" | "wrong" | "empty" => {
    const placedId = placement[blankId];
    if (!placedId) return "empty";
    const blank = current.blanks.find((b) => b.id === blankId);
    if (!blank) return "empty";
    return blank.acceptIds.includes(placedId) ? "correct" : "wrong";
  };

  const allFilled = current.blanks.every((b) => placement[b.id]);
  const correctCount = current.blanks.filter((b) => blankResult(b.id) === "correct").length;
  const totalBlanks = current.blanks.length;
  const isPerfect = checked && correctCount === totalBlanks;

  function getPoolItem(id: string | null) {
    if (!id) return null;
    return current.pool.find((p) => p.id === id) || null;
  }

  return (
    <motion.div
      key="puzzle-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30 overflow-y-auto"
      dir="rtl"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
          >
            <X size={18} /><span>סגור</span>
          </button>
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-sm">
            <PuzzleIcon size={18} />
            <span>פאזלי קייס · יחידה {String(unitNumber).padStart(2, "0")}</span>
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
            {idx + 1} <span className="text-slate-300 dark:text-slate-600">/</span> {puzzles.length}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">
        {/* Title + context */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
            {current.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">{current.context}</p>

          {/* Puzzle paragraph */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-[15px] leading-[2.2] text-slate-800 dark:text-slate-100">
              {current.template.map((seg, i) => {
                if (typeof seg === "string") return <span key={i}>{seg}</span>;
                const blankId = seg.blankId;
                const placedId = placement[blankId];
                const pool = getPoolItem(placedId);
                const result = blankResult(blankId);
                const idx = current.blanks.findIndex((b) => b.id === blankId);

                const bg =
                  checked && result === "correct"
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100"
                    : checked && result === "wrong"
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100"
                      : placedId
                        ? "border-brand-400 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100"
                        : selectedPool
                          ? "border-violet-400 bg-violet-50/60 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 cursor-pointer animate-pulse"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-pointer";

                return (
                  <span key={i} className="inline-block">
                    <button
                      type="button"
                      onClick={() => placeAt(blankId)}
                      className={`inline-flex items-center gap-1.5 mx-1 px-2.5 py-1 rounded-lg border-2 border-dashed font-medium text-[13px] ${bg} transition-all`}
                    >
                      {placedId && pool ? (
                        <>
                          <span className="text-[10px] font-bold opacity-60">{idx + 1}.</span>
                          <span>{pool.text}</span>
                          {!checked && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); clearBlank(blankId); }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.stopPropagation(); clearBlank(blankId); }
                              }}
                              className="opacity-50 hover:opacity-100 cursor-pointer"
                              aria-label="הסר משבצת"
                            >
                              <X size={11} />
                            </span>
                          )}
                          {checked && result === "correct" && <Check size={12} />}
                          {checked && result === "wrong" && <X size={12} />}
                        </>
                      ) : (
                        <>
                          <span className="font-bold">[{idx + 1}]</span>
                          <span className="text-[11px] opacity-70">לחץ למילוי</span>
                        </>
                      )}
                    </button>
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* Pool */}
        {!checked && (
          <div className="bg-white dark:bg-slate-900/80 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">בחר מהמאגר</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                לחץ על אפשרות → לחץ על משבצת בטקסט
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {current.pool.map((p) => {
                const isPlaced = placedPoolIds.has(p.id);
                const isSelected = selectedPool === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPool(p.id)}
                    disabled={isPlaced}
                    className={`text-right p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      isPlaced
                        ? "border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "border-violet-500 bg-violet-100 dark:bg-violet-950/40 text-violet-900 dark:text-violet-100 shadow-md"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-violet-400 hover:bg-violet-50/40 dark:hover:bg-violet-950/20 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="leading-relaxed flex-1">{p.text}</span>
                      {isPlaced && <Check size={12} className="text-slate-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Check / Result */}
        {!checked ? (
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm shadow-sm"
            >
              <ChevronRight size={16} />
              <span>פאזל קודם</span>
            </button>
            <button
              onClick={check}
              disabled={!allFilled}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Check size={16} />
              <span>{allFilled ? "בדוק תשובה" : `צריך למלא עוד ${totalBlanks - Object.values(placement).filter(Boolean).length} משבצות`}</span>
            </button>
            <button
              onClick={() => setIdx((i) => Math.min(puzzles.length - 1, i + 1))}
              disabled={idx >= puzzles.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm shadow-sm"
            >
              <span>פאזל הבא</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl shadow-sm border-2 p-6 ${
                isPerfect
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700"
                  : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700"
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-4xl mb-1">{isPerfect ? "🎯" : "🔄"}</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {correctCount} / {totalBlanks} נכונים
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {isPerfect ? "מצוין — קוהרנציה לוגית מושלמת" : "כדאי לחזור ולקרוא את הקטע במקור"}
                </div>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/60 border border-brand-200 dark:border-brand-800/50 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold mb-1">
                  <Sparkles size={12} /> הסבר
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{current.rationale}</p>
                {current.sectionRef && onOpenSection && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSection(current.sectionRef!.sectionId);
                    }}
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 transition-colors"
                  >
                    <ExternalLink size={12} />
                    חזרה לקטע המקורי
                  </button>
                )}
              </div>
              <div className="flex gap-2 justify-center mt-5">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm hover:border-brand-300 transition-colors"
                >
                  <RotateCcw size={14} /> נסה שוב
                </button>
                {idx < puzzles.length - 1 && (
                  <button
                    onClick={() => setIdx((i) => i + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-600 text-white font-bold text-sm hover:shadow-lg transition-shadow"
                  >
                    <span>פאזל הבא</span>
                    <ChevronLeft size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Puzzle dots */}
        <div className="flex flex-wrap gap-1.5 justify-center pt-3">
          {puzzles.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all ${
                i === idx
                  ? "bg-violet-600 text-white ring-2 ring-violet-300 dark:ring-violet-700"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
