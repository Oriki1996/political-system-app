import { motion } from "framer-motion";
import { Brain, Check, Circle, MessageSquareQuote, BookOpen, Quote } from "lucide-react";
import type { RichSection } from "../types";

export interface SectionCardItem {
  section: RichSection;
  visited: boolean;
  /** 1-based number to display on the card. */
  displayNumber: number;
}

interface SectionCardListProps {
  items: SectionCardItem[];
  onSelect: (index: number) => void;
  /** Tailwind gradient classes for the part (e.g. "from-emerald-500 to-teal-600") — used as left accent. */
  accentGradient?: string;
}

/**
 * Vertical card list — replacement for Honeycomb.
 * Each card shows: number, heading, TLDR preview, metadata (questions/quote/comparison), visited status.
 */
export default function SectionCardList({ items, onSelect, accentGradient }: SectionCardListProps) {
  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
      {items.map((it, i) => (
        <SectionCard
          key={it.section.id}
          item={it}
          accentGradient={accentGradient}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

function SectionCard({
  item,
  accentGradient,
  onClick,
}: {
  item: SectionCardItem;
  accentGradient?: string;
  onClick: () => void;
}) {
  const { section, visited, displayNumber } = item;
  const questionCount = section.comprehensionChecks?.length ?? 0;
  const hasQuote = !!section.quote;
  const hasComparison = !!section.comparison;
  const hasCallout = !!section.callout;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={[
        "group text-right w-full",
        "rounded-2xl border border-slate-200/70 dark:border-slate-800/60",
        "bg-white dark:bg-slate-900/40",
        "overflow-hidden relative",
        "transition-all duration-150",
        "hover:shadow-soft hover:border-brand-400/60 dark:hover:border-brand-500/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        visited ? "ring-1 ring-emerald-300/50 dark:ring-emerald-700/40" : "",
      ].join(" ")}
      aria-label={`קטע ${displayNumber}: ${section.heading}${visited ? " (נלמד)" : ""}`}
    >
      {/* Right accent strip (RTL) */}
      <div
        className={[
          "absolute top-0 bottom-0 right-0 w-1.5",
          visited
            ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
            : `bg-gradient-to-b ${accentGradient ?? "from-brand-400 to-brand-600"}`,
        ].join(" ")}
        aria-hidden="true"
      />

      <div className="p-4 pr-5 flex items-start gap-3">
        {/* Number / Check badge */}
        <div
          className={[
            "shrink-0 w-10 h-10 rounded-full grid place-items-center font-extrabold text-sm",
            "transition-colors",
            visited
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 group-hover:text-brand-700 dark:group-hover:text-brand-200",
          ].join(" ")}
          aria-hidden="true"
        >
          {visited ? <Check size={18} strokeWidth={3} /> : displayNumber}
        </div>

        <div className="flex-1 min-w-0">
          {/* Heading */}
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-[14.5px] leading-snug">
            {section.heading}
          </h4>

          {/* TLDR preview (2-line clamp) */}
          {section.tldr && (
            <p
              className="mt-1.5 text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {section.tldr}
            </p>
          )}

          {/* Metadata row */}
          <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            {questionCount > 0 && (
              <span className="inline-flex items-center gap-1 font-bold">
                <Brain size={11} aria-hidden="true" />
                <span>{questionCount} שאלות</span>
              </span>
            )}
            {hasComparison && (
              <span className="inline-flex items-center gap-1" title="טבלת השוואה">
                <BookOpen size={11} aria-hidden="true" />
                <span>השוואה</span>
              </span>
            )}
            {hasQuote && (
              <span className="inline-flex items-center gap-1" title="ציטוט מהמקור">
                <Quote size={11} aria-hidden="true" />
                <span>ציטוט</span>
              </span>
            )}
            {hasCallout && (
              <span className="inline-flex items-center gap-1" title="הערה פדגוגית">
                <MessageSquareQuote size={11} aria-hidden="true" />
                <span>הערה</span>
              </span>
            )}
            <span
              className={[
                "ms-auto inline-flex items-center gap-1 font-bold",
                visited
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500",
              ].join(" ")}
            >
              {visited ? (
                <>
                  <Check size={11} aria-hidden="true" />
                  <span>נלמד</span>
                </>
              ) : (
                <>
                  <Circle size={11} aria-hidden="true" />
                  <span>עוד לא נלמד</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
