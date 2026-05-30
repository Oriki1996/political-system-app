/* Extract pure learning content (sections only) from all units -> JSON.
   No quiz / comprehension checks. Uses the TS compiler to safely eval each
   data file (import-type lines are erased, so the modules are self-contained). */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const UNITS_DIR = path.join(__dirname, "..", "src", "content", "units");

function evalTsModule(file) {
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const req = () => ({}); // no runtime imports remain (import type erased)
  new Function("exports", "require", "module", js)(module.exports, req, module);
  return module.exports;
}

function firstExport(mod) {
  const keys = Object.keys(mod).filter((k) => k !== "__esModule");
  return mod[keys[0]];
}

function segText(paragraph) {
  // paragraph is RichSegment[]; concat the .text fields preserving spacing.
  return paragraph.map((s) => (s && typeof s.text === "string" ? s.text : "")).join("");
}

function sectionToClean(sec) {
  const out = { id: sec.id, heading: sec.heading, tldr: sec.tldr || null };
  out.paragraphs = Array.isArray(sec.paragraphs) ? sec.paragraphs.map(segText) : [];
  if (sec.comparison) {
    const c = sec.comparison;
    out.comparison = {
      title: c.title || null,
      leftTitle: c.leftTitle || "",
      leftSubtitle: c.leftSubtitle || "",
      rightTitle: c.rightTitle || "",
      rightSubtitle: c.rightSubtitle || "",
      rows: Array.isArray(c.rows) ? c.rows.map((r) => ({ axis: r.axis, left: r.left, right: r.right })) : [],
    };
  }
  if (sec.quote) out.quote = { text: sec.quote.text, page: sec.quote.page || null, source: sec.quote.source || null };
  if (sec.callout) out.callout = { title: sec.callout.title || null, text: sec.callout.text };
  return out;
}

const result = [];
for (let n = 1; n <= 10; n++) {
  const id = "unit" + String(n).padStart(2, "0");
  const dir = path.join(UNITS_DIR, id);
  if (!fs.existsSync(dir)) continue;

  const meta = firstExport(evalTsModule(path.join(dir, "meta.ts")));

  let parts = [];
  const partsФile = path.join(dir, "parts.ts");
  if (fs.existsSync(partsФile)) {
    try { parts = firstExport(evalTsModule(partsФile)) || []; } catch (e) { parts = []; }
  }

  // load every section file (NN-*.ts), keyed by id, remember filename order
  const secDir = path.join(dir, "sections");
  const files = fs.readdirSync(secDir).filter((f) => /^\d+.*\.ts$/.test(f) && f !== "index.ts").sort();
  const byId = {};
  const fileOrder = [];
  for (const f of files) {
    try {
      const sec = firstExport(evalTsModule(path.join(secDir, f)));
      if (sec && sec.id) { byId[sec.id] = sec; fileOrder.push(sec.id); }
    } catch (e) { console.error("skip", id, f, e.message); }
  }

  // build ordered grouping: parts first, then leftovers
  const used = new Set();
  const groups = [];
  for (const p of parts) {
    const secs = [];
    for (const sid of (p.sectionIds || [])) {
      if (byId[sid]) { secs.push(sectionToClean(byId[sid])); used.add(sid); }
    }
    if (secs.length) groups.push({ partTitle: p.title || null, partSubtitle: p.subtitle || null, sections: secs });
  }
  const leftovers = fileOrder.filter((sid) => !used.has(sid)).map((sid) => sectionToClean(byId[sid]));
  if (leftovers.length) groups.push({ partTitle: parts.length ? "נושאים נוספים" : null, partSubtitle: null, sections: leftovers });

  result.push({
    id,
    number: meta.number,
    title: meta.title,
    subtitle: meta.subtitle || null,
    articles: meta.articles || [],
    leadQuestion: meta.leadQuestion || null,
    objectives: meta.objectives || [],
    groups,
  });
}

result.sort((a, b) => a.number - b.number);
const outFile = path.join(__dirname, "study_content.json");
fs.writeFileSync(outFile, JSON.stringify(result, null, 2), "utf8");
const totalSecs = result.reduce((s, u) => s + u.groups.reduce((x, g) => x + g.sections.length, 0), 0);
console.log("Wrote", outFile, "| units:", result.length, "| sections:", totalSecs);
