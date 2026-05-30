# Handoff — בניית יחידה 11 (Opus 4.8)

**מיקום פרויקט:** `C:\Users\Ori-PC\political-system-app\`
**Repo:** `Oriki1996/political-system-app`
**פרודקשן:** https://political-system-app.vercel.app

---

## נושא היחידה
**יחידה 11 — ממשלת נתניהו השישית והמלחמה.**

**מאמר מקור (יחיד, מומלץ):**
- **Navot & Goldshmidt 2025 — "The deconstruction of the Israeli state"** (Frontiers in Political Science, 26.2.2025, DOI 10.3389/fpos.2025.1553516). **13 עמ', אנגלית, ~93K תווים.**
- אותם מחברים כמו יחידה 10 (נבות וגולדשמידט). **אזהרה:** זה מאמר **שונה** מ-2025 — אסור לייבא טענות/נתונים מיחידה 10. כל טענה חייבת להתבסס על מאמר זה.

**מצב נוכחי:** היחידה **לא נבנתה**. אינה רשומה ב-`UNIT_METAS` ולא ב-loaders.

**הטקסט כבר חולץ ומוכן:** `C:\Users\Ori-PC\.gemini\tmp\playwright\u11_navot2025.txt` (אנגלית, שכבת טקסט נקייה — `pdftotext` ישיר, **בלי צורך ב-OCR של Gemini**).

---

## ⚠️ שינויי תשתית קריטיים מאז unit06 (code-splitting — PR #32)
האתר עבר ל-lazy-loading. **חובה לשמור על קונבנציית השמות, אחרת loadUnit יישבר:**

1. `src/content/units/unit11/index.ts` → **חייב** `export const unit11: Unit = {...}` (השם `unit11` בדיוק — `loadUnit` עושה `mod["unit11"]`).
2. `src/content/units/unit11/meta.ts` → **חייב** `export const unit11Meta: UnitMeta = {...}`.
3. **רישום ב-`src/content/index.ts`** (שני מקומות!):
   - הוסף `import { unit11Meta } from "./units/unit11/meta";` והוסף ל-מערך `UNIT_METAS`.
   - הוסף ל-`loaders`: `unit11: () => import("./units/unit11"),`
4. **אין** לגעת ב-`App.tsx`/`UnitView` — ה-loader הגנרי מטפל בכל יחידה אוטומטית.
5. הרכיבים עברו לתת-תיקיות (`components/{layout,dashboard,unit,practice,timeline,common}`) — לא רלוונטי לבניית תוכן.
6. הוסף ציר זמן (אופציונלי) ב-`src/content/timeline.ts` עם `unitId: "unit11"`.

## מבנה התוכן (סטנדרט)
```
src/content/units/unit11/
  meta.ts        ← export const unit11Meta (title/subtitle/articles/status:"ready"/color/leadQuestion/7 objectives)
  parts.ts       ← 4 חלקים פדגוגיים, כל אחד sectionIds[]
  keyTerms.ts    ← ~30 מושגים (id, term, english, definition, category, triggers[])
  quiz/
    application.ts ← examBank (array ריק לעת עתה — שאלות מוטמעות בסקציות)
    index.ts       ← unit11Quiz + unit11ExamBank
  sections/
    01-...ts ... 14-...ts  ← RichSection (heading, tldr, paragraphs, comparison, quote, callout, comprehensionChecks)
    index.ts
  index.ts       ← Unit composer (export const unit11)
