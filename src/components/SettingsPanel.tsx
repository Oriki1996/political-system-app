import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Trophy, Zap, Eye, Type, Link as LinkIcon, RotateCcw, AlertCircle,
} from "lucide-react";
import { useSettings, type FontScale } from "../lib/settings";
import { clearAllScores } from "../lib/scoring";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: "sm", label: "קטן" },
  { value: "md", label: "רגיל" },
  { value: "lg", label: "גדול" },
  { value: "xl", label: "ענק" },
];

export default function SettingsPanel({ open, onClose }: Props) {
  const { settings, setSetting, reset } = useSettings();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => closeRef.current?.focus(), 50);
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Panel */}
          <motion.div
            key="settings-panel"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="fixed inset-y-0 left-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto"
            dir="rtl"
          >
            <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <h2 id="settings-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
                הגדרות
              </h2>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="סגור הגדרות"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="p-5 space-y-6">
              {/* Scoring */}
              <Section title="ניקוד" icon={<Trophy size={18} className="text-amber-600" />}>
                <ToggleRow
                  label="הפעל מערכת ניקוד"
                  description="2 נקודות לשאלה רגילה, 4 לשאלה קשה. מציג את הניקוד הצבור פר יחידה ובכלל."
                  checked={settings.scoringEnabled}
                  onChange={(v) => setSetting("scoringEnabled", v)}
                />
              </Section>

              {/* Motion */}
              <Section title="תנועה ואנימציה" icon={<Zap size={18} className="text-violet-600" />}>
                <ToggleRow
                  label="הפחת תנועה"
                  description="מבטל אנימציות מעבר ותנועה למניעת הסחת דעת או מחלת תנועה."
                  checked={settings.reduceMotion}
                  onChange={(v) => setSetting("reduceMotion", v)}
                />
              </Section>

              {/* Visual */}
              <Section title="קריאות" icon={<Eye size={18} className="text-emerald-600" />}>
                <ToggleRow
                  label="ניגודיות גבוהה"
                  description="חיזוק ניגודיות צבעים לשיפור קריאה לבעלי לקויות ראייה."
                  checked={settings.highContrast}
                  onChange={(v) => setSetting("highContrast", v)}
                />
                <ToggleRow
                  label="קישורים מודגשים בקו תחתון"
                  description="סימון ברור של קישורים לבעלי קושי בהבחנה בצבעים."
                  checked={settings.underlineLinks}
                  onChange={(v) => setSetting("underlineLinks", v)}
                />
                <div className="pt-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                    <Type size={14} /> גודל טקסט
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {FONT_SCALES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSetting("fontScale", s.value)}
                        aria-pressed={settings.fontScale === s.value}
                        aria-label={`גודל טקסט ${s.label}`}
                        className={`py-2 rounded-lg text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                          settings.fontScale === s.value
                            ? "bg-brand-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Reset */}
              <Section title="איפוס" icon={<RotateCcw size={18} className="text-rose-600" />}>
                <ResetSection onClose={onClose} reset={reset} />
              </Section>

              {/* Accessibility statement link */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <a
                  href="/accessibility"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, "", "/accessibility");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 hover:underline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
                >
                  <LinkIcon size={12} aria-hidden="true" />
                  הצהרת נגישות (תקן ישראלי 5568)
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
        {icon}
        {title}
      </h3>
      <div className="space-y-3 pr-1">{children}</div>
    </section>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = `toggle-${label.replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-3 cursor-pointer group">
      <div className="flex-1 text-sm">
        <div className="font-medium text-slate-900 dark:text-slate-100">{label}</div>
        {description && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
      </div>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
          checked ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? "-translate-x-1" : "-translate-x-5"
          }`}
        />
      </button>
    </label>
  );
}

function ResetSection({ onClose, reset }: { onClose: () => void; reset: () => void }) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          if (window.confirm("לאפס את כל הניקוד שלך? פעולה זו אינה ניתנת לביטול.")) {
            clearAllScores();
          }
        }}
        className="w-full text-right px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-sm font-medium focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
      >
        אפס את כל הניקוד שצברתי
      </button>
      <button
        onClick={() => {
          if (window.confirm("לאפס את כל ההגדרות לברירת המחדל?")) {
            reset();
            onClose();
          }
        }}
        className="w-full text-right px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm font-medium focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none flex items-center gap-2"
      >
        <AlertCircle size={14} aria-hidden="true" />
        אפס הגדרות לברירת מחדל
      </button>
    </div>
  );
}
