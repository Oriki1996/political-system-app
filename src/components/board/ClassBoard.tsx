import { useEffect, useState } from "react";
import { Trophy, ChevronDown, ChevronUp, Users, RefreshCw } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { fetchBoard, type BoardRow } from "../../lib/cloudScores";
import { supabaseEnabled } from "../../lib/supabase";
import { UNIT_METAS } from "../../content";

const UNIT_LABEL: Record<string, string> = Object.fromEntries(
  UNIT_METAS.map((u) => [u.id, `יחידה ${u.number}`]),
);

function pct(e: number, p: number) {
  return p > 0 ? Math.round((e / p) * 100) : 0;
}

export default function ClassBoard() {
  const { user, shareScores } = useAuth();
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setRows(await fetchBoard(user?.id));
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!supabaseEnabled || !user) {
    return (
      <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">לוח הכיתה זמין לסטודנטים מחוברים בלבד.</p>
      </main>
    );
  }

  return (
    <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-8" dir="rtl">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Users className="text-sky-600" size={26} /> לוח הכיתה
        </h1>
        <button
          onClick={load}
          className="btn-ghost !p-2 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
          aria-label="רענן"
          title="רענן"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        ניקוד הבחינות של הסטודנטים שבחרו לשתף. {!shareScores && "הניקוד שלך מוסתר — אפשר לשנות בהגדרות."}
      </p>

      {loading && rows === null ? (
        <div className="text-center text-slate-400 animate-pulse py-12">טוען…</div>
      ) : rows && rows.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">
          עדיין אין ניקוד משותף. היו הראשונים — פתרו בחינה ביחידה כלשהי!
        </div>
      ) : (
        <ol className="space-y-2">
          {rows!.map((r, i) => {
            const isOpen = open === r.userId;
            const units = Object.keys(r.perUnit).sort();
            return (
              <li
                key={r.userId}
                className={`rounded-2xl border transition-colors ${
                  r.isMe
                    ? "border-brand-300 dark:border-brand-700 bg-brand-50/60 dark:bg-brand-950/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : r.userId)}
                  className="w-full flex items-center gap-3 p-3 text-right focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`shrink-0 w-7 h-7 grid place-items-center rounded-full text-sm font-extrabold ${
                      i === 0
                        ? "bg-amber-400 text-white"
                        : i === 1
                          ? "bg-slate-300 text-slate-700"
                          : i === 2
                            ? "bg-amber-700/80 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                      {r.name}
                      {r.isMe && <span className="text-brand-600 dark:text-brand-300 text-xs font-bold mr-1">· אני</span>}
                    </span>
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-sm font-bold tabular-nums">
                    <Trophy size={13} />
                    {r.total.earned}
                    <span className="opacity-70">/{r.total.possible}</span>
                    <span className="opacity-80">({pct(r.total.earned, r.total.possible)}%)</span>
                  </span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {units.length === 0 ? (
                      <span className="text-xs text-slate-400">אין נתונים</span>
                    ) : (
                      units.map((uid) => (
                        <div
                          key={uid}
                          className="flex items-center justify-between gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2 py-1.5"
                        >
                          <span className="text-slate-600 dark:text-slate-300 truncate">{UNIT_LABEL[uid] ?? uid}</span>
                          <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
                            {r.perUnit[uid].earned}/{r.perUnit[uid].possible}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
