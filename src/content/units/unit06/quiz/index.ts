import type { ComprehensionQ } from "../../../../types";
import { unit06Application } from "./application";
import { unit06Sections } from "../sections";

// No dedicated exam pool yet → build the exam from the validated per-section
// comprehension checks, so this unit has a real, scorable exam.
const fromSections: ComprehensionQ[] = unit06Sections.flatMap((s) => s.comprehensionChecks ?? []);

export const unit06Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit06Application,
};

export const unit06ExamBank: ComprehensionQ[] =
  unit06Application.length > 0 ? [...unit06Application] : fromSections;
