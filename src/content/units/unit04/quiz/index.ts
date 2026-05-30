import type { ComprehensionQ } from "../../../../types";
import { unit04Application } from "./application";
import { unit04Sections } from "../sections";

// No dedicated exam pool yet → build the exam from the validated per-section
// comprehension checks, so this unit has a real, scorable exam.
const fromSections: ComprehensionQ[] = unit04Sections.flatMap((s) => s.comprehensionChecks ?? []);

export const unit04Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit04Application,
};

export const unit04ExamBank: ComprehensionQ[] =
  unit04Application.length > 0 ? [...unit04Application] : fromSections;
