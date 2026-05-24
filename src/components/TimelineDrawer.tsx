import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useEffect } from "react";
import type { TimelineEvent } from "../types";
import Timeline from "./Timeline";

interface Props {
  open: boolean;
  events: TimelineEvent[];
  onClose: () => void;
  onJumpToSection?: (sectionId: string) => void;
  unitTitle?: string;
}

export default function TimelineDrawer({ open, events, onClose, onJumpToSection, unitTitle }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="timeline-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/40 overflow-y-auto"
          dir="rtl"
        >
          <div className="sticky top-0 z-10 backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
                aria-label="חזרה ליחידה"
              >
                <X size={18} />
                <span>סגירה</span>
              </button>
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Clock size={18} />
                <span className="font-extrabold text-sm">ציר זמן · {unitTitle ?? "היחידה"}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
          >
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ציר הזמן מציג את האירועים המרכזיים של היחידה לפי סדר כרונולוגי. צבע הנקודה מציין את הקטגוריה. לחץ על "קרא בקטע" כדי לקפוץ ישירות לחומר הרלוונטי.
              </p>
            </div>
            <Timeline events={events} onJumpToSection={onJumpToSection} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
