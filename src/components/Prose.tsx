import type { ProseBlock } from "../types";

const CALLOUT_COLORS = {
  blue: "bg-brand-50/80 dark:bg-brand-950/30 border-brand-300/50 dark:border-brand-700/40 text-brand-900 dark:text-brand-100",
  yellow: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/50 dark:border-amber-700/40 text-amber-900 dark:text-amber-100",
  purple: "bg-violet-50/80 dark:bg-violet-950/30 border-violet-300/50 dark:border-violet-700/40 text-violet-900 dark:text-violet-100",
  green: "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/50 dark:border-emerald-700/40 text-emerald-900 dark:text-emerald-100",
};

export default function ProseRenderer({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ProseBlock }) {
  switch (block.type) {
    case "heading":
      if (block.level === 3) {
        return <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">{block.text}</h4>;
      }
      return (
        <h3 className="text-lg sm:text-xl font-bold text-brand-800 dark:text-brand-200 mt-6 mb-1 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-[15px] leading-[1.85] text-slate-700 dark:text-slate-200">
          {block.text}
        </p>
      );

    case "quote":
      return (
        <figure className="my-3 pr-4 border-r-4 border-brand-400 dark:border-brand-600">
          <blockquote className="text-[15px] italic text-slate-700 dark:text-slate-200 leading-[1.85]">
            "{block.text}"
          </blockquote>
          {(block.source || block.page) && (
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              — {block.source}{block.page ? `, עמ' ${block.page}` : ""}
            </figcaption>
          )}
        </figure>
      );

    case "callout": {
      const color = (block.color || "blue") as keyof typeof CALLOUT_COLORS;
      return (
        <div className={`rounded-2xl border p-4 ${CALLOUT_COLORS[color]}`}>
          {block.title && <div className="font-bold mb-1.5">{block.title}</div>}
          <div className="text-[14px] leading-[1.8]">{block.text}</div>
        </div>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto -mx-2 my-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-600 text-white">
                {(block.headers || []).map((h, i) => (
                  <th key={i} className="px-3 py-2 text-right font-semibold first:rounded-r-lg last:rounded-l-lg">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows || []).map((row, ri) => (
                <tr key={ri} className="border-b border-slate-200/60 dark:border-slate-700/60">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-2 align-top text-slate-700 dark:text-slate-200 leading-relaxed"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}
