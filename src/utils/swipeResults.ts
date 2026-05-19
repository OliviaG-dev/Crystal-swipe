import type { Question, SwipeResult } from '../types';

export function buildResults(
  shuffled: Question[],
  answers: (boolean | undefined)[]
): SwipeResult[] {
  return shuffled.flatMap((question, index) => {
    const answer = answers[index];
    if (answer === undefined) return [];
    return [{ questionId: question.id, liked: answer }];
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
