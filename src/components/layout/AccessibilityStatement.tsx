import { ArrowRight } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function AccessibilityStatement({ onBack }: Props) {
  const today = new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-8" lang="he" dir="rtl">
      <button
        onClick={onBack}
        className="btn-ghost mb-4 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
        aria-label="חזרה לדשבורד"
      >
        <ArrowRight size={16} aria-hidden="true" />
        חזרה
      </button>

      <article className="card p-6 sm:p-8 space-y-5 prose-content">
        <header>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
            הצהרת נגישות
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            תקן ישראלי 5568 · WCAG 2.1 רמת AA · עודכן: {today}
          </p>
        </header>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            על האתר
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            אתר זה הוא מחברת לימוד אינטראקטיבית לקורס "מערכת פוליטית ישראלית" של פרופ' דורון נבות באוניברסיטת חיפה. האתר נבנה תוך התחשבות בעקרונות הנגישות כפי שנקבעו בתקן הישראלי 5568 ובהנחיות WCAG 2.1 ברמת AA.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            מאפייני הנגישות באתר
          </h2>
          <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 pr-5 list-disc">
            <li>תמיכה מלאה ב-RTL (מימין לשמאל) ובשפה העברית.</li>
            <li>ניווט מלא במקלדת — Tab, Shift+Tab, Enter, Escape, חיצים.</li>
            <li>סימון ויזואלי של פוקוס (טבעת כחולה) על כל אלמנט בר-מיקוד.</li>
            <li>קישור "דלג לתוכן" המופיע בקליטת Tab הראשונה לעקיפת התפריט.</li>
            <li>תיאוריות טקסטואליות (aria-label) על כל הכפתורים האייקוניים.</li>
            <li>מבנה כותרות סמנטי (h1, h2, h3) המאפשר ניווט בקוראי מסך.</li>
            <li>טבלאות עם כותרות עמודות נכונות לקוראי מסך.</li>
            <li>צבעים בעלי ניגודיות מספקת (WCAG AA — 4.5:1 לטקסט רגיל, 3:1 לטקסט גדול).</li>
            <li>מצב כהה לנוחות קריאה והפחתת עומס ראייה.</li>
            <li>תמיכה ב-prefers-reduced-motion להפחתת אנימציות.</li>
            <li>חלון הגדרות נגישות עם אפשרויות מותאמות אישית.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            אפשרויות התאמה אישיות
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 mb-2">
            דרך כפתור ההגדרות (סמל ⚙ בכותרת) ניתן להפעיל:
          </p>
          <ul className="space-y-1.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 pr-5 list-disc">
            <li><strong>הגדלת טקסט</strong> — 4 רמות (קטן/רגיל/גדול/ענק).</li>
            <li><strong>ניגודיות גבוהה</strong> — חיזוק צבעים לשיפור קריאה.</li>
            <li><strong>הפחתת תנועה</strong> — ביטול אנימציות מעבר.</li>
            <li><strong>קישורים מודגשים</strong> — קו תחתון לכל הקישורים.</li>
            <li><strong>מצב כהה/בהיר</strong> — דרך כפתור ירח/שמש בכותרת.</li>
            <li><strong>כיבוי מערכת ניקוד</strong> — להפחתת עומס ויזואלי-קוגניטיבי.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            תכנים שעדיין דורשים שיפור
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            האתר נמצא בפיתוח פעיל. ייתכן שתיתקלו בתכנים שאינם נגישים באופן מלא. אנו עובדים על שיפור מתמיד. במקרים אלה, נשמח לקבל פנייה (ראו "צרו קשר" למטה).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            צרו קשר — אם נתקלתם בבעיית נגישות
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
            אם נתקלתם באלמנט שאינו נגיש או שאתם זקוקים להתאמה מיוחדת — כתבו לנו לדוא"ל{" "}
            <a
              href="mailto:oribendavid1996@gmail.com?subject=נגישות%20-%20מערכת%20פוליטית%20ישראלית"
              className="text-brand-700 dark:text-brand-300 underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
            >
              oribendavid1996@gmail.com
            </a>{" "}
            ונטפל בכך בהקדם.
          </p>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-800 pt-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            פרטים טכניים
          </h2>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300 pr-5 list-disc">
            <li>פלטפורמה: React 19 + TypeScript + Tailwind CSS 3.</li>
            <li>נבדק בדפדפנים: Chrome, Safari, Firefox, Edge (גרסאות אחרונות).</li>
            <li>נבדק במכשירים: מחשב נייח, מחשב נייד, סמארטפון (iOS, Android), טאבלט.</li>
            <li>תקן ישראלי: ת"י 5568 (תקנות שוויון זכויות לאנשים עם מוגבלות – התאמות נגישות לשירות).</li>
            <li>תקן בין-לאומי: WCAG 2.1 רמת AA.</li>
            <li>אחראי נגישות: אורי בן-דוד (oribendavid1996@gmail.com).</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
