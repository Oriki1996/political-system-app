import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Target, Compass, FileText, ChevronDown, BookOpen,
  Users, Globe2, AlertTriangle, Brain, Layers, Lightbulb,
} from "lucide-react";
import type { Unit, KeyTerm } from "../types";
import Honeycomb, { autoColor, type HoneycombItem } from "./Honeycomb";
import SectionDrawer from "./SectionDrawer";

const SECTION_ICONS = [Layers, Brain, Users, Globe2, AlertTriangle, BookOpen, Lightbulb, Compass];

export default function UnitView({ unit }: { unit: Unit }) {
  const isPlaceholder = unit.status === "placeholder";
  const sections = unit.sections || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [objectivesOpen, setObjectivesOpen] = useState(false);

  const honeycombItems: HoneycombItem[] = useMemo(
    () =>
      sections.map((s, i) => ({
        title: s.heading.replace(/—.*$/, "").trim(),
        subtitle: undefined,
        color: autoColor(i),
        Icon: SECTION_ICONS[i % SECTION_ICONS.length],
        status: (visited.has(i) ? "read" : "unread") as "read" | "unread",
      })),
    [sections, visited],
  );

  function openSection(i: number) {
    setOpenIdx(i);
    setVisited((s) => new Set(s).add(i));
  }

  const visitedCount = visited.size;
  const sectionTotal = sections.length;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Compact hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {unit.heroImage && (
          <div className={`h-28 sm:h-36 bg-gradient-to-bl ${unit.color || "from-brand-500 to-accent-500"} relative`}>
            <img
              src={unit.heroImage}
              alt=""
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 right-4 text-white">
              <div className="text-xs font-bold opacity-90">יחידה {String(unit.number).padStart(2, "0")}</div>
              <div className="text-base font-extrabold drop-shadow">{unit.title}</div>
            </div>
            {sectionTotal > 0 && (
              <div className="absolute top-3 left-4 text-white/95 text-xs font-bold bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                {visitedCount} / {sectionTotal} קטעים
              </div>
            )}
          </div>
        )}
        <div className="p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">{unit.subtitle}</p>
          <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <FileText size={12} className="mt-0.5 shrink-0" />
            <span><b>מאמרי חובה:</b> {unit.articles.join(" · ")}</span>
          </div>
        </div>
      </motion.section>

      {/* Lead question + objectives (compact, collapsible) */}
      {(unit.leadQuestion || unit.objectives) && (
        <section className="card p-5 space-y-3">
          {unit.leadQuestion && (
            <div className="flex items-start gap-3">
              <Compass className="text-accent-600 dark:text-accent-400 shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <div className="text-xs font-bold text-accent-700 dark:text-accent-300 mb-0.5">שאלת-העל של היחידה</div>
                <p className="text-[14px] italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  {unit.leadQuestion}
                </p>
              </div>
            </div>
          )}
          {unit.objectives && unit.objectives.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => setObjectivesOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 text-right"
              >
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {objectivesOpen ? "הסתר מטרות" : `בסיום היחידה תוכל ל… (${unit.objectives.length})`}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${objectivesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {objectivesOpen && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 space-y-1.5 text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed pr-1"
                >
                  {unit.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* Honeycomb of sections */}
      {sections.length > 0 ? (
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">בחר קטע לימוד</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                לחץ על משושה — הקטע ייפתח במסך מלא עם שאלות הבנה
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold">→</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold">←</kbd>
              <span>בין קטעים</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold">Esc</kbd>
              <span>סגירה</span>
            </div>
          </div>

          <Honeycomb items={honeycombItems} onSelect={openSection} />

          {visitedCount > 0 && (
            <div className="mt-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-brand-500 to-accent-500 transition-all"
                    style={{ width: `${(visitedCount / sectionTotal) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                  {visitedCount}/{sectionTotal}
                </span>
              </div>
            </div>
          )}
        </section>
      ) : isPlaceholder ? (
        <section className="card p-8 text-center">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1.5">היחידה בתהליך בנייה</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            התוכן יתווסף בסשנים הבאים, לפי סדר הסילבוס.
          </p>
        </section>
      ) : null}

      {/* Key terms */}
      {unit.keyTerms && unit.keyTerms.length > 0 && <KeyTermsCard terms={unit.keyTerms} />}

      {/* Section drawer */}
      <SectionDrawer
        section={openIdx !== null ? sections[openIdx] : null}
        index={openIdx ?? 0}
        total={sectionTotal}
        onClose={() => setOpenIdx(null)}
        onPrev={() => {
          if (openIdx !== null && openIdx > 0) {
            const next = openIdx - 1;
            setOpenIdx(next);
            setVisited((s) => new Set(s).add(next));
          }
        }}
        onNext={() => {
          if (openIdx !== null && openIdx < sectionTotal - 1) {
            const next = openIdx + 1;
            setOpenIdx(next);
            setVisited((s) => new Set(s).add(next));
          }
        }}
      />
    </main>
  );
}

function KeyTermsCard({ terms }: { terms: KeyTerm[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="card p-5">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-2 text-right">
        <div className="flex items-center gap-2">
          <span className="text-base">🔑</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            מושגי מפתח ({terms.length})
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 grid sm:grid-cols-2 gap-3 overflow-hidden"
        >
          {terms.map((kt) => (
            <div
              key={kt.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/60 dark:bg-slate-900/40"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-bold ${"hl-" + kt.category}`}>{kt.term}</span>
                {kt.english && <span className="text-xs text-slate-400">{kt.english}</span>}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">{kt.definition}</p>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
