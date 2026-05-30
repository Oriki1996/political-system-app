/* Apply objective level corrections to inline section comprehension questions.
   Criterion is crisp: "integration" = synthesis ACROSS sections/authors only.
   - fake integration (single-section) -> critical / recall
   - genuine cross-author synthesis (was critical) -> integration
   - one transfer-to-new-case question -> apply
   We deliberately DO NOT touch the subjective critical<->recall boundary. */
const fs = require("fs");
const path = require("path");

const MAP = {
  // transfer a concept to a NEW case not in the text
  "u01-s04-q2": "apply",
  // genuine cross-author / cross-unit synthesis (was mislabeled critical)
  "u01-s14-q3": "integration", "u01-s22-q3": "integration",
  "u03-s12-q3": "integration", "u05-s09-q3": "integration",
  "u06-s14-q1": "integration", "u06-s14-q3": "integration",
  "u07-s14-q2": "integration",
  // fake "integration" on single-section analytical questions -> critical
  "u03-s06-q3": "critical",
  "u06-s01-q3": "critical", "u06-s05-q3": "critical", "u06-s08-q3": "critical",
  "u06-s10-q3": "critical", "u06-s12-q3": "critical", "u06-s13-q3": "critical",
  "u09-s01-q2": "critical", "u09-s02-q2": "critical", "u09-s03-q2": "critical",
  "u09-s04-q2": "critical", "u09-s05-q2": "critical", "u09-s07-q2": "critical",
  "u09-s08-q2": "critical", "u09-s09-q2": "critical", "u09-s10-q2": "critical",
  "u09-s11-q2": "critical", "u09-s12-q2": "critical", "u09-s13-q2": "critical",
  "u10-s01-q2": "critical", "u10-s02-q2": "critical", "u10-s03-q2": "critical",
  "u10-s04-q2": "critical", "u10-s09-q2": "critical", "u10-s10-q2": "critical",
  "u10-s13-q2": "critical",
  // fake "integration" that is actually a stated definition/list/datum -> recall
  "u04-s05-q3": "recall",
  "u05-s14-q2": "recall",
  "u06-s07-q2": "recall", "u06-s09-q3": "recall", "u06-s11-q3": "recall",
  "u08-s07-q2": "recall", "u08-s09-q2": "recall", "u08-s11-q2": "recall",
  "u08-s13-q2": "recall", "u08-s14-q2": "recall",
  "u10-s06-q2": "recall",
};

const UNITS = path.join(__dirname, "..", "src", "content", "units");
const found = new Set();
let edits = 0;

for (let n = 1; n <= 10; n++) {
  const secDir = path.join(UNITS, "unit" + String(n).padStart(2, "0"), "sections");
  if (!fs.existsSync(secDir)) continue;
  for (const f of fs.readdirSync(secDir)) {
    if (!/^\d+.*\.ts$/.test(f) || f === "index.ts") continue;
    const fp = path.join(secDir, f);
    let txt = fs.readFileSync(fp, "utf8");
    let changed = false;
    for (const [qid, level] of Object.entries(MAP)) {
      // match this question's own id then its level field (level follows id)
      const re = new RegExp('(id:\\s*"' + qid.replace(/[-]/g, "\\-") + '",\\s*\\n\\s*level:\\s*")[^"]*(")');
      if (re.test(txt)) {
        txt = txt.replace(re, "$1" + level + "$2");
        found.add(qid); changed = true; edits++;
      }
    }
    if (changed) fs.writeFileSync(fp, txt, "utf8");
  }
}

const missing = Object.keys(MAP).filter((q) => !found.has(q));
console.log("Applied", edits, "level changes.");
if (missing.length) console.log("NOT FOUND (check id/level shape):", missing.join(", "));
else console.log("All", Object.keys(MAP).length, "mapped ids matched.");
