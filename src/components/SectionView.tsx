import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { RichSection } from "../types";
import { RichLine } from "./RichText";
import InlineCheck from "./InlineCheck";

const CALLOUT_BG: Record<string, string> = {
  blue: "bg-brand-50/80 dark:bg-brand-950/30 border-brand-300/50 dark:border-brand-700/40 text-brand-900 dark:text-brand-100",
  yellow: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/50 dark:border-amber-700/40 text-amber-900 dark:text-amber-100",
  purple: "bg-violet-50/80 dark:bg-violet-950/30 border-violet-300/50 dark:border-violet-700/40 text-violet-900 dark:text-violet-100",
  green: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/50 dark:border-emerald-700/40 text-emerald-900 dark:text-emerald-100",
};

export default function SectionView({ section, index }: { section: RichSection; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 sm:p-7"
    >
      {/* Heading */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-soft">
          <BookOpen size={18} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
            סקשן {index}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {section.heading}
          </h2>
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-3.5">
        {section.paragraphs.map((para, i) => (
          <RichLine key={i} segments={para} />
        ))}
      </div>

      {/* Quote */}
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

      {/* Table */}
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

      {/* Callout */}
      {section.callout && (
        <div className={`mt-5 rounded-2xl border-2 p-4 ${CALLOUT_BG[section.callout.color]}`}>
          {section.callout.title && <div className="font-bold mb-1.5">{section.callout.title}</div>}
          <p className="text-[14px] leading-[1.8]">{section.callout.text}</p>
        </div>
      )}

      {/* Comprehension Checks (inline questions) */}
      {section.comprehensionChecks && section.comprehensionChecks.length > 0 && (
        <div className="mt-2">
          {section.comprehensionChecks.map((q, i) => (
            <InlineCheck key={q.id || i} q={q} index={i + 1} />
          ))}
        </div>
      )}
    </motion.article>
  );
}
