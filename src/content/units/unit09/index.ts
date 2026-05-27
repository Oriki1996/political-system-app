import type { Unit } from "../../../types";
import { unit09Meta } from "./meta";
import { unit09Sections } from "./sections";
import { unit09Quiz, unit09ExamBank } from "./quiz";
import { unit09KeyTerms } from "./keyTerms";
import { unit09Parts } from "./parts";

export const unit09: Unit = {
  ...unit09Meta,
  sections: unit09Sections,
  quiz: unit09Quiz,
  examBank: unit09ExamBank,
  keyTerms: unit09KeyTerms,
  parts: unit09Parts,
};
