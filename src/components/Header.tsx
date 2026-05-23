import { useEffect, useState } from "react";
import { Moon, Sun, ArrowRight, BookOpen, LogOut, User } from "lucide-react";
import { initTheme, toggleTheme, isDark } from "../lib/theme";
import { useAuth } from "../lib/auth";

interface Props {
  onHome?: () => void;
  showBack?: boolean;
}

export default function Header({ onHome, showBack }: Props) {
  const [dark, setDark] = useState(false);
  const { profile, signOut, isGuest } = useAuth();

  useEffect(() => {
    initTheme();
    setDark(isDark());
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold hover:opacity-80"
        >
          <BookOpen size={20} />
          <span className="hidden sm:inline">מערכת פוליטית ישראלית</span>
          <span className="sm:hidden">המחברת</span>
        </button>
        <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
          · פרופ' דורון נבות · תשפ"ו ב'
        </div>
        <div className="flex-1" />
        {showBack && (
          <button onClick={onHome} className="btn-ghost text-sm">
            <ArrowRight size={16} />
            חזרה
          </button>
        )}
        {profile && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-lg px-2.5 py-1">
            <User size={12} />
            <span className="font-medium truncate max-w-[120px]">{profile.display_name}</span>
            {isGuest && <span className="text-amber-600 dark:text-amber-400 text-[10px]">·אורח</span>}
          </div>
        )}
        <button
          onClick={() => setDark(toggleTheme())}
          className="btn-ghost !p-2"
          aria-label="החלף מצב כהה/בהיר"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {profile && (
          <button
            onClick={signOut}
            className="btn-ghost !p-2"
            aria-label="יציאה"
            title="יציאה"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
