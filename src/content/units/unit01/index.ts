import type { Unit } from "../../../types";
import { unit01Meta } from "./meta";
import { unit01Sections } from "./sections";
import { unit01Quiz, unit01ExamBank } from "./quiz";
import { unit01KeyTerms } from "./keyTerms";

export const unit01: Unit = {
  ...unit01Meta,
  sections: unit01Sections,
  quiz: unit01Quiz,
  examBank: unit01ExamBank,
  keyTerms: unit01KeyTerms,
};
