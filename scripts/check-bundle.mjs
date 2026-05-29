#!/usr/bin/env node
/**
 * Bundle smoke test — run after `npm run build`.
 * Guards the code-splitting win: fails if the app collapses back into one giant
 * chunk, or if any single JS chunk blows past the budget. Also asserts that
 * per-unit chunks are emitted (i.e. content is actually lazy-loaded).
 *
 * Usage: npm run build && node scripts/check-bundle.mjs
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ASSETS = "dist/assets";
// Max raw size for any single JS chunk. The old single bundle was ~3.2 MB;
// the largest legitimate chunk today (unit01, with its big exam bank) is ~0.4 MB.
const MAX_CHUNK_BYTES = 600 * 1024;

let files;
try {
  files = readdirSync(ASSETS).filter((f) => f.endsWith(".js"));
} catch {
  console.error(`✗ ${ASSETS} not found — run "npm run build" first.`);
  process.exit(1);
}

const errors = [];

// 1) No oversized chunk (regression to a monolithic bundle).
for (const f of files) {
  const bytes = statSync(join(ASSETS, f)).size;
  if (bytes > MAX_CHUNK_BYTES) {
    errors.push(`chunk too large: ${f} = ${(bytes / 1024).toFixed(0)} KB > ${MAX_CHUNK_BYTES / 1024} KB`);
  }
}

// 2) Per-unit chunks must exist (content is code-split, not eagerly bundled).
const unitChunks = files.filter((f) => /^unit\d+-/.test(f));
if (unitChunks.length < 10) {
  errors.push(`expected ≥10 per-unit chunks, found ${unitChunks.length} — content may not be lazy-loaded`);
}

// 3) The UnitView view chunk must be split out (lazy route boundary).
if (!files.some((f) => f.startsWith("UnitView-"))) {
  errors.push("UnitView chunk missing — the unit view is not code-split");
}

if (errors.length) {
  console.error("✗ bundle check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(`✓ bundle check passed — ${files.length} JS chunks, ${unitChunks.length} unit chunks, none over ${MAX_CHUNK_BYTES / 1024} KB`);
