import type { UnitMeta } from "../types";
import { unit01 } from "./units/unit01";

const placeholders: UnitMeta[] = [
  { id: "unit02", number: 2, title: "מושגים וגישות לחקר הפוליטיקה והחברה הישראלית", subtitle: "שלו 2006 — עת לתיאוריה", articles: ["שלו 2006"], status: "placeholder" },
  { id: "unit03", number: 3, title: "תקופת היישוב", subtitle: "נתניהו ב' (ז'בוטינסקי) + שפירא 1998", articles: ["נתניהו, זאב ז'בוטינסקי", "שפירא 1998"], status: "placeholder" },
  { id: "unit04", number: 4, title: "צמיחתה של המדינה החזקה", subtitle: "חריס 1997 + שלו 1994", articles: ["חריס 1997", "שלו 1994"], status: "placeholder" },
  { id: "unit05", number: 5, title: "המהפך 1977", subtitle: "גולדשטיין 2011 — בגין", articles: ["גולדשטיין 2011"], status: "placeholder" },
  { id: "unit06", number: 6, title: "המפנה הניאו-ליברלי והמהפכה החוקתית", subtitle: "מנדלקרן, מאוטנר, ספיר, קרמפף", articles: ["מאוטנר 1994", "מנדלקרן 2015", "ספיר 2009", "קרמפף 2018"], status: "placeholder" },
  { id: "unit07", number: 7, title: "תהליך אוסלו והתמוטטות תנועת העבודה", subtitle: "גוטוויין 2000 + גרינברג 2000", articles: ["גוטוויין 2000", "גרינברג 2000"], status: "placeholder" },
  { id: "unit08", number: 8, title: "התגבשות המערכת המפלגתית הערבית", subtitle: "בשארה 1996", articles: ["בשארה 1996"], status: "placeholder" },
  { id: "unit09", number: 9, title: "התבססות הימין בשלטון", subtitle: "Sorek & Ceobanu 2021 + גוטוויין 2016", articles: ["Sorek & Ceobanu 2021", "גוטוויין 2016"], status: "placeholder" },
  { id: "unit10", number: 10, title: "המשבר הפוליטי 2019-2022", subtitle: "נבות וגולדשמידט", articles: ["נבות וגולדשמידט"], status: "placeholder" },
];

export const UNITS: UnitMeta[] = [unit01, ...placeholders];
