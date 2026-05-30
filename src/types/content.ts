export type SemanticTag =
  | "term"        // מושג / מונח (כחול)
  | "name"        // שם (סגול)
  | "date"        // תאריך / שנה (ירוק)
  | "criterion"   // קריטריון / קביעה מרכזית (ירוק כהה)
  | "warning"     // הסתייגות / זהירות (אדום)
  | "school";     // אסכולה / זרם (טורקיז)

export interface RichSegment {
  text: string;
  tag?: SemanticTag;
}

// Pragmatic, content-honest set (not a forced per-section quota):
// recall = remember/understand · apply = transfer to a new case ·
// critical = analyze/evaluate · integration = synthesize across sources.
export type QuestionLevel = "recall" | "apply" | "critical" | "integration";

/** Pointer to source material — lets the review screen jump back to the section. */
export interface SectionRef {
  /** id of the RichSection (e.g. "u01-s01") */
  sectionId: string;
  /** the exact quote from the section that grounds the correct answer */
  quote?: string;
  /** which paragraph index inside the section (for highlighting later) */
  paragraphIdx?: number;
  /** short tag for grouping in smart-practice ("functional/organic", etc.) */
  topic?: string;
}

export interface ComprehensionQ {
  id?: string;
  level?: QuestionLevel;
  difficulty?: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correct: number;
  rationale: string;
  optionExplanations?: string[];
  /** Where in the unit the answer is grounded — for "back to source" + smart practice. */
  sectionRef?: SectionRef;
}

/** Gap-fill puzzle: case paragraph with N blanks, pool of choices. */
export interface PuzzleBlank {
  /** unique id for this blank inside the puzzle */
  id: string;
  /** ids of pool items that fit this blank correctly (usually one) */
  acceptIds: string[];
}

export interface PuzzlePoolItem {
  id: string;
  text: string;
  /** optional category label shown after solution reveal */
  category?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  /** Short intro / case context */
  context: string;
  /** Paragraph segments with embedded blanks. Use { blankId: "b1" } for slots. */
  template: Array<string | { blankId: string }>;
  pool: PuzzlePoolItem[];
  blanks: PuzzleBlank[];
  /** Pedagogic explanation after solving */
  rationale: string;
  /** Optional pointer back to a source section. */
  sectionRef?: SectionRef;
}

export interface QuoteBlock {
  text: string;
  page?: string;
  source?: string;
}

export interface TableBlock {
  headers: string[];
  rows: string[][];
}

export interface CalloutBlock {
  title?: string;
  color: "blue" | "yellow" | "purple" | "green";
  text: string;
}

export interface ComparisonBlock {
  title?: string;
  leftTitle: string;
  leftSubtitle?: string;
  rightTitle: string;
  rightSubtitle?: string;
  leftColor?: "blue" | "emerald" | "violet" | "amber";
  rightColor?: "blue" | "emerald" | "violet" | "amber";
  rows: Array<{ axis: string; left: string; right: string }>;
}

export interface RichSection {
  id: string;
  heading: string;
  intro?: string;             // optional sub-heading or single intro line
  /** 2-4 sentence "main point" summary, displayed at top of drawer */
  tldr?: string;
  paragraphs: RichSegment[][];
  callout?: CalloutBlock;
  quote?: QuoteBlock;
  table?: TableBlock;
  /** Optional side-by-side comparison chart */
  comparison?: ComparisonBlock;
  comprehensionChecks?: ComprehensionQ[];
}

export interface KeyTerm {
  id: string;
  term: string;
  english?: string;
  definition: string;
  category: SemanticTag;
  /** strings that, when matched in segment text, trigger glossary tooltip */
  triggers?: string[];
}
