import type { ComprehensionQ } from "../../../../types";
import { unit01Application } from "./application";

// בנק שאלות מבחן ליחידה.
// application = שאלות יישום וקייס לבחינה אמריקאית.
// בעתיד נוסיף knowledge / cases-extended / final.
export const unit01Quiz: {
  application: ComprehensionQ[];
  recall?: ComprehensionQ[];
  critical?: ComprehensionQ[];
  integration?: ComprehensionQ[];
} = {
  application: unit01Application,
};

// כל השאלות הזמינות למבחן יחידה (אפשר להוסיף מאגרים בעתיד)
export const unit01ExamBank: ComprehensionQ[] = [...unit01Application];
