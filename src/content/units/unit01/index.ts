import type { Unit } from "../../../types";
import { unit01Meta } from "./meta";
import { unit01Sections } from "./sections";
import { unit01Quiz } from "./quiz";

export const unit01: Unit = {
  ...unit01Meta,
  sections: unit01Sections,
  quiz: unit01Quiz,
};
