import type { ComprehensionQ } from "../types";

function fisherYatesIndices(n: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/**
 * Shuffle a question's options + remap `correct` and `optionExplanations` accordingly.
 * Defeats position-bias leak (correct answer always at index 1 in source) and gives
 * each render a fresh permutation while keeping the answer key coherent.
 */
export function shuffleQuestionOptions(q: ComprehensionQ): ComprehensionQ {
  const n = q.options.length;
  if (n < 2) return q;
  const perm = fisherYatesIndices(n);
  return {
    ...q,
    options: perm.map((i) => q.options[i]),
    correct: perm.indexOf(q.correct),
    optionExplanations: q.optionExplanations
      ? perm.map((i) => q.optionExplanations![i])
      : undefined,
  };
}
