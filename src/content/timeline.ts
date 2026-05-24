import type { TimelineEvent } from "../types";

/**
 * Global course timeline. Events from all units appear here in chronological order.
 * Each event MUST have either `unitId` or a `sectionRef` pointing to its source unit
 * (so the UnitView can filter to "events relevant to this unit only").
 */
export const courseTimeline: TimelineEvent[] = [
  // ============= יחידה 01 — התנועה הציונית עד מלה"ע ה-1 =============
  { unitId: "unit01", year: "1862", label: "משה הס: 'רומי וירושלים'", description: "חזון מוקדם של תחייה לאומית יהודית — ראשון ה'אבות המייסדים' שלפני הרצל.", category: "organic" },
  { unitId: "unit01", year: "1881", label: "פינסקר: 'אוטואמנציפציה'", description: "חיבור הרצליאני-במהותו שיצא ברוסיה — דוגמה לחריג שמערער על ההקבלה גיאוגרפיה=תפיסה.", category: "functional", sectionRef: "u01-s04" },
  { unitId: "unit01", year: "1882", label: "הקמת חיבת ציון", description: "התיישבות פילנתרופית בארץ ישראל בלי דרישה למעמד מדיני.", category: "general" },
  { unitId: "unit01", year: "1889", label: "אחד העם: 'לא זה הדרך'; בני משה", description: "חיבור הביכורים של אחד העם + הקמת מסדר חשאי אליטיסטי.", category: "organic", sectionRef: "u01-s16" },
  { unitId: "unit01", year: "1890", label: "בירנבאום טבע 'ציונות'", description: "מבדיל בין 'ציונות' (פוליטי) ל'חיבת ציון' (פילנתרופי).", category: "functional", sectionRef: "u01-s05" },
  { unitId: "unit01", year: "1891", label: "אחד העם: 'עבדות בתוך חירות'", description: "ניתוח של היהודי המתבולל כעבד תרבותי של החברה המארחת.", category: "organic", sectionRef: "u01-s14" },
  { unitId: "unit01", year: "1896", label: "הרצל: 'מדינת היהודים'", description: "החיבור המכונן של הציונות המדינית.", category: "functional", sectionRef: "u01-s07" },
  { unitId: "unit01", year: "1897", label: "קונגרס ציוני ראשון בבזל", description: "תכנית בזל — דרישה ל'בית מולדת מובטח על פי המשפט הפומבי'.", category: "functional", sectionRef: "u01-s10" },
  { unitId: "unit01", year: "1898", label: "נורדאו: 'יהדות השרירים'", description: "נאום בקונגרס השני — תחייה גופנית-לאומית.", category: "functional", sectionRef: "u01-s12" },
  { unitId: "unit01", year: "1901", label: "הקמת קק\"ל; הפראקציה הדמוקרטית", description: "מוסד פיננסי לרכישת אדמות + סיעה אידיאולוגית ראשונה.", category: "general", sectionRef: "u01-s21" },
  { unitId: "unit01", year: "1902", label: "הרצל: 'אלטנוילנד'; ביקורת אחד העם; הקמת המזרחי", description: "הרומן האוטופי של הרצל + תגובת אחד העם החריפה + סיעה דתית-לאומית.", category: "synthesis", sectionRef: "u01-s09" },
  { unitId: "unit01", year: "1903", label: "משבר אוגנדה", description: "הצעה בריטית לטריטוריה במזרח אפריקה — מבחן הציר פונקציונלי/אורגני.", category: "crisis", sectionRef: "u01-s11" },
  { unitId: "unit01", year: "1904", label: "מות הרצל", description: "וולפסון יורש את הנשיאות. תחילת המאבק בין פוליטיים למעשיים.", category: "crisis", sectionRef: "u01-s17" },
  { unitId: "unit01", year: "1905", label: "קונגרס השביעי דוחה אוגנדה; ITO פרשו", description: "זנגוויל וקבוצתו פורשים — פונקציונליסטים טהורים.", category: "crisis", sectionRef: "u01-s11" },
  { unitId: "unit01", year: "1906", label: "ועידת הלסינגפורס; המשרד הארץ-ישראלי", description: "ועידת ציוני רוסיה: סינתזה + Gegenwartsarbeit. הקמת משרד התיישבותי.", category: "synthesis", sectionRef: "u01-s19" },
  { unitId: "unit01", year: "1907", label: "קונגרס שמיני — המעשיים עולים", description: "אוסישקין מוביל את התפנית אל ההתיישבות הפעילה.", category: "general", sectionRef: "u01-s18" },
  { unitId: "unit01", year: "1908", label: "רופין מגיע ליפו; מהפכת הטורקים הצעירים", description: "מודרניזציה של ההתיישבות + כשלון הדיפלומטיה מול הטורקים.", category: "crisis", sectionRef: "u01-s18" },
  { unitId: "unit01", year: "1911", label: "ורבורג נשיא ההסתדרות", description: "ניצחון המעשיים בקונגרס ה-11. אחד העם משתתף כמשקיף.", category: "synthesis", sectionRef: "u01-s18" },
  { unitId: "unit01", year: "1917", label: "הצהרת בלפור", description: "ההצלחה הדיפלומטית הראשונה אחרי 20 שנה — תפקיד מכריע של ויצמן.", category: "functional", sectionRef: "u01-s20" },
  { unitId: "unit01", year: "1920", label: "ויצמן נשיא ההסתדרות הציונית", description: "גילם את מדיניות הסינתזה = הציונות הכללית בגוף.", category: "synthesis", sectionRef: "u01-s20" },
  { unitId: "unit01", year: "1921", label: "קונגרס 12 — 73% ציונים כלליים", description: "שיא הציונות הכללית. ההסתדרות תחת מנדט בריטי.", category: "general", sectionRef: "u01-s21" },
  { unitId: "unit01", year: "1925", label: "הרוויזיוניזם של ז'בוטינסקי נוסד", description: "אופוזיציה לוויצמן — תקיפת מדיניותו ועליית תנועת העבודה.", category: "crisis", sectionRef: "u01-s24" },
  { unitId: "unit01", year: "1931", label: "קונגרס 17 — רק 53% ציונים כלליים", description: "ירידה מהירה. הציונות הכללית מאבדת את המרכזיות הקואליציונית.", category: "general", sectionRef: "u01-s21" },
  { unitId: "unit01", year: "1935", label: "פיצול א/ב בציונים הכלליים", description: "ועידת קרקוב — קבוצה א פייסנית עם ויצמן ועם תנועת העבודה; קבוצה ב באופוזיציה.", category: "crisis", sectionRef: "u01-s21" },
  { unitId: "unit01", year: "1936", label: "ולטש: 'הציונות הכללית'", description: "ההסבר הפילוסופי המעמיק ביותר — 'דרך הביניים היצירתית'.", category: "general", sectionRef: "u01-s23" },

  // ============= יחידה 02 — מושגים וגישות (שלו 2006) =============
  { unitId: "unit02", year: "1973", label: "מלחמת יום הכיפורים", description: "אירוע שסדק את הקונצנזוס הציוני-מפא\"יי ושחרר את הפוטנציאל למחקר סוציולוגי ביקורתי.", category: "crisis", sectionRef: "u02-s06" },
  { unitId: "unit02", year: "1977", label: "המהפך הפוליטי", description: "סוף הגמוניית מפא\"י ועליית הליכוד — סדק הקונצנזוס הציבורי שתמך באסכולה השמרנית.", category: "crisis", sectionRef: "u02-s06" },
  { unitId: "unit02", year: "1989", label: "שפיר: 'Land, Labor and the Origins of the Israeli-Palestinian Conflict'", description: "ספר מכונן בפרדיגמת הקולוניזציה — ניתוח של העלייה השנייה דרך שוק העבודה.", category: "general", sectionRef: "u02-s12" },
  { unitId: "unit02", year: "1992", label: "שלו: 'Labour and the Political Economy in Israel'", description: "ספר מכונן בכלכלה מדינית — ניתוח של ההסתדרות 1920-1985.", category: "general", sectionRef: "u02-s13" },
  { unitId: "unit02", year: "1995", label: "שטרנהל: 'בניין אומה או תיקון חברה'; אורי רם: 'הקהילה הסוציולוגית בישראל'", description: "שני ספרים שאתגרו את האסכולה השמרנית — אחד מבחוץ (שטרנהל) ואחד מבפנים (רם, סוציולוגיה של הידע).", category: "general", sectionRef: "u02-s05" },
  { unitId: "unit02", year: "1996", label: "ליסק: 'ביקורת המבקרים'", description: "התגובה השיטתית הראשונה של האסכולה השמרנית לסוציולוגיה הביקורתית — הופעת המאמר אפשרה לראשונה ויכוח מלומד.", category: "general", sectionRef: "u02-s02" },
  { unitId: "unit02", year: "2006", label: "שלו: 'עת לתיאוריה'", description: "מאמר התשובה של שלו לליסק — טיעון על 'קונצנזוס שמרני' שמסווה גם את הוויכוח עם שטרנהל.", category: "synthesis", sectionRef: "u02-s14" },

  // ============= יחידה 07 — אוסלו והתמוטטות תנועת העבודה =============
  { unitId: "unit07", year: "1992", label: "בחירות 1992 — רבין חוזר לשלטון", description: "מפלגת העבודה מקבלת 44 מנדטים. רבין מקים קואליציה משולשת: עבודה-מרצ + תמיכה חיצונית של המפלגות הערביות + ש\"ס.", category: "synthesis", sectionRef: "u07-s11" },
  { unitId: "unit07", year: "1992", label: "הסכם הליסבון (אוקטובר)", description: "הסכם בהסתדרות שהוסיף גמלאות פנסיוניות לעובדים. מהלך של דמוקרטיזציה כלכלית.", category: "synthesis", sectionRef: "u07-s14" },
  { unitId: "unit07", year: "1993", label: "הסכם אוסלו א'", description: "הכרה הדדית בין ישראל לאש\"פ. שלב ראשון בתהליך הדמוקרטיזציה הרב-ממדית.", category: "synthesis", sectionRef: "u07-s11" },
  { unitId: "unit07", year: "1994", label: "חוק ביטוח בריאות ממלכתי", description: "בריאות אוניברסלית לכל אזרח. רכיב כלכלי-סוציאל-דמוקרטי של דרכו של רבין.", category: "synthesis", sectionRef: "u07-s14" },
  { unitId: "unit07", year: "1995", label: "הסכם אוסלו ב' (ספטמבר)", description: "הסכם הביניים. גרינברג רואה בו את הטריגר המידי לרצח רבין.", category: "crisis", sectionRef: "u07-s12" },
  { unitId: "unit07", year: "1995", label: "רצח רבין (4 בנובמבר)", description: "יגאל עמיר יורה ברבין בכיכר מלכי ישראל. ההצלחה הפוליטית של הקואליציה הלאומנית.", category: "crisis", sectionRef: "u07-s12" },
  { unitId: "unit07", year: "1996", label: "בחירות 1996 — ניצחון נתניהו (מאי)", description: "נתניהו מנצח את פרס בפער של 30,000 קולות. שיתוק תהליך אוסלו.", category: "crisis", sectionRef: "u07-s13" },
  { unitId: "unit07", year: "1997", label: "בלייר ו'הדרך השלישית'", description: "טוני בלייר עולה לשלטון בבריטניה. אידיאולוגיה של 'דרך שלישית' שמשפיעה על בן-עמי ועל ברק.", category: "general", sectionRef: "u07-s03" },
  { unitId: "unit07", year: "1998", label: "בן-עמי: 'מקום לכולם'", description: "ספר הבסיס הרעיוני לקמפיין ברק 1999. גוטוויין מנתח אותו כ'מסמך הכשר רעיוני' לנאו-ליברליזם.", category: "general", sectionRef: "u07-s04" },
  { unitId: "unit07", year: "1999", label: "בחירות 1999 — ניצחון ברק (מאי)", description: "ברק מנצח את נתניהו עם הסיסמה 'אני אהיה ראש ממשלה של כו-לם'. הקהל בכיכר רבין: 'רק לא ש\"ס'.", category: "synthesis", sectionRef: "u07-s08" },
  { unitId: "unit07", year: "2000", label: "פסגת קמפ דייוויד (יולי)", description: "כישלון משא ומתן ברק-ערפאת-קלינטון. גרינברג מציין שזה לא היה 'המשכת דרכו של רבין'.", category: "crisis", sectionRef: "u07-s05" },
  { unitId: "unit07", year: "2000", label: "גוטוויין: 'הדיאלקטיקה של כשל השוויון'; גרינברג: 'למה לא המשכנו בדרכו'", description: "שני המאמרים מתפרסמים — שני ניתוחים משלימים של הכישלון.", category: "general", sectionRef: "u07-s01" },
  { unitId: "unit07", year: "2001", label: "ברק מפסיד לשרון (פברואר)", description: "בחירות מיוחדות לראש ממשלה. שרון 62%, ברק 38%. סוף תקופת ברק וכישלון 'הדרך השלישית'.", category: "crisis", sectionRef: "u07-s05" },
];

/**
 * Filter timeline events for a single unit.
 * Used by UnitView to display "events relevant to this unit only".
 */
export function timelineForUnit(unitId: string): TimelineEvent[] {
  return courseTimeline.filter((e) => e.unitId === unitId);
}
