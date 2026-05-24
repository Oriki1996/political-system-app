import type { ComprehensionQ } from "../../../../types";
import { unit02Application } from "./application";

export const unit02Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit02Application,
};

export const unit02ExamBank: ComprehensionQ[] = [...unit02Application];
