import type { RichSegment, SemanticTag } from "../types";

const TAG_CLASS: Record<SemanticTag, string> = {
  term: "hl-term",
  name: "hl-name",
  date: "hl-date",
  criterion: "hl-criterion",
  warning: "hl-warning",
  school: "hl-school",
};

export function RichLine({ segments }: { segments: RichSegment[] }) {
  return (
    <p className="leading-[1.95] text-[15px] text-slate-800 dark:text-slate-200">
      {segments.map((s, i) => (
        <span key={i} className={s.tag ? TAG_CLASS[s.tag] : ""}>
          {s.text}
        </span>
      ))}
    </p>
  );
}
