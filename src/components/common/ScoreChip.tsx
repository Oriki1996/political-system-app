import { Trophy } from "lucide-react";
import { useSettings } from "../../lib/settings";

interface Props {
  earned: number;
  possible: number;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export default function ScoreChip({ earned, possible, size = "md", className = "", label }: Props) {
  const { settings } = useSettings();
  if (!settings.scoringEnabled) return null;
  const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  const isSmall = size === "sm";
  const colorClass =
    pct >= 80 ? "from-emerald-500 to-green-600" :
    pct >= 50 ? "from-amber-500 to-orange-600" :
    earned > 0 ? "from-sky-500 to-brand-600" :
    "from-slate-400 to-slate-500";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l ${colorClass} text-white shadow-sm ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      } font-bold ${className}`}
      aria-label={label || `ניקוד: ${earned} מתוך ${possible} נקודות אפשריות`}
    >
      <Trophy size={isSmall ? 10 : 12} aria-hidden="true" />
      <span className="tabular-nums">
        {earned}<span className="opacity-70">/{possible}</span>
      </span>
    </div>
  );
}
