/* Measure length bias: how often is the correct option the longest?
   Pure data — no guessing. Covers every comprehension question (section
   checks + application exam pools). */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const UNITS = path.join(__dirname, "..", "src", "content", "units");

function evalTs(file) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const m = { exports: {} };
  new Function("exports", "require", "module", js)(m.exports, () => ({}), m);
  return m.exports;
}
const firstExport = (mod) => mod[Object.keys(mod).filter((k) => k !== "__esModule")[0]];

function collectUnit(n) {
  const id = "unit" + String(n).padStart(2, "0");
  const dir = path.join(UNITS, id);
  const qs = [];
  // section checks
  const secDir = path.join(dir, "sections");
  for (const f of fs.readdirSync(secDir)) {
    if (!/^\d+.*\.ts$/.test(f) || f === "index.ts") continue;
    const sec = firstExport(evalTs(path.join(secDir, f)));
    for (const q of sec.comprehensionChecks || []) if (q.options && q.correct != null) qs.push(q);
  }
  // application exam pool
  const appFile = path.join(dir, "quiz", "application.ts");
  if (fs.existsSync(appFile)) {
    const app = firstExport(evalTs(appFile));
    if (Array.isArray(app)) for (const q of app) if (q.options && q.correct != null) qs.push(q);
  }
  return { id, qs };
}

function analyze(qs) {
  let n = 0, strictLongest = 0, longestOrTied = 0, over25 = 0, sumRatio = 0;
  for (const q of qs) {
    const lens = q.options.map((o) => (o || "").length);
    const c = lens[q.correct];
    const max = Math.max(...lens);
    const others = lens.filter((_, i) => i !== q.correct);
    const meanOther = others.reduce((a, b) => a + b, 0) / others.length;
    n++;
    if (c === max && lens.filter((l) => l === max).length === 1) strictLongest++;
    if (c >= max) longestOrTied++;
    const ratio = meanOther > 0 ? c / meanOther : 1;
    sumRatio += ratio;
    if (ratio > 1.25) over25++;
  }
  return { n, strictLongest, longestOrTied, over25, avgRatio: sumRatio / n };
}

console.log("unit | Qs | correct=strictly-longest | longest-or-tied | correct >25% longer | avg(len ratio)");
let all = [];
for (let i = 1; i <= 10; i++) {
  const { id, qs } = collectUnit(i);
  all = all.concat(qs);
  const a = analyze(qs);
  const pct = (x) => (100 * x / a.n).toFixed(0) + "%";
  console.log(`${id} | ${a.n} | ${pct(a.strictLongest)} | ${pct(a.longestOrTied)} | ${pct(a.over25)} | ${a.avgRatio.toFixed(2)}`);
}
const T = analyze(all);
const pct = (x) => (100 * x / T.n).toFixed(0) + "%";
console.log("-----");
console.log(`ALL | ${T.n} | strictly-longest ${pct(T.strictLongest)} | longest-or-tied ${pct(T.longestOrTied)} | >25% longer ${pct(T.over25)} | avg ratio ${T.avgRatio.toFixed(2)}`);
console.log(`(random baseline for "longest" with 4 options ≈ 25%)`);
