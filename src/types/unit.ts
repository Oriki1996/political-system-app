import type { RichSection, ComprehensionQ, KeyTerm, Puzzle } from "./content";

export type UnitStatus = "ready" | "in-progress" | "placeholder";

export interface UnitMeta {
  id: string;                    // "unit01"
  number: number;                // 1
  title: string;
  subtitle: string;
  articles: string[];            // mandatory readings
  status: UnitStatus;
  heroImage?: string;            // /topics/unit01.svg
  color?: string;                // tailwind gradient e.g. "from-sky-500 to-indigo-500"
  leadQuestion?: string;
  objectives?: string[];
}

export interface UnitPart {
  /** Stable id e.g. "part-1" */
  id: string;
  /** Display title e.g. "מבוא והתפיסות" */
  title: string;
  /** Short summary one-liner */
  subtitle?: string;
  /** Section ids in this part (e.g. ["u01-s01", "u01-s02", ...]) */
  sectionIds: string[];
}

export interface TimelineEvent {
  year: string;
  label: string;
  description?: string;
  /** Category for color coding */
  category?: "functional" | "organic" | "synthesis" | "crisis" | "general";
  /** Section the event references (e.g. "u01-s17"). Used for "jump to section" + filtering by unit. */
  sectionRef?: string;
  /** Unit id the event belongs to (e.g. "unit01"). Derived from sectionRef when omitted. */
  unitId?: string;
}

export interface Unit extends UnitMeta {
  sections?: RichSection[];
  quiz?: {
    application?: ComprehensionQ[];
    recall?: ComprehensionQ[];
    critical?: ComprehensionQ[];
    integration?: ComprehensionQ[];
  };
  /** Combined exam pool — random sampling for unit exam */
  examBank?: ComprehensionQ[];
  keyTerms?: KeyTerm[];
  /** Gap-fill puzzles for case-application practice */
  puzzles?: Puzzle[];
  /** Pedagogical grouping of sections into 3-5 parts */
  parts?: UnitPart[];
}
