import type { Unit } from "../../../types";
import { unit02Meta } from "./meta";
import { unit02Sections } from "./sections";
import { unit02Quiz, unit02ExamBank } from "./quiz";
import { unit02KeyTerms } from "./keyTerms";
import { unit02Parts } from "./parts";

export const unit02: Unit = {
  ...unit02Meta,
  sections: unit02Sections,
  quiz: unit02Quiz,
  examBank: unit02ExamBank,
  keyTerms: unit02KeyTerms,
  parts: unit02Parts,
};
