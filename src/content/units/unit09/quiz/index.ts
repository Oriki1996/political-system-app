import type { ComprehensionQ } from "../../../../types";
import { unit09Application } from "./application";

export const unit09Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit09Application,
};

export const unit09ExamBank: ComprehensionQ[] = [...unit09Application];
