import type { Unit } from "../../../types";
import { unit07Meta } from "./meta";
import { unit07Sections } from "./sections";
import { unit07Quiz, unit07ExamBank } from "./quiz";
import { unit07KeyTerms } from "./keyTerms";
import { unit07Parts } from "./parts";

export const unit07: Unit = {
  ...unit07Meta,
  sections: unit07Sections,
  quiz: unit07Quiz,
  examBank: unit07ExamBank,
  keyTerms: unit07KeyTerms,
  parts: unit07Parts,
};
