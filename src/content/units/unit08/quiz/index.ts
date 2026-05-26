import type { ComprehensionQ } from "../../../../types";
import { unit08Application } from "./application";

export const unit08Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit08Application,
};

export const unit08ExamBank: ComprehensionQ[] = [...unit08Application];
