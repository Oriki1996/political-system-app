import type { ComprehensionQ } from "../types";

const KEY_PREFIX = "psi-scores:";

/** Points per question level (overridable via settings later) */
export function pointsFor(q: ComprehensionQ): number {
  if (q.difficulty === "hard") return 4;
  if (q.level === "critical" || q.level === "integration") return 4;
  return 2;
}

interface ScoreEntry {
  qId: string;
  /** Best (highest) points the user earned on this question across attempts */
  best: number;
  /** Max points the question is worth */
  max: number;
  /** Number of times answered */
  attempts: number;
  lastAt: number;
}

type ScoreMap = Record<string, ScoreEntry>;

function k(unitId: string) {
  return `${KEY_PREFIX}${unitId}`;
}

function readAll(unitId: string): ScoreMap {
  try {
    return JSON.parse(localStorage.getItem(k(unitId)) || "{}");
  } catch {
    return {};
  }
}

function writeAll(unitId: string, data: ScoreMap) {
  localStorage.setItem(k(unitId), JSON.stringify(data));
  // Notify subscribers (UnitView/Dashboard) to refresh.
  window.dispatchEvent(new CustomEvent("psi-score-changed", { detail: { unitId } }));
}

/** Record an attempt: pass `gotItRight`. Max points already computed from question. */
export function recordAttempt(unitId: string, q: ComprehensionQ, gotItRight: boolean) {
  if (!q.id) return;
  const all = readAll(unitId);
  const max = pointsFor(q);
  const e = all[q.id] || { qId: q.id, best: 0, max, attempts: 0, lastAt: 0 };
  e.max = max;
  e.attempts += 1;
  e.lastAt = Date.now();
  if (gotItRight && max > e.best) {
    e.best = max;
  }
  all[q.id] = e;
  writeAll(unitId, all);
}

/** Total points earned + total possible across the *given* question set */
export function getUnitScore(unitId: string, questions: ComprehensionQ[]) {
  const all = readAll(unitId);
  let earned = 0;
  let possible = 0;
  for (const q of questions) {
    const max = pointsFor(q);
    possible += max;
    if (q.id && all[q.id]) earned += all[q.id].best;
  }
  return { earned, possible };
}

export function clearUnitScore(unitId: string) {
  localStorage.removeItem(k(unitId));
  window.dispatchEvent(new CustomEvent("psi-score-changed", { detail: { unitId } }));
}

export function clearAllScores() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(KEY_PREFIX)) localStorage.removeItem(key);
  }
  window.dispatchEvent(new CustomEvent("psi-score-changed", { detail: {} }));
}
