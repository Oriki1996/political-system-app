import type { Unit, UnitMeta } from "../../types";
import { unit01 } from "./unit01";

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
  placeholder(2, "מושגים וגישות לחקר הפוליטיקה והחברה הישראלית", "שלו 2006 — עת לתיאוריה", ["שלו 2006"]),
  placeholder(3, "תקופת היישוב", "נתניהו ב' (ז'בוטינסקי) + שפירא 1998", ["נתניהו, זאב ז'בוטינסקי", "שפירא 1998"]),
  placeholder(4, "צמיחתה של המדינה החזקה", "חריס 1997 + שלו 1994", ["חריס 1997", "שלו 1994"]),
  placeholder(5, "המהפך 1977", "גולדשטיין 2011 — בגין", ["גולדשטיין 2011"]),
  placeholder(6, "המפנה הניאו-ליברלי והמהפכה החוקתית", "מנדלקרן · מאוטנר · ספיר · קרמפף", ["מאוטנר 1994", "מנדלקרן 2015", "ספיר 2009", "קרמפף 2018"]),
  placeholder(7, "תהליך אוסלו והתמוטטות תנועת העבודה", "גוטוויין 2000 + גרינברג 2000", ["גוטוויין 2000", "גרינברג 2000"]),
  placeholder(8, "התגבשות המערכת המפלגתית הערבית", "בשארה 1996", ["בשארה 1996"]),
  placeholder(9, "התבססות הימין בשלטון", "Sorek & Ceobanu 2021 + גוטוויין 2016", ["Sorek & Ceobanu 2021", "גוטוויין 2016"]),
  placeholder(10, "המשבר הפוליטי 2019-2022", "נבות וגולדשמידט", ["נבות וגולדשמידט"]),
];

export const UNITS: Unit[] = [unit01, ...placeholders];
