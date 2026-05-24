import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Compass, FileText, ChevronDown, BookOpen,
  Users, Globe2, AlertTriangle, Brain, Layers, Lightbulb,
  GraduationCap, Puzzle as PuzzleIcon, Sparkles, Trophy, Clock,
} from "lucide-react";
import type { Unit, KeyTerm } from "../types";
import Honeycomb, { autoColor, type HoneycombItem } from "./Honeycomb";
import SectionDrawer from "./SectionDrawer";
import TimelineDrawer from "./TimelineDrawer";
import ExamMode from "./ExamMode";
import PuzzleMode from "./PuzzleMode";
import { getMistakeIds, getMistakeCount } from "../lib/mistakes";
import { getUnitScore } from "../lib/scoring";
import { useSettings } from "../lib/settings";
import { timelineForUnit } from "../content/timeline";

const SECTION_ICONS = [Layers, Brain, Users, Globe2, AlertTriangle, BookOpen, Lightbulb, Compass];

export default function UnitView({ unit }: { unit: Unit }) {
  const isPlaceholder = unit.status === "placeholder";
  const sections = unit.sections || [];
  const { settings } = useSettings();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [objectivesOpen, setObjectivesOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [smartOpen, setSmartOpen] = useState(false);
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [scoreTick, setScoreTick] = useState(0);

  const examBank = unit.examBank || [];
  const puzzles = unit.puzzles || [];
  const parts = unit.parts || [];
  const timelineEvents = useMemo(() => timelineForUnit(unit.id), [unit.id]);
  const hasExam = examBank.length > 0;
  const hasPuzzles = puzzles.length > 0;
  const hasParts = parts.length > 0;
  const hasTimeline = timelineEvents.length > 0;

  // Re-check mistakes + listen for score changes
  useEffect(() => {
    setMistakeCount(getMistakeCount(unit.id));
  }, [unit.id, examOpen, smartOpen]);

  useEffect(() => {
    const onChange = () => setScoreTick((t) => t + 1);
    window.addEventListener("psi-score-changed", onChange);
    return () => window.removeEventListener("psi-score-changed", onChange);
  }, []);

  const unitScore = useMemo(
    () => getUnitScore(unit.id, examBank),
    [unit.id, examBank, scoreTick, examOpen, smartOpen],
  );

  const mistakeQuestions = useMemo(() => {
    const ids = getMistakeIds(unit.id);
    return examBank.filter((q) => q.id && ids.includes(q.id));
  }, [unit.id, examBank, smartOpen]);

  // Helper: open a section by id (for "back to section" from exam/puzzle review)
  const openSectionById = (sectionId: string) => {
    const i = sections.findIndex((s) => s.id === sectionId);
    if (i >= 0) {
      setOpenIdx(i);
      setVisited((s) => new Set(s).add(i));
    }
  };

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

  /** For grouped honeycomb: a list of { part, items, indexMap } */
  const partGroups = useMemo(() => {
    if (!hasParts) return [];
    const idToIdx = new Map<string, number>();
    sections.forEach((s, i) => idToIdx.set(s.id, i));
    return parts.map((p) => {
      const groupItems: { item: HoneycombItem; idx: number }[] = [];
      for (const sid of p.sectionIds) {
        const idx = idToIdx.get(sid);
        if (idx !== undefined && honeycombItems[idx]) {
          groupItems.push({ item: honeycombItems[idx], idx });
        }
      }
      const visitedInPart = groupItems.filter((g) => visited.has(g.idx)).length;
      return { part: p, items: groupItems, visitedInPart };
    });
  }, [hasParts, parts, sections, honeycombItems, visited]);

  function openSection(i: number) {
    setOpenIdx(i);
    setVisited((s) => new Set(s).add(i));
  }

  const visitedCount = visited.size;
  const sectionTotal = sections.length;

  return (
    <main id="main" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5" role="main">
      {/* Compact hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
        aria-labelledby="unit-title"
      >
        {unit.heroImage && (
          <div className={`h-28 sm:h-36 bg-gradient-to-bl ${unit.color || "from-brand-500 to-accent-500"} relative`}>
            <img
              src={unit.heroImage}
              alt=""
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-3 right-4 text-white">
              <div className="text-xs font-bold opacity-90">יחידה {String(unit.number).padStart(2, "0")}</div>
              <div id="unit-title" className="text-base font-extrabold drop-shadow">{unit.title}</div>
            </div>
            <div className="absolute top-3 left-4 flex flex-col items-end gap-1">
              {settings.scoringEnabled && unitScore.possible > 0 && (
                <div
                  className="inline-flex items-center gap-1 bg-amber-400/90 text-amber-950 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-extrabold shadow-md"
                  aria-label={`ניקוד יחידה: ${unitScore.earned} מתוך ${unitScore.possible} נקודות`}
                >
                  <Trophy size={11} aria-hidden="true" />
                  <span className="tabular-nums">{unitScore.earned}<span className="opacity-70">/{unitScore.possible}</span></span>
                </div>
              )}
              {sectionTotal > 0 && (
                <div className="text-white/95 text-xs font-bold bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                  {visitedCount} / {sectionTotal} קטעים
                </div>
              )}
            </div>
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
                {hasParts
                  ? `${parts.length} חלקים · ${sectionTotal} קטעים — לחץ על משושה לפתיחה`
                  : "לחץ על משושה — הקטע ייפתח במסך מלא עם שאלות הבנה"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {hasTimeline && (
                <button
                  type="button"
                  onClick={() => setTimelineOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 hover:bg-violet-200 dark:hover:bg-violet-900/60 transition-colors text-xs font-extrabold focus-visible:ring-2 focus-visible:ring-violet-500"
                  aria-label="פתח ציר זמן של היחידה"
                >
                  <Clock size={14} aria-hidden="true" />
                  <span>📅 ציר זמן</span>
                </button>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold">→</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold">←</kbd>
                <span>בין קטעים</span>
              </div>
            </div>
          </div>

          {hasParts ? (
            <div className="space-y-6 mt-4">
              {partGroups.map(({ part, items, visitedInPart }, gi) => (
                <div key={part.id} className="rounded-2xl border border-slate-200/70 dark:border-slate-800/60 p-3 sm:p-4 bg-slate-50/40 dark:bg-slate-900/30">
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50 rounded-full px-2 py-0.5">
                          חלק {gi + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {part.title}
                        </h3>
                      </div>
                      {part.subtitle && (
                        <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">
                          {part.subtitle}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                      {visitedInPart}/{items.length}
                    </span>
                  </div>
                  <Honeycomb
                    items={items.map((g) => g.item)}
                    onSelect={(localIdx) => openSection(items[localIdx].idx)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Honeycomb items={honeycombItems} onSelect={openSection} />
          )}

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

      {/* Practice modes — 3 buttons in a row */}
      {(hasExam || hasPuzzles) && (
        <section className="grid sm:grid-cols-3 gap-3">
          {hasExam && (
            <PracticeButton
              icon={<GraduationCap size={22} />}
              title="מבחן יחידה"
              subtitle={`${examBank.length} שאלות יישום וקייס`}
              gradient="from-amber-500 to-orange-600"
              bg="from-amber-50 to-orange-50/70 dark:from-amber-950/30 dark:to-orange-950/20"
              onClick={() => setExamOpen(true)}
            />
          )}
          <PracticeButton
            icon={<Sparkles size={22} />}
            title="תרגול חכם"
            subtitle={
              mistakeCount > 0
                ? `${mistakeCount} שאלות שטעית בהן — חזור עד שתשלוט`
                : "אין שאלות שטעית בהן עדיין — קודם מבחן"
            }
            gradient="from-sky-500 to-cyan-600"
            bg="from-sky-50 to-cyan-50/70 dark:from-sky-950/30 dark:to-cyan-950/20"
            disabled={mistakeCount === 0}
            onClick={() => setSmartOpen(true)}
          />
          {hasPuzzles && (
            <PracticeButton
              icon={<PuzzleIcon size={22} />}
              title="פאזלי קייס"
              subtitle={`${puzzles.length} פאזלי השלמה — סדר משפטים בקייס`}
              gradient="from-violet-500 to-fuchsia-600"
              bg="from-violet-50 to-fuchsia-50/70 dark:from-violet-950/30 dark:to-fuchsia-950/20"
              onClick={() => setPuzzleOpen(true)}
            />
          )}
        </section>
      )}

      {/* Key terms */}
      {unit.keyTerms && unit.keyTerms.length > 0 && <KeyTermsCard terms={unit.keyTerms} />}

      {/* Section drawer */}
      <SectionDrawer
        section={openIdx !== null ? sections[openIdx] : null}
        index={openIdx ?? 0}
        total={sectionTotal}
        keyTerms={unit.keyTerms}
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

      {/* Timeline drawer */}
      {hasTimeline && (
        <TimelineDrawer
          open={timelineOpen}
          events={timelineEvents}
          unitTitle={unit.title}
          onClose={() => setTimelineOpen(false)}
          onJumpToSection={(sid) => {
            setTimelineOpen(false);
            openSectionById(sid);
          }}
        />
      )}

      {/* Exam overlay */}
      <AnimatePresence>
        {examOpen && hasExam && (
          <ExamMode
            unitId={unit.id}
            unitTitle={unit.title}
            unitNumber={unit.number}
            questions={examBank}
            onClose={() => setExamOpen(false)}
            onOpenSection={openSectionById}
          />
        )}
      </AnimatePresence>

      {/* Smart Practice overlay */}
      <AnimatePresence>
        {smartOpen && mistakeQuestions.length > 0 && (
          <ExamMode
            unitId={unit.id}
            unitTitle={unit.title}
            unitNumber={unit.number}
            questions={mistakeQuestions}
            modeLabel="תרגול חכם · יחידה"
            onClose={() => setSmartOpen(false)}
            onOpenSection={openSectionById}
          />
        )}
      </AnimatePresence>

      {/* Puzzle overlay */}
      <AnimatePresence>
        {puzzleOpen && hasPuzzles && (
          <PuzzleMode
            puzzles={puzzles}
            unitNumber={unit.number}
            onClose={() => setPuzzleOpen(false)}
            onOpenSection={openSectionById}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function PracticeButton({
  icon, title, subtitle, gradient, bg, onClick, disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  bg: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!disabled ? { y: -2 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`card text-right p-5 bg-gradient-to-l ${bg} group transition-all ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-soft cursor-pointer"
      }`}
    >
      <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white grid place-items-center shadow-soft mb-3`}>
        {icon}
      </div>
      <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{subtitle}</p>
    </motion.button>
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
