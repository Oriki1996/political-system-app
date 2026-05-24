import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import type { KeyTerm } from "../types";

interface Props {
  term: KeyTerm;
  children: ReactNode;
  /** className for the trigger element */
  className?: string;
}

/**
 * Inline glossary tooltip — desktop: hover; mobile: tap.
 * Wraps any text-like child element. Tooltip shows term definition.
 */
export default function GlossaryTooltip({ term, children, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="cursor-help underline decoration-dotted decoration-2 underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded"
        aria-label={`הצג הגדרה של ${term.term}`}
        aria-expanded={open}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="absolute z-40 top-full right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] block"
            dir="rtl"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span className="block rounded-xl bg-white dark:bg-slate-900 border-2 border-brand-400 dark:border-brand-600 shadow-2xl p-3.5 text-right">
              <span className="flex items-center justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <BookOpen size={11} aria-hidden="true" />
                  הגדרה
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  aria-label="סגור הגדרה"
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
              <span className="block">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {term.term}
                </span>
                {term.english && (
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {term.english}
                  </span>
                )}
              </span>
              <span className="block text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed mt-1.5">
                {term.definition}
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
