import type { Unit } from "../../../types";
import { unit08Meta } from "./meta";
import { unit08Sections } from "./sections";
import { unit08Quiz, unit08ExamBank } from "./quiz";
import { unit08KeyTerms } from "./keyTerms";
import { unit08Parts } from "./parts";

export const unit08: Unit = {
  ...unit08Meta,
  sections: unit08Sections,
  quiz: unit08Quiz,
  examBank: unit08ExamBank,
  keyTerms: unit08KeyTerms,
  parts: unit08Parts,
};
