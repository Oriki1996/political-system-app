import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../lib/auth";
import { supabaseEnabled } from "../../lib/supabase";

export default function Login() {
  const { signInWithGoogle, signInGuest } = useAuth();
  const [guestName, setGuestName] = useState("");

  return (
    <div className="min-h-[100dvh] grid place-items-center px-4 py-10 relative overflow-hidden" dir="rtl">
      <img
        src="/site-bg.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/80 dark:from-slate-950/40 dark:via-slate-950/60 dark:to-slate-950/80 backdrop-blur-sm pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-md w-full p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-7">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
            className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-brand-600 to-accent-600 grid place-items-center text-white shadow-card mb-3 text-2xl font-extrabold"
          >
            ש
          </motion.div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            מערכת פוליטית ישראלית
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            מחברת למידה אינטראקטיבית · פרופ' דורון נבות · אונ' חיפה
          </p>
        </div>

        {supabaseEnabled ? (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm font-semibold"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 7.7-11.3 7.7-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.7 7.4 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.3l-6.2-5.2c-2 1.4-4.6 2.2-7.3 2.2-5.3 0-9.7-3.4-11.3-8L6.2 33.5C9.5 40.5 16.2 45 24 45z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.2C40.5 36 45 30.5 45 24c0-1.2-.1-2.4-.4-3.5z" />
            </svg>
            <span>התחבר עם Google</span>
          </button>
        ) : (
          <div className="text-amber-700 dark:text-amber-300 text-sm bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 mb-3">
            התחברות ענן עוד לא מוגדרת. תוכל להתחיל ללמוד מקומית — ההתקדמות תישמר בדפדפן.
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/90 dark:bg-slate-900/90 px-3 text-slate-500 dark:text-slate-400">או</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">המשך כאורח</label>
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="השם שלך"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40 transition"
          />
          <button
            disabled={guestName.trim().length < 2}
            onClick={() => signInGuest(guestName.trim())}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-l from-brand-600 to-accent-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            התחל ללמוד
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6 leading-relaxed">
          התחברות עם Google תאפשר בעתיד לשמור את ההתקדמות שלך בענן.
          מצב אורח שומר רק במכשיר הזה.
        </p>
      </motion.div>
    </div>
  );
}