```

## פיטפולים (שגיאות build חוזרות)
- `category: "year"` **לא קיים** → השתמש `"date"`.
- `callout.color` רק `{ blue | yellow | purple | green }` (לא "amber").
- `comparison.rows` רק `{axis, left, right}` (אין `left2`).
- React Hooks לפני early return.
- `correct: 1` בלבד = position bias → הרץ `_scripts/unit11_shuffle_quiz.py` (אדפט מ-unit05/10) לאיזון 0/1/2/3.

---

## 🎯 כללי דיוק תוכן — הלקח הגדול מיחידות 06-10 (חובה!)
**כל טענה/ציטוט/תאריך/מספר בסקציה חייב להתבסס על המאמר עצמו.** הטעויות שתוקנו ב-06-10 חזרו על עצמן:
- **היפוך תזה** (החמור) — לדוגמה: הצגת מהלך כ"סוציאל-דמוקרטי" כשהמחבר טוען שהוא ניאו-ליברלי. **תמיד לקרוא מה המחבר באמת טוען, לא להניח.**
- **הזיות** — "הסכם הליסבון", "פתח-דבר 2026", שמות הוגים שלא במאמר (דה-טוקוויל), מושגים שיוחסו בטעות. **לא להמציא מקורות/ציטוטים.**
- **אנכרוניזם** — לייחס למחבר אירועים שאחרי פרסום המאמר. מותר סינתזה קדימה רק אם **מסומן במפורש** ("המחבר לא ידע על X אך מסגרתו מסבירה אותו").
- **דיוק עובדתי** — תאריכים, אחוזים, מקדמי רגרסיה, ייחוס מפלגתי — לאמת מול הטקסט.
- **ייחוס מדויק** — מקדם/נתון לקבוצה הנכונה; ציטוט עם שם המחבר והעמוד הנכונים.

---

## 🔧 צינור סקירת Gemini (השיטה שעובדת — לקח 07-10)
**אל תיתן ל-Gemini תמונות של PDF עברי צפוף — הוא מתבלבל על RTL וקורס על quota בקריאות מקבילות/כבדות.**
**השיטה האמינה: OCR→טקסט→סקירת טקסט.**

ליחידה 11 ספציפית: המאמר **אנגלי עם שכבת טקסט** → `pdftotext` ישיר (כבר בוצע). אין צורך ב-OCR.

**מקורות OCR לעברית (אם נדרש בעתיד):** גרסת **תלם** (`...תלם.pdf` — שכבת טקסט מלאה!) או **כותר** (`*_OCR.pdf`). `pdftotext` עליהן עובד. **נתיבי עברית שוברים bash → PowerShell + העתקה לשמות ASCII בסנדבוקס `C:\Users\Ori-PC\.gemini\tmp\playwright\`.**

**פקודת הסקירה (אחרי בניית הסקציות):**
```bash
cd "/c/Users/Ori-PC/.gemini/tmp/playwright"
cp u11_navot2025.txt review_u11/   # + העתק את קבצי הסקציות לשם
gemini -p "סוקר דיוק אקדמי. @review_u11/u11_navot2025.txt הוא המאמר. קרא אותו ואת הסקציות @review_u11/sections/01-...ts ... . דווח אך ורק על אי-דיוקים מול המאמר: ציטוט שגוי, ייחוס שגוי, מושג/טענה שאינו במאמר, היפוך עמדה, נתון שגוי. אם תקין כתוב 'תקין'. עברית, ציין מספר סקציה."
```
- אם quota מת: לחכות/לפצל לקריאות קטנות; טקסט קל יותר מתמונות.
- **לאמת כל ממצא של Gemini מול הטקסט (grep) לפני תיקון** — Gemini גם טועה.

---

## רצף עבודה מומלץ
1. קרא את `u11_navot2025.txt` במלואו, גבש את הטיעון המרכזי של המאמר ("פירוק המדינה הישראלית").
2. כתוב `meta.ts` (status:"ready", 7 objectives, leadQuestion) + `parts.ts` (4 חלקים).
3. כתוב 14 סקציות — כל אחת מבוססת ישירות על המאמר, 3 שאלות הבנה.
4. `keyTerms.ts` (~30) + `quiz/` wrappers + `index.ts`.
5. **רשום ב-`content/index.ts`** (UNIT_METAS + loaders — ראה למעלה).
6. הרץ shuffle quiz + `npx tsc --noEmit` + `npm run build` + `npm run verify:bundle`.
7. **סקירת Gemini** (טקסט) → אמת ממצאים מול הטקסט → תקן.
8. branch + PR + merge (אסור push ישיר ל-main).
9. אחרי merge: ודא deploy עבר (HTTP 200) + Playwright smoke (login→דשבורד→unit11 נטען→אפס שגיאות console).
10. עדכן memory: `project_political_system_app.md` (טבלת סטטוס יחידות → unit11 ✅).

---

## קישורים
- **memory פרויקט:** `C:\Users\Ori-PC\.claude\projects\C--Users-Ori-PC\memory\project_political_system_app.md` (סטטוס יחידות, פיטפולים, code-splitting, לקחי 06-10)
- **תבנית סקציה לחיקוי:** `src/content/units/unit10/sections/` (אותם מחברים)
- **לקחי סקירת תוכן:** `feedback_seminar_*` ב-memory; הסעיף "תזת המאמר ↔ ניסוח הסקציות"

*נכתב 30.05.2026 בסוף סשן Opus 4.8 (1M) — אחרי השלמת סקירת Gemini ליחידות 06-10 ורפקטור code-splitting.*
