import type { ComprehensionQ } from "../../../../types";
import { unit04Application } from "./application";

export const unit04Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit04Application,
};

export const unit04ExamBank: ComprehensionQ[] = [...unit04Application];
