export type QuestionLevel = "recall" | "critical" | "integration";

export interface Question {
  id: string;
  level: QuestionLevel;
  text: string;
  hint?: string;
  answer: string;
}

export interface ProseBlock {
  type: "heading" | "paragraph" | "callout" | "quote" | "table";
  // heading
  level?: 2 | 3;
  // common
  text?: string;
  // callout
  title?: string;
  color?: "blue" | "yellow" | "purple" | "green";
  // quote
  page?: string;
  source?: string;
  // table
  headers?: string[];
  rows?: string[][];
  rowColors?: (string | null)[];
}

export interface Segment {
  id: string;
  number: number;
  title: string;
  pages: string;        // e.g. "79–82"
  blocks: ProseBlock[];
  questions: Question[];
}

export type UnitStatus = "ready" | "in-progress" | "placeholder";

export interface UnitMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  articles: string[];   // mandatory readings
  status: UnitStatus;
  leadQuestion?: string;
  objectives?: string[];
  segments?: Segment[];
}
