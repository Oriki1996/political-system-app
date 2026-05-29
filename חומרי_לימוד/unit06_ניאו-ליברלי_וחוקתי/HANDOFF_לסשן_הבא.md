# Handoff לסשן הבא (Opus 4.8)

**מיקום פרויקט:** `C:\Users\Ori-PC\political-system-app\`
**Repo:** `Oriki1996/political-system-app`
**פרודקשן:** https://political-system-app.vercel.app

---

## מצב סוף הסשן (30.05.2026 לפנות בוקר)

### ✅ הושלם
- **unit06 חיה בפרודקשן** — 14 סקציות, 30 keyTerms, 42 שאלות
- **3 PRs נמזגו ל-main:**
  - PR #27 — יחידה 06 נוצרה
  - PR #28 — סקציות מאוטנר נכתבו מחדש על בסיס המאמר המקורי
  - PR #29 — תיקוני copy (footer + unit06 subtitle עם 4 מחברים)
- **QA אוטומטי על 10 היחידות** — אפס בעיות
- **חומרי לימוד מאורגנים** ב-`חומרי_לימוד/unit06_ניאו-ליברלי_וחוקתי/`

### ⏳ פתוח — בדיקת איכות עם Gemini (משימה ראשונה לסשן החדש)
המשתמש ביקש סקירת תוכן שנייה עם Gemini CLI.

**הקבצים מוכנים בסנדבוקס של Gemini:**
```
C:\Users\Ori-PC\.gemini\tmp\playwright\review_u06\
├── ocr\          (4 מאמרי OCR נקיים)
│   ├── mautner_1994_partial.txt   (45 עמ' מתוך 57 — חסר סוף)
│   ├── sapir_2009.txt
│   ├── mendelkern_2015.txt
│   └── krampf_2018.txt
└── sections\     (14 סקציות + index)
    ├── 01-mautner-formalism-decline.ts
    ├── ...
    └── 14-synthesis-two-revolutions.ts
```

**הצעת workflow לבדיקת Gemini:**
1. עבור כל אחד מ-4 המאמרים, הריצי `gemini -p` עם פרומפט שמבקש לבדוק תאימות OCR ↔ סקציות:
   ```bash
   gemini -p "קרא את @ocr/mautner_1994_partial.txt ואת @sections/01-mautner-formalism-decline.ts, @sections/02-mautner-cultural-war.ts, @sections/03-mautner-foundation-1992.ts. דווח על אי-דיוקים: ציטוטים שגויים, ייחוס שגוי, מושגים שמופיעים בסקציות אך לא במאמר, או טענות מבניות שלא מבוססות."
   ```
2. אסוף את הדיווחים, סנן את האמיתיים מהקטנוניים, ותקן בסקציות.
3. אם מצא טעויות → PR נפרד `fix(unit06): gemini-review corrections`.

### ⏳ עתידי
- יחידה 11 (ממשלת נתניהו השישית + מלחמה) — אין מאמרים עדיין
- OCR להשלמת מאוטנר (עמ' 46-57) אם רוצים סקירה מלאה

---

## איך להמשיך עבודת לימוד אישית

`חומרי_לימוד/unit06_ניאו-ליברלי_וחוקתי/`:
- **README.md** — סיכום היחידה, מבנה הסקציות, מושגי מפתח, טיפים לעבודת בית
- **מאמרים_מקור/** — 4 קבצי טקסט עבריים נקיים (OCR מ-Gemini Vision)

לקראת יחידות עתידיות, אורי, השתמשי באותו מבנה: תיקייה לכל יחידה עם `README.md` + `מאמרים_מקור/`.

---

## הוראות פתיחה לסשן Opus 4.8

```
1. ודאי `/model` = Opus 4.8 (אם /model מציג opus כברירת מחדל — זה 4.8)
2. קראי את `חומרי_לימוד/unit06_ניאו-ליברלי_וחוקתי/HANDOFF_לסשן_הבא.md` (הקובץ הזה)
3. התחילי במשימה הראשונה: בדיקת Gemini על unit06
```

**פרומפט פתיחה מומלץ:**
> תקרא את `HANDOFF_לסשן_הבא.md` ב-`חומרי_לימוד/unit06_ניאו-ליברלי_וחוקתי/`. תמשיך מאיפה שהפסקנו: בדיקת איכות עם Gemini על 14 הסקציות של unit06 מול 4 המאמרים המקוריים.

---

## קישורים שימושיים

- **memory** — `C:\Users\Ori-PC\.claude\projects\C--Users-Ori-PC\memory\`
- **project memory** — `project_political_system_app.md` (סטטוס יחידות, פיטפולים, צינור OCR)
- **OCR workflow** — `reference_gemini_paid.md`
- **לקח מאוטנר** — `project_political_system_app.md` סעיף "תזת המאמר ↔ ניסוח הסקציות"

---

*נכתב 30.05.2026 בסוף סשן Opus 4.7 (1M).*
