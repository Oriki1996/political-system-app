import type { ComprehensionQ } from "../../../../types";
import { unit05Application } from "./application";

export const unit05Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit05Application,
};

export const unit05ExamBank: ComprehensionQ[] = [...unit05Application];
