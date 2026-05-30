# תקן האיכות — political-system-app

> **עקרון-העל.** שום חוליה לא נכנסת עד שהוכיחה שהיא עומדת בתקן — לא רק "בתחילתה" אלא בכל שדה, כל מחרוזת, כל מבנה. אם זה לא עומד → זה לא נכנס עד שמתוקן. אין קוד מת. אין טעות מקור. אין הטיה שמאפשרת לנצח בלי ללמוד. **ברירת המחדל היא "נדחה", והקוד/התוכן צריך להרוויח את הכניסה.**

המסמך מחייב כל שינוי עתידי וכל אודיט של הקיים. הוא בנוי בשלוש שכבות: (1) המבנה הקנוני של יחידה, (2) עשה/אל-תעשה לכל שכבה, (3) שער הקבלה ותהליך האודיט.

---

## 1. המבנה הקנוני של יחידה (כל חוליה בשרשרת)

```
src/content/units/unitNN/
  index.ts          ← Unit composer: export const unitNN = { ...meta, sections, quiz, examBank, keyTerms, parts }
  meta.ts           ← export const unitNNMeta: UnitMeta
  parts.ts          ← export const unitNNParts: UnitPart[]   (4 חלקים פדגוגיים, sectionIds)
  keyTerms.ts       ← export const unitNNKeyTerms: KeyTerm[]
  quiz/
    application.ts  ← export const unitNNApplication: ComprehensionQ[]  (מאגר בחינה ייעודי, או [])
    index.ts        ← unitNNQuiz + unitNNExamBank (נופל ל-section checks אם application ריק)
  sections/
    NN-*.ts         ← export const section: RichSection  (heading, tldr, paragraphs, comparison?, quote?, callout?, comprehensionChecks)
    index.ts        ← export const unitNNSections: RichSection[]  (מאחד ומסדר)
```

**קונבנציות מחייבות (לא לשבור — loadUnit + UNIT_METAS תלויים בהן):**
- `unitNN/index.ts` מייצא `export const unitNN` · `meta.ts` מייצא `unitNNMeta` (loadUnit עושה `mod[id]`).
- כל `id` ייחודי וגלובלי: section = `uNN-sMM`, שאלה = `uNN-sMM-qK`. **אסור id כפול** (היה `kt-judennot` כפול ב-unit01).
- רכיב חדש → תת-תיקייה לפי פיצ'ר ב-`components/` (layout/dashboard/unit/practice/timeline/common/board).

**שדות חובה לכל שכבה:**
| חוליה | שדות חובה | בדיקת איכות |
|--|--|--|
| `meta` | title · subtitle · articles[] · leadQuestion · objectives[] (7) · status · color | subtitle מונה את כל מחברי הקריאה; color מ-palette חוקי |
| `parts` | 4 חלקים, כל אחד title + sectionIds[] | כל section משויך לחלק; אין section יתום |
| `RichSection` | id · heading · tldr · paragraphs[] · comprehensionChecks[] | tldr 4-5 משפטים; פסקה = RichSegment[] עם tag |
| `KeyTerm` | id · term · english? · definition · category · triggers[] | definition מוביל בערך-מוסף; triggers בלי מילים רגילות |
| `ComprehensionQ` | id · level · question · options[4] · correct · rationale · optionExplanations[4] · sectionRef | **סימטריית אורך** · מסיחים סבירים · rationale מעוגן |

---

## 2. עשה / אל-תעשה — לכל שכבה

### 2.1 שאלות (הכי קריטי — כאן נתפסה ההטיה)

