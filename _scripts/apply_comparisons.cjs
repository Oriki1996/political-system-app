/* Insert a `comparison: {...}` block (drawn from each section's own prose) into
   sections that present a binary contrast but lack a table. Inserts right before
   `comprehensionChecks:`. Skips any section that already has a comparison. */
const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "comparisons_to_add.json"), "utf8"));
const UNITS = path.join(__dirname, "..", "src", "content", "units");

function q(s) { return JSON.stringify(s); } // proper TS string literal (escapes " and \)

function serialize(c) {
  const L = [];
  L.push("    comparison: {");
  if (c.title != null) L.push(`      title: ${q(c.title)},`);
  L.push(`      leftTitle: ${q(c.leftTitle)},`);
  if (c.leftSubtitle != null) L.push(`      leftSubtitle: ${q(c.leftSubtitle)},`);
  L.push(`      rightTitle: ${q(c.rightTitle)},`);
  if (c.rightSubtitle != null) L.push(`      rightSubtitle: ${q(c.rightSubtitle)},`);
  if (c.leftColor) L.push(`      leftColor: ${q(c.leftColor)},`);
  if (c.rightColor) L.push(`      rightColor: ${q(c.rightColor)},`);
  L.push("      rows: [");
  for (const r of c.rows) L.push(`        { axis: ${q(r.axis)}, left: ${q(r.left)}, right: ${q(r.right)} },`);
  L.push("      ],");
  L.push("    },");
  return L.join("\n");
}

// build sectionId -> file path index
const fileById = {};
for (let n = 1; n <= 10; n++) {
  const dir = path.join(UNITS, "unit" + String(n).padStart(2, "0"), "sections");
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!/^\d+.*\.ts$/.test(f) || f === "index.ts") continue;
    const fp = path.join(dir, f);
    const m = fs.readFileSync(fp, "utf8").match(/^\s*id:\s*"([^"]+)"/m);
    if (m) fileById[m[1]] = fp;
  }
}

let applied = 0;
const problems = [];
for (const item of data) {
  const fp = fileById[item.sectionId];
  if (!fp) { problems.push(`no file for ${item.sectionId}`); continue; }
  let txt = fs.readFileSync(fp, "utf8");
  if (/^\s*comparison:\s*\{/m.test(txt)) { problems.push(`${item.sectionId} already has comparison — skipped`); continue; }
  const anchor = txt.match(/\n(\s*)comprehensionChecks:/);
  if (!anchor) { problems.push(`${item.sectionId} has no comprehensionChecks anchor`); continue; }
  const block = serialize(item.comparison);
  txt = txt.replace(/\n(\s*)comprehensionChecks:/, "\n" + block + "\n$1comprehensionChecks:");
  fs.writeFileSync(fp, txt, "utf8");
  applied++;
}
console.log(`Inserted ${applied} comparison tables.`);
if (problems.length) console.log("Notes:\n - " + problems.join("\n - "));
