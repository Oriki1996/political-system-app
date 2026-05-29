import type { ComprehensionQ } from "../../../../types";
import { unit03Application } from "./application";

export const unit03Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit03Application,
};

export const unit03ExamBank: ComprehensionQ[] = [...unit03Application];
