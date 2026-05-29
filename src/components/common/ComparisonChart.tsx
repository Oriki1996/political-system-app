import { motion } from "framer-motion";

export interface ComparisonRow {
  /** Row label (axis being compared) */
  axis: string;
  /** Left column value */
  left: string;
  /** Right column value */
  right: string;
}

interface Props {
  /** Header of left column */
  leftTitle: string;
  /** Optional subtitle */
  leftSubtitle?: string;
  /** Header of right column */
  rightTitle: string;
  rightSubtitle?: string;
  /** Visual color for left column */
  leftColor?: "blue" | "emerald" | "violet" | "amber";
  rightColor?: "blue" | "emerald" | "violet" | "amber";
  rows: ComparisonRow[];
  title?: string;
}

const COLORS = {
  blue: "from-brand-500 to-brand-700",
  emerald: "from-emerald-500 to-emerald-700",
  violet: "from-violet-500 to-violet-700",
  amber: "from-amber-500 to-orange-600",
};

const ROW_COLORS = ["bg-slate-50/80 dark:bg-slate-800/60", "bg-white/60 dark:bg-slate-900/40"];

export default function ComparisonChart({
  leftTitle,
  leftSubtitle,
  rightTitle,
  rightSubtitle,
  leftColor = "blue",
  rightColor = "emerald",
  rows,
  title,
}: Props) {
  return (
    <div className="my-5" dir="rtl">
      {title && (
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-2">
          <span aria-hidden="true">⚖️</span>
          {title}
        </h3>
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-card"
      >
        {/* Headers — full width gradient bar split visually */}
        <div className="grid grid-cols-[1fr_2fr_2fr]">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 text-center font-bold text-xs text-slate-700 dark:text-slate-200">
            ציר
          </div>
          <div className={`bg-gradient-to-l ${COLORS[leftColor]} p-3 text-center`}>
            <div className="font-extrabold text-white text-sm">{leftTitle}</div>
            {leftSubtitle && (
              <div className="text-[11px] text-white/90 mt-0.5">{leftSubtitle}</div>
            )}
          </div>
          <div className={`bg-gradient-to-l ${COLORS[rightColor]} p-3 text-center`}>
            <div className="font-extrabold text-white text-sm">{rightTitle}</div>
            {rightSubtitle && (
              <div className="text-[11px] text-white/90 mt-0.5">{rightSubtitle}</div>
            )}
          </div>
        </div>
        {/* Rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_2fr_2fr] border-t border-slate-200 dark:border-slate-700 ${ROW_COLORS[i % 2]}`}
          >
            <div className="p-3 text-xs font-bold text-slate-700 dark:text-slate-200 border-l border-slate-200 dark:border-slate-700 flex items-center">
              {row.axis}
            </div>
            <div className="p-3 text-sm text-slate-800 dark:text-slate-100 leading-relaxed border-l border-slate-200 dark:border-slate-700">
              {row.left}
            </div>
            <div className="p-3 text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              {row.right}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
