import { motion } from "framer-motion";
import type { Segment } from "../types";
import ProseRenderer from "./Prose";
import QuizQuestion from "./QuizQuestion";

export default function SegmentView({ segment }: { segment: Segment }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 sm:p-7 space-y-2"
    >
      <div className="flex items-baseline gap-3 mb-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="text-xs font-bold text-white bg-gradient-to-br from-brand-500 to-accent-500 px-2.5 py-1 rounded-lg shrink-0">
          קטע {segment.number}
        </div>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {segment.title}
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            מתוך המאמר — עמ' {segment.pages}
          </div>
        </div>
      </div>

      <ProseRenderer blocks={segment.blocks} />

      {segment.questions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            תרגול — שאלות על קטע {segment.number}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            השב מהזיכרון, ורק אחר כך השווה לתשובה לדוגמה.
          </p>
          <div className="space-y-3">
            {segment.questions.map((q, i) => (
              <QuizQuestion key={q.id} question={q} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
