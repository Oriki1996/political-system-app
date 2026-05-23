import type { RichSection, ComprehensionQ, KeyTerm } from "./content";

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

export interface Unit extends UnitMeta {
  sections?: RichSection[];
  quiz?: {
    recall?: ComprehensionQ[];
    critical?: ComprehensionQ[];
    integration?: ComprehensionQ[];
  };
  keyTerms?: KeyTerm[];
}
