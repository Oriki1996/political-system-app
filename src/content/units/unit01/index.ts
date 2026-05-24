import type { Unit } from "../../../types";
import { unit01Meta } from "./meta";
import { unit01Sections } from "./sections";
import { unit01Quiz, unit01ExamBank } from "./quiz";
import { unit01KeyTerms } from "./keyTerms";
import { unit01Parts } from "./parts";
import { unit01Timeline } from "./timeline";
import { unit01Puzzles } from "./puzzles";

export const unit01: Unit = {
  ...unit01Meta,
  sections: unit01Sections,
  quiz: unit01Quiz,
  examBank: unit01ExamBank,
  keyTerms: unit01KeyTerms,
  puzzles: unit01Puzzles,
  parts: unit01Parts,
  timeline: unit01Timeline,
};