**✅ עשה**
- **סימטריית אורך אופציות.** היעד: שיעור "הנכונה = הארוכה ביותר" ביחידה **≤ 30%** (קרוב לרנדומלי 25%). פר-שאלה: אורך התשובה הנכונה **לא חורג ב->25%** מממוצע אורכי המסיחים. המסיח חייב לשאת פירוט/נימוק בדומה לנכונה.
- **פיזור `correct`** על 0/1/2/3 בערך שווה (ל-N שאלות: ~N/4 בכל מיקום). יש `_scripts/unitNN_shuffle_quiz.py`.
- **כל מסיח = עמדה שתיאורטיקן רציני יכול להחזיק.** טעות מעניינת, לא אבסורד.
- **`rationale` + `optionExplanations` מעוגנים בסקציה/מקור.** כל טענה נסמכת על גוף הטקסט.
- **הגדרה inline** למושג מתודולוגי בתוך השאלה (חסכנות, רגרסיה, וכו').
- **`level` כן** לפי הקושי האמיתי: recall (שליפה/הבנה) · apply (העברה למקרה חדש) · critical (ניתוח/השוואה/הערכה בתוך החומר) · integration (סינתזה **חוצת-סקציות/מחברים**).

**❌ אל תעשה**
- **❌ הטיית אורך** — התשובה הנכונה הארוכה/המפורטת ביותר שיטתית. (הכשל שנתפס ב-unit01.)
- **❌ מסיח גרוטסקי** — "תמך/דחה לחלוטין", "שתי הגישות זהות", הטיית-אורך הפוכה.
- **❌ `rationale` בדוי** — "המאמר בדק X ולא מצא קשר" כש-X לא בסקציה; ציטוט מומצא; אנכרוניזם.
- **❌ מכסת רמות כפויה** — לא "recall+critical+integration לכל סקציה" אם התוכן לא מזמין.
- **❌ `correct` קבוע** (תמיד 1) — position bias.

### 2.2 keyTerms (tooltips)

**✅ עשה** — definition מוביל ב**פואנטה האנליטית / ההבחנה / השימוש של המחבר**, לא חזרה על הפסקה הצמודה · דיוק מול גוף המאמר · ייחוס מחבר נכון · triggers ספציפיים.
**❌ אל תעשה** — **❌ הגדרה כפולה** (חזרה על הטקסט) · **❌ ייחוס שגוי** (זליגת "גרינברג" ל-02/08 — הוא מחבר unit07/09) · **❌ מספר/תאריך שגוי** · **❌ אנכרוניזם** (לייחס למאמר אירוע אחרי טווח הנתונים שלו) · **❌ trigger על מילה רגילה** ("מקרוב") · **❌ id/trigger כפול**.

### 2.3 סקציות (פרוזה)

**✅ עשה** — **פרוזה זורמת = ברירת המחדל** לטיעון/סיבתיות (Mayer/CLT) · tldr ככרטיס "הנקודה המרכזית" · `tag` סמנטי על עוגנים · **טבלת השוואה רק לניגוד דו-קוטבי אמיתי** עם 2-5 צירים מהפרוזה · ציטוט עם source+page · callout בצבע חוקי {blue,yellow,purple,green}.
**❌ אל תעשה** — **❌ ויזואל דקורטיבי** (עקרון הקוהרנטיות: −20-40% למידה) · **❌ "שמש מושגים"/דיאגרמה לשם גיוון** (סגנונות למידה = מיתוס) · **❌ תזה הפוכה ממבוא בודד** (לבסס על גוף הטיעון; טענה קונטרה-אינטואיטיבית = לאמת מול מקור שני) · **❌ `category:"year"`** (יש רק "date") · **❌ `callout.color:"amber"`**.

### 2.4 קוד / ארכיטקטורה

**✅ עשה** — `tsc --noEmit` נקי · `npm run build` + `npm run verify:bundle` עוברים · React Hooks לפני early return · RTL מפורש בכל פלט עברי · a11y (aria, focus, 44px, ניגודיות) · best-effort על קריאות ענן (no-op אם נכשל) · קוד מפוצל לפי קונבנציית loadUnit · branch+PR+merge (**אסור push ישיר ל-main**).
**❌ אל תעשה** — **❌ קוד מת** (Honeycomb/HexTile נמחקו — אם לא בשימוש, למחוק) · **❌ secrets בקוד** · **❌ type annotations על callbacks של recharts/חיצוני** (Vercel נופל) · **❌ TS6305** (tsconfig references בלי composite) · **❌ אנון-key עם \n** (תמיד `.replace(/\s+/g,"")`).

### 2.5 אמינות מקור (חוצה-שכבות)

**✅** כל טענה/תאריך/מספר/ייחוס מעוגן ב**גוף המאמר** ברשימת הקריאה · טענה קונטרה-אינטואיטיבית → אימות מול מקור אקדמי שני · אחרי תיקון סקציה → לבדוק גם keyTerms וגם השאלות (הטעות מתפשטת).
**❌** הסתמכות על מוניטין המחבר במקום על המאמר · ערבוב מחברים בין יחידות.

---

## 3. שער הקבלה — איך תוכן נכנס

תוכן/קוד נכנס **רק אם עבר את כל ארבעת השלבים**, בסדר הזה:

1. **טכני:** `npx tsc --noEmit` נקי → `npm run build` → `npm run verify:bundle` (10 chunks, אף אחד מעל 600KB).
2. **אודיט תוכן (אובייקטיבי):** הרצת בדיקות התקן —
   - **length-bias:** שיעור "נכונה=ארוכה" ≤ 30% ביחידה, ואף שאלה לא חורגת ב->25%.
   - **fabrication:** אין rationale/optionExplanation שטוען "המאמר בדק/מצא X" כש-X לא בסקציה.
   - **accuracy:** תאריכים/מספרים/ייחוסים תואמים את הסקציות וההיסטוריה; אין זליגת מחבר.
   - **redundancy:** אין keyTerm שחוזר על הפסקה.
   - **levels:** integration = רק סינתזה חוצת-סקציות.
   - **correct distribution:** מאוזן 0/1/2/3.
3. **בקרת עמית:** code-review של ה-diff (correctness + הצמדות לתקן).
4. **אימות חי:** אחרי merge — deploy עבר (HTTP 200) + smoke test (Playwright) במידת הצורך.

**רק 100% → merge. כל כשל → חוזר לתיקון, לא נכנס.**

---

## 4. תהליך האודיט של הקיים (10 היחידות)

עוברים **יחידה-יחידה** (לא הכל בבת אחת — מונע נפילת בקרה). כל יחידה עוברת את כל בדיקות §3.2; מה שלא עומד **מתוקן לפני שהיחידה "מאושרת"**. סטטוס אודיט נשמר בטבלה:

| יחידה | length-bias | fabrication | accuracy | redundancy | levels | אושרה? |
|--|--|--|--|--|--|--|
| 01–10 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

*(הערה: fabrication/accuracy/redundancy/levels כבר נסרקו ב-PRs #31–#48; length-bias טרם — זו הבדיקה הראשונה שתיכשל וצריכה תיקון מערכתי.)*

עד שיחידה לא "אושרה" — אין דוחפים אליה פיצ'רים חדשים. **כל אות צריכה להוכיח את עצמה.**
