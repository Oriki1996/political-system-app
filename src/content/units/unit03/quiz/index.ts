import type { ComprehensionQ } from "../../../../types";
import { unit03Application } from "./application";
import { unit03Sections } from "../sections";

// No dedicated exam pool yet → build the exam from the validated per-section
// comprehension checks, so this unit has a real, scorable exam.
const fromSections: ComprehensionQ[] = unit03Sections.flatMap((s) => s.comprehensionChecks ?? []);

export const unit03Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit03Application,
};

export const unit03ExamBank: ComprehensionQ[] =
  unit03Application.length > 0 ? [...unit03Application] : fromSections;
