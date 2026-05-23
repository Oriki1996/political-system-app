import { useEffect, useState } from "react";
import { Moon, Sun, ArrowRight, BookOpen, LogOut, User, Settings, Trophy } from "lucide-react";
import { initTheme, toggleTheme, isDark } from "../lib/theme";
import { useAuth } from "../lib/auth";
import { useSettings } from "../lib/settings";

interface Props {
  onHome?: () => void;
  showBack?: boolean;
  onOpenSettings?: () => void;
  totalScore?: { earned: number; possible: number };
}

export default function Header({ onHome, showBack, onOpenSettings, totalScore }: Props) {
  const [dark, setDark] = useState(false);
  const { profile, signOut, isGuest } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    initTheme();
    setDark(isDark());
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-800/60" role="banner">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3" aria-label="ניווט ראשי">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-lg px-1"
          aria-label="חזרה לדף הראשי"
        >
          <BookOpen size={20} aria-hidden="true" />
          <span className="hidden sm:inline">מערכת פוליטית ישראלית</span>
          <span className="sm:hidden">המחברת</span>
        </button>
        <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block" aria-hidden="true">
          · פרופ' דורון נבות · תשפ"ו ב'
        </div>
        <div className="flex-1" />

        {settings.scoringEnabled && totalScore && totalScore.possible > 0 && (
          <div
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-l from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold"
            aria-label={`ניקוד כללי: ${totalScore.earned} מתוך ${totalScore.possible} נקודות`}
          >
            <Trophy size={12} aria-hidden="true" />
            <span className="tabular-nums">{totalScore.earned}<span className="opacity-70">/{totalScore.possible}</span></span>
          </div>
        )}

        {showBack && (
          <button
            onClick={onHome}
            className="btn-ghost text-sm focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          >
            <ArrowRight size={16} aria-hidden="true" />
            <span>חזרה</span>
          </button>
        )}

        {profile && (
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-lg px-2.5 py-1"
            aria-label={`משתמש מחובר: ${profile.display_name}${isGuest ? " (אורח)" : ""}`}
          >
            <User size={12} aria-hidden="true" />
            <span className="font-medium truncate max-w-[120px]">{profile.display_name}</span>
            {isGuest && <span className="text-amber-600 dark:text-amber-400 text-[10px]">·אורח</span>}
          </div>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="btn-ghost !p-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            aria-label="פתח הגדרות נגישות וניקוד"
            title="הגדרות"
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        )}

        <button
          onClick={() => setDark(toggleTheme())}
          className="btn-ghost !p-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          aria-label={dark ? "החלף למצב בהיר" : "החלף למצב כהה"}
        >
          {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {profile && (
          <button
            onClick={signOut}
            className="btn-ghost !p-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
            aria-label="יציאה מהחשבון"
            title="יציאה"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        )}
      </nav>
    </header>
  );
}
