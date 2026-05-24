import type { ComprehensionQ } from "../../../../types";
import { unit07Application } from "./application";

export const unit07Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit07Application,
};

export const unit07ExamBank: ComprehensionQ[] = [...unit07Application];
