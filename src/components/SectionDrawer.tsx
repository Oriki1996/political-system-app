import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { useEffect } from "react";
import type { RichSection, KeyTerm } from "../types";
import { RichLine } from "./RichText";
import InlineCheckGallery from "./InlineCheckGallery";
import ComparisonChart from "./ComparisonChart";

interface SectionDrawerProps {
  section: RichSection | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  keyTerms?: KeyTerm[];
}

const CALLOUT_BG: Record<string, string> = {
  blue: "bg-brand-50/80 dark:bg-brand-950/30 border-brand-300/50 dark:border-brand-700/40 text-brand-900 dark:text-brand-100",
  yellow: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/50 dark:border-amber-700/40 text-amber-900 dark:text-amber-100",
  purple: "bg-violet-50/80 dark:bg-violet-950/30 border-violet-300/50 dark:border-violet-700/40 text-violet-900 dark:text-violet-100",
  green: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/50 dark:border-emerald-700/40 text-emerald-900 dark:text-emerald-100",
};

export default function SectionDrawer({ section, index, total, onClose, onPrev, onNext, keyTerms }: SectionDrawerProps) {
  useEffect(() => {
    if (section) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [section]);

  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onPrev();
      else if (e.key === "ArrowLeft") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key="section-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40 overflow-y-auto"
          dir="rtl"
        >
          {/* sticky top bar */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
                aria-label="חזרה לכוורת"
              >
                <X size={18} />
                <span>חזרה לכוורת</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={index === 0}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="קטע קודם"
                  title="חץ ימינה"
                >
                  <ChevronRight size={20} />
                </button>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tabular-nums select-none px-1">
                  {index + 1} <span className="text-slate-300 dark:text-slate-600">/</span> {total}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={index >= total - 1}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="קטע הבא"
                  title="חץ שמאלה"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
            <div className="h-1 bg-slate-100 dark:bg-slate-800">
              <motion.div
                key={index}
                initial={{ width: 0 }}
                animate={{ width: `${((index + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-l from-brand-500 via-accent-500 to-cyan-500"
              />
            </div>
          </div>

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs font-extrabold mb-4">
              <BookOpen size={12} />
              קטע {index + 1} מתוך {total}
            </div>

            <div className="bg-white dark:bg-slate-900/80 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                {section.heading}
              </h2>

              {section.tldr && (
                <div className="mb-5 rounded-2xl border-2 border-amber-300/70 dark:border-amber-600/50 bg-gradient-to-bl from-amber-50 to-yellow-50/60 dark:from-amber-950/40 dark:to-yellow-950/30 p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-800 dark:text-amber-200">
                    <Lightbulb size={16} aria-hidden="true" />
                    <span className="text-xs font-extrabold uppercase tracking-wide">הנקודה המרכזית</span>
                  </div>
                  <p className="text-[15px] leading-[1.85] text-slate-800 dark:text-slate-100 font-medium">
                    {section.tldr}
                  </p>
                </div>
              )}

              <div className="space-y-3.5">
                {section.paragraphs.map((para, i) => (
                  <RichLine key={i} segments={para} keyTerms={keyTerms} />
                ))}
              </div>

              {section.comparison && (
                <ComparisonChart
                  title={section.comparison.title}
                  leftTitle={section.comparison.leftTitle}
                  leftSubtitle={section.comparison.leftSubtitle}
                  rightTitle={section.comparison.rightTitle}
                  rightSubtitle={section.comparison.rightSubtitle}
                  leftColor={section.comparison.leftColor}
                  rightColor={section.comparison.rightColor}
                  rows={section.comparison.rows}
                />
              )}

              {section.quote && (
                <figure className="my-5 pr-4 border-r-4 border-brand-400 dark:border-brand-600">
                  <blockquote className="hl-quote leading-[1.9] text-[15px]">"{section.quote.text}"</blockquote>
                  {(section.quote.source || section.quote.page) && (
                    <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                      — {section.quote.source}{section.quote.page ? `, עמ' ${section.quote.page}` : ""}
                    </figcaption>
                  )}
                </figure>
              )}

              {section.table && (
                <div className="overflow-x-auto -mx-2 my-5">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-l from-brand-600 to-accent-600 text-white">
                        {section.table.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 text-right font-semibold first:rounded-r-lg last:rounded-l-lg">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-slate-200/60 dark:border-slate-700/60">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-3 py-2 align-top text-slate-700 dark:text-slate-200 leading-relaxed">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.callout && (
                <div className={`mt-5 rounded-2xl border-2 p-4 ${CALLOUT_BG[section.callout.color]}`}>
                  {section.callout.title && <div className="font-bold mb-1.5">{section.callout.title}</div>}
                  <p className="text-[14px] leading-[1.8]">{section.callout.text}</p>
                </div>
              )}

              {section.comprehensionChecks && section.comprehensionChecks.length > 0 && (
                <InlineCheckGallery questions={section.comprehensionChecks} />
              )}
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 mb-4">
              <button
                type="button"
                onClick={onPrev}
                disabled={index === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-sm shadow-sm"
              >
                <ChevronRight size={16} />
                <span>הקטע הקודם</span>
              </button>
              <button
                type="button"
                onClick={index >= total - 1 ? onClose : onNext}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-brand-600 to-accent-600 text-white hover:shadow-lg transition-shadow font-bold text-sm"
              >
                <span>{index >= total - 1 ? "סיימתי את הקטעים" : "הקטע הבא"}</span>
                <ChevronLeft size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
