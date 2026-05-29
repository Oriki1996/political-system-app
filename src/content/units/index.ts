import type { Unit, UnitMeta } from "../../types";
import { unit01 } from "./unit01";
import { unit02 } from "./unit02";
import { unit03 } from "./unit03";
import { unit04 } from "./unit04";
import { unit05 } from "./unit05";
import { unit07 } from "./unit07";
import { unit08 } from "./unit08";
import { unit09 } from "./unit09";
import { unit10 } from "./unit10";

const PALETTE = [
  "from-sky-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-fuchsia-600",
  "from-slate-500 to-slate-700",
  "from-yellow-500 to-amber-600",
  "from-red-500 to-rose-700",
  "from-purple-500 to-indigo-700",
];

function placeholder(num: number, title: string, subtitle: string, articles: string[]): UnitMeta {
  const id = `unit${String(num).padStart(2, "0")}`;
  return {
    id,
    number: num,
    title,
    subtitle,
    articles,
    status: "placeholder",
    heroImage: `/topics/${id}.svg`,
    color: PALETTE[(num - 1) % PALETTE.length],
  };
}

const placeholders: Unit[] = [
  placeholder(6, "המפנה הניאו-ליברלי והמהפכה החוקתית", "מנדלקרן · מאוטנר · ספיר · קרמפף", ["מאוטנר 1994", "מנדלקרן 2015", "ספיר 2009", "קרמפף 2018"]),
];

const sorted: Unit[] = [unit01, unit02, unit03, unit04, unit05, unit07, unit08, unit09, unit10, ...placeholders].sort(
  (a, b) => a.number - b.number,
);

export const UNITS: Unit[] = sorted;
