import type { ComprehensionQ } from "../../../../types";
import { unit10Application } from "./application";

export const unit10Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit10Application,
};

export const unit10ExamBank: ComprehensionQ[] = [...unit10Application];
