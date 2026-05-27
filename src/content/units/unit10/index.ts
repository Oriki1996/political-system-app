import type { Unit } from "../../../types";
import { unit10Meta } from "./meta";
import { unit10Sections } from "./sections";
import { unit10Quiz, unit10ExamBank } from "./quiz";
import { unit10KeyTerms } from "./keyTerms";
import { unit10Parts } from "./parts";

export const unit10: Unit = {
  ...unit10Meta,
  sections: unit10Sections,
  quiz: unit10Quiz,
  examBank: unit10ExamBank,
  keyTerms: unit10KeyTerms,
  parts: unit10Parts,
};
