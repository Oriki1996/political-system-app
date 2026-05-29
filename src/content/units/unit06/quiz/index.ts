import type { ComprehensionQ } from "../../../../types";
import { unit06Application } from "./application";

export const unit06Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit06Application,
};

export const unit06ExamBank: ComprehensionQ[] = [...unit06Application];
