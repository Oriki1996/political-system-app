import type { Unit } from "../../../types";
import { unit03Meta } from "./meta";
import { unit03Sections } from "./sections";
import { unit03Quiz, unit03ExamBank } from "./quiz";
import { unit03KeyTerms } from "./keyTerms";
import { unit03Parts } from "./parts";

export const unit03: Unit = {
  ...unit03Meta,
  sections: unit03Sections,
  quiz: unit03Quiz,
  examBank: unit03ExamBank,
  keyTerms: unit03KeyTerms,
  parts: unit03Parts,
};
