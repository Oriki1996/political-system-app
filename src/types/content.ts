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

export type QuestionLevel = "recall" | "critical" | "integration";

export interface ComprehensionQ {
  id?: string;
  level?: QuestionLevel;
  difficulty?: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correct: number;
  rationale: string;
  optionExplanations?: string[];
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

export interface RichSection {
  id: string;
  heading: string;
  intro?: string;             // optional sub-heading or single intro line
  paragraphs: RichSegment[][];
  callout?: CalloutBlock;
  quote?: QuoteBlock;
  table?: TableBlock;
  comprehensionChecks?: ComprehensionQ[];
}

export interface KeyTerm {
  id: string;
  term: string;
  english?: string;
  definition: string;
  category: SemanticTag;
}
