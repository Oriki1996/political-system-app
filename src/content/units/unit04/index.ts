import type { Unit } from "../../../types";
import { unit04Meta } from "./meta";
import { unit04Sections } from "./sections";
import { unit04Quiz, unit04ExamBank } from "./quiz";
import { unit04KeyTerms } from "./keyTerms";
import { unit04Parts } from "./parts";

export const unit04: Unit = {
  ...unit04Meta,
  sections: unit04Sections,
  quiz: unit04Quiz,
  examBank: unit04ExamBank,
  keyTerms: unit04KeyTerms,
  parts: unit04Parts,
};
