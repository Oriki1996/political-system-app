import { useEffect, useState } from "react";
import HexTile, { type HexTileColor } from "./HexTile";

export interface HoneycombItem {
  title: string;
  subtitle?: string;
  color: HexTileColor;
  Icon?: React.ComponentType<{ size?: number; className?: string }>;
  status?: "unread" | "read" | "locked";
}

interface HoneycombProps {
  items: HoneycombItem[];
  onSelect: (index: number) => void;
}

const COLOR_ROTATION: HexTileColor[] = [
  "blue", "purple", "green", "amber", "rose",
  "cyan", "indigo", "teal", "fuchsia", "red",
];

export function autoColor(index: number): HexTileColor {
  return COLOR_ROTATION[index % COLOR_ROTATION.length];
}

function useColumnsForWidth(maxCols = 5) {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCols(Math.min(maxCols, 5));
      else if (w >= 640) setCols(Math.min(maxCols, 4));
      else setCols(Math.min(maxCols, 3));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [maxCols]);
  return cols;
}

export default function Honeycomb({ items, onSelect }: HoneycombProps) {
  // For 4 items, use 3 columns max (results in row1=3 + row2=2 nicely)
  const maxCols = items.length <= 4 ? 3 : items.length <= 6 ? 4 : 5;
  const cols = useColumnsForWidth(maxCols);

  const rows: { tiles: { item: HoneycombItem; idx: number }[]; offset: boolean }[] = [];
  let i = 0;
  let offsetRow = false;
  while (i < items.length) {
    const take = offsetRow ? cols - 1 : cols;
    const slice = items.slice(i, i + take).map((item, j) => ({ item, idx: i + j }));
    rows.push({ tiles: slice, offset: offsetRow });
    i += take;
    offsetRow = !offsetRow;
  }

  return (
    <div className="honeycomb-rows" dir="ltr">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className={`honeycomb-row ${row.offset ? "honeycomb-row--offset" : ""}`}
          style={{ "--cols": cols } as React.CSSProperties}
        >
          {row.tiles.map(({ item, idx }) => (
            <div key={idx} className="honeycomb-cell">
              <HexTile
                index={idx}
                title={item.title}
                subtitle={item.subtitle}
                color={item.color}
                Icon={item.Icon}
                status={item.status}
                onClick={() => onSelect(idx)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
