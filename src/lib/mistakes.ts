// Track wrong-answered question IDs per unit in localStorage.
// Used for Smart Practice mode.
const KEY_PREFIX = "psi-mistakes:";

export interface MistakeEntry {
  qId: string;
  /** Times answered wrong (incremented). */
  wrongCount: number;
  /** Times answered right since last wrong (resets to 0 on wrong). */
  rightStreak: number;
  /** Last attempt timestamp */
  lastAt: number;
}

function k(unitId: string) {
  return `${KEY_PREFIX}${unitId}`;
}

function readAll(unitId: string): Record<string, MistakeEntry> {
  try {
    return JSON.parse(localStorage.getItem(k(unitId)) || "{}");
  } catch {
    return {};
  }
}

function writeAll(unitId: string, data: Record<string, MistakeEntry>) {
  localStorage.setItem(k(unitId), JSON.stringify(data));
}

export function recordWrong(unitId: string, qId: string) {
  const all = readAll(unitId);
  const e = all[qId] || { qId, wrongCount: 0, rightStreak: 0, lastAt: 0 };
  e.wrongCount += 1;
  e.rightStreak = 0;
  e.lastAt = Date.now();
  all[qId] = e;
  writeAll(unitId, all);
}

export function recordRight(unitId: string, qId: string) {
  const all = readAll(unitId);
  const e = all[qId];
  if (!e) return; // never been wrong → don't track
  e.rightStreak += 1;
  e.lastAt = Date.now();
  // Mastered after 2 consecutive correct attempts → remove from mistakes
  if (e.rightStreak >= 2) {
    delete all[qId];
  } else {
    all[qId] = e;
  }
  writeAll(unitId, all);
}

export function getMistakeIds(unitId: string): string[] {
  return Object.keys(readAll(unitId));
}

export function getMistakeCount(unitId: string): number {
  return getMistakeIds(unitId).length;
}

export function clearMistakes(unitId: string) {
  localStorage.removeItem(k(unitId));
}
