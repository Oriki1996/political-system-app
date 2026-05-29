import type { RichSegment, SemanticTag, KeyTerm } from "../../types";
import GlossaryTooltip from "./GlossaryTooltip";

const TAG_CLASS: Record<SemanticTag, string> = {
  term: "hl-term",
  name: "hl-name",
  date: "hl-date",
  criterion: "hl-criterion",
  warning: "hl-warning",
  school: "hl-school",
};

/** Build a map: trigger string -> KeyTerm. Longest triggers first to match greedily. */
function buildTriggerIndex(keyTerms?: KeyTerm[]): Array<{ trigger: string; term: KeyTerm }> {
  if (!keyTerms || keyTerms.length === 0) return [];
  const out: Array<{ trigger: string; term: KeyTerm }> = [];
  for (const kt of keyTerms) {
    if (!kt.triggers) continue;
    for (const tr of kt.triggers) {
      if (tr && tr.trim()) out.push({ trigger: tr.trim(), term: kt });
    }
  }
  return out.sort((a, b) => b.trigger.length - a.trigger.length);
}

/** Split a string into parts: matched triggers wrapped in tooltip + plain text. */
function splitWithTriggers(
  text: string,
  index: Array<{ trigger: string; term: KeyTerm }>,
): Array<{ type: "text"; text: string } | { type: "match"; text: string; term: KeyTerm }> {
  if (index.length === 0) return [{ type: "text", text }];

  // Scan greedily: at each position find the longest matching trigger; else copy char.
  const out: Array<{ type: "text"; text: string } | { type: "match"; text: string; term: KeyTerm }> = [];
  let buf = "";
  let i = 0;
  const used = new Set<string>(); // dedupe per segment — only first match per term inside one segment
  while (i < text.length) {
    let matched: { trigger: string; term: KeyTerm } | null = null;
    for (const entry of index) {
      if (used.has(entry.term.id)) continue;
      if (text.startsWith(entry.trigger, i)) {
        matched = entry;
        break;
      }
    }
    if (matched) {
      if (buf) {
        out.push({ type: "text", text: buf });
        buf = "";
      }
      out.push({ type: "match", text: matched.trigger, term: matched.term });
      used.add(matched.term.id);
      i += matched.trigger.length;
    } else {
      buf += text[i];
      i += 1;
    }
  }
  if (buf) out.push({ type: "text", text: buf });
  return out;
}

export function RichLine({
  segments,
  keyTerms,
}: {
  segments: RichSegment[];
  keyTerms?: KeyTerm[];
}) {
  const triggerIndex = buildTriggerIndex(keyTerms);

  return (
    <p className="leading-[1.95] text-[15px] text-slate-800 dark:text-slate-200">
      {segments.map((s, i) => {
        const cls = s.tag ? TAG_CLASS[s.tag] : "";
        const parts = splitWithTriggers(s.text, triggerIndex);
        return (
          <span key={i} className={cls}>
            {parts.map((p, j) =>
              p.type === "match" ? (
                <GlossaryTooltip key={j} term={p.term}>
                  {p.text}
                </GlossaryTooltip>
              ) : (
                <span key={j}>{p.text}</span>
              ),
            )}
          </span>
        );
      })}
    </p>
  );
}
