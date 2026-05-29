import type { Unit } from "../../../types";
import { unit05Meta } from "./meta";
import { unit05Sections } from "./sections";
import { unit05Quiz, unit05ExamBank } from "./quiz";
import { unit05KeyTerms } from "./keyTerms";
import { unit05Parts } from "./parts";

export const unit05: Unit = {
  ...unit05Meta,
  sections: unit05Sections,
  quiz: unit05Quiz,
  examBank: unit05ExamBank,
  keyTerms: unit05KeyTerms,
  parts: unit05Parts,
};
