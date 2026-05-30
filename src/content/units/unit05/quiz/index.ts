import type { ComprehensionQ } from "../../../../types";
import { unit05Application } from "./application";
import { unit05Sections } from "../sections";

// No dedicated exam pool yet → build the exam from the validated per-section
// comprehension checks, so this unit has a real, scorable exam.
const fromSections: ComprehensionQ[] = unit05Sections.flatMap((s) => s.comprehensionChecks ?? []);

export const unit05Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit05Application,
};

export const unit05ExamBank: ComprehensionQ[] =
  unit05Application.length > 0 ? [...unit05Application] : fromSections;
