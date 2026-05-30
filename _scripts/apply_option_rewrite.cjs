/* Surgically replace `options` and `optionExplanations` arrays of questions by id,
   from _scripts/option_rewrites.json: [{id, options:[..], optionExplanations:[..]}].
   `correct` and all other fields are left untouched. Uses balanced-bracket
   scanning that respects string literals + escapes, so Hebrew gershayim (חד"ש)
   survive via JSON.stringify escaping. */
const fs = require("fs");
const path = require("path");

const rewrites = JSON.parse(fs.readFileSync(path.join(__dirname, "option_rewrites.json"), "utf8"));
const byId = new Map(rewrites.map((r) => [r.id, r]));

const UNITS = path.join(__dirname, "..", "src", "content", "units");

function arrayEnd(text, openIdx) {
  let depth = 0, str = null;
  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (str) { if (ch === "\\") { i++; continue; } if (ch === str) str = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { str = ch; continue; }
    if (ch === "[") depth++;
    else if (ch === "]") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

function serializeArr(items, indent) {
  const pad = " ".repeat(indent);
  return "[\n" + items.map((s) => pad + "  " + JSON.stringify(s)).join(",\n") + ",\n" + pad + "]";
}

const applied = new Set();

function processFile(fp) {
  let text = fs.readFileSync(fp, "utf8");
  const spans = []; // {start, end, replacement}
  for (const [qid, r] of byId) {
    const idRe = new RegExp('id:\\s*"' + qid.replace(/[-]/g, "\\-") + '"');
    const m = idRe.exec(text);
    if (!m) continue;
    const objStart = m.index;
    // bound to before the next question id
    const nextId = /\n\s*id:\s*"u\d\d-s\d\d-q\d"/.exec(text.slice(objStart + 5));
    const bound = nextId ? objStart + 5 + nextId.index : text.length;
    const region = text.slice(objStart, bound);
    for (const [key, val] of [["options", r.options], ["optionExplanations", r.optionExplanations]]) {
      const kRe = new RegExp(key + ":\\s*\\[");
      const km = kRe.exec(region);
      if (!km) continue;
      const open = objStart + km.index + km[0].length - 1; // index of '['
      const close = arrayEnd(text, open);
      if (close < 0) continue;
      // indent = leading spaces of the key line
      const lineStart = text.lastIndexOf("\n", objStart + km.index) + 1;
      const indent = (text.slice(lineStart).match(/^ */) || [""])[0].length;
      spans.push({ start: open, end: close + 1, replacement: serializeArr(val, indent) });
    }
    applied.add(qid);
  }
  if (!spans.length) return false;
  spans.sort((a, b) => b.start - a.start);
  for (const s of spans) text = text.slice(0, s.start) + s.replacement + text.slice(s.end);
  fs.writeFileSync(fp, text, "utf8");
  return true;
}

for (let n = 1; n <= 10; n++) {
  const dir = path.join(UNITS, "unit" + String(n).padStart(2, "0"));
  const secDir = path.join(dir, "sections");
  if (fs.existsSync(secDir)) for (const f of fs.readdirSync(secDir)) {
    if (/^\d+.*\.ts$/.test(f) && f !== "index.ts") processFile(path.join(secDir, f));
  }
  const appFile = path.join(dir, "quiz", "application.ts");
  if (fs.existsSync(appFile)) processFile(appFile);
}

const missing = [...byId.keys()].filter((q) => !applied.has(q));
console.log(`Applied option rewrites to ${applied.size}/${byId.size} questions.`);
if (missing.length) console.log("NOT FOUND:", missing.join(", "));
