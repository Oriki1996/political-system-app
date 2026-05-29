import type { Unit } from "../../../types";
import { unit06Meta } from "./meta";
import { unit06Sections } from "./sections";
import { unit06Quiz, unit06ExamBank } from "./quiz";
import { unit06KeyTerms } from "./keyTerms";
import { unit06Parts } from "./parts";

export const unit06: Unit = {
  ...unit06Meta,
  sections: unit06Sections,
  quiz: unit06Quiz,
  examBank: unit06ExamBank,
  keyTerms: unit06KeyTerms,
  parts: unit06Parts,
};
