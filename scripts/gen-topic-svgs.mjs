// Generate thematic SVG hero images for each unit.
// Each unit gets a unique geometric pattern + Hebrew era label.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "topics");
mkdirSync(OUT, { recursive: true });

const UNITS = [
  { n: 1,  label: "1881–1917",  glyph: "ש",  c1: "#0ea5e9", c2: "#6366f1" }, // ציונות
  { n: 2,  label: "מתודולוגיה", glyph: "ת",  c1: "#06b6d4", c2: "#3b82f6" }, // תיאוריה
  { n: 3,  label: "1917–1948",  glyph: "ת",  c1: "#10b981", c2: "#0d9488" }, // יישוב
  { n: 4,  label: "1948–1977",  glyph: "מ",  c1: "#f59e0b", c2: "#ea580c" }, // מדינה
  { n: 5,  label: "1977",       glyph: "ה",  c1: "#f43f5e", c2: "#ec4899" }, // המהפך
  { n: 6,  label: "1985–1995",  glyph: "נ",  c1: "#8b5cf6", c2: "#d946ef" }, // ניאו-ליברלי
  { n: 7,  label: "1993–2000",  glyph: "א",  c1: "#64748b", c2: "#334155" }, // אוסלו
  { n: 8,  label: "1948–היום",  glyph: "ע",  c1: "#eab308", c2: "#d97706" }, // ערבים
  { n: 9,  label: "2009–2019",  glyph: "ימ", c1: "#ef4444", c2: "#be123c" }, // ימין
  { n: 10, label: "2019–2022",  glyph: "מ",  c1: "#a855f7", c2: "#4f46e5" }, // משבר
];

function svgFor({ n, label, glyph, c1, c2 }) {
  const id = `g${n}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="600" height="240">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="${id}b" cx="80%" cy="20%" r="80%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <pattern id="${id}p" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.18)"/>
    </pattern>
  </defs>
  <rect width="600" height="240" fill="url(#${id})"/>
  <rect width="600" height="240" fill="url(#${id}p)"/>
  <rect width="600" height="240" fill="url(#${id}b)"/>
  <g opacity="0.18" font-family="Heebo, Arial, sans-serif" font-weight="900" fill="#ffffff">
    <text x="540" y="200" font-size="180" text-anchor="end">${glyph}</text>
  </g>
  <g font-family="Heebo, Arial, sans-serif" fill="#ffffff">
    <text x="30" y="50" font-size="13" font-weight="500" opacity="0.85">UNIT ${String(n).padStart(2, "0")}</text>
    <text x="30" y="210" font-size="22" font-weight="700">${label}</text>
  </g>
</svg>`;
}

for (const u of UNITS) {
  const path = resolve(OUT, `unit${String(u.n).padStart(2, "0")}.svg`);
  writeFileSync(path, svgFor(u), "utf8");
}
console.log(`Wrote ${UNITS.length} SVGs to ${OUT}`);

// Site-wide background SVG
const siteBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <radialGradient id="r1" cx="20%" cy="20%" r="60%"><stop offset="0%" stop-color="rgba(167,139,250,0.28)"/><stop offset="100%" stop-color="rgba(167,139,250,0)"/></radialGradient>
    <radialGradient id="r2" cx="80%" cy="30%" r="55%"><stop offset="0%" stop-color="rgba(56,189,248,0.22)"/><stop offset="100%" stop-color="rgba(56,189,248,0)"/></radialGradient>
    <radialGradient id="r3" cx="50%" cy="100%" r="70%"><stop offset="0%" stop-color="rgba(244,114,182,0.18)"/><stop offset="100%" stop-color="rgba(244,114,182,0)"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="#f8fbff"/>
  <rect width="1600" height="900" fill="url(#r1)"/>
  <rect width="1600" height="900" fill="url(#r2)"/>
  <rect width="1600" height="900" fill="url(#r3)"/>
</svg>`;
writeFileSync(resolve(__dirname, "..", "public", "site-bg.svg"), siteBg, "utf8");

// Favicon
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="f" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3196f5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#f)"/>
  <text x="32" y="46" font-family="Arial, sans-serif" font-size="36" font-weight="900" text-anchor="middle" fill="#ffffff">ש</text>
</svg>`;
writeFileSync(resolve(__dirname, "..", "public", "favicon.svg"), favicon, "utf8");
console.log("Wrote site-bg.svg and favicon.svg");
