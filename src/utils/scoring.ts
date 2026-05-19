import type { Question, SwipeResult, MatchResult } from '../types';
import { stones } from '../data/stones';

export function calculateMatches(
  results: SwipeResult[],
  questions: Question[]
): MatchResult[] {
  const scores: Record<string, number> = {};

  // Calculer les scores pour chaque pierre
  results.forEach((result) => {
    if (result.liked) {
      const question = questions.find((q) => q.id === result.questionId);
      if (question) {
        Object.entries(question.stoneMatches).forEach(([stoneId, points]) => {
          scores[stoneId] = (scores[stoneId] || 0) + points;
        });
      }
    }
  });

  // Trouver le score maximum (pierres connues uniquement) pour les pourcentages
  const maxScore = Math.max(
    ...Object.keys(scores)
      .filter((stoneId) => stones.some((stone) => stone.id === stoneId))
      .map((stoneId) => scores[stoneId]),
    0
  );

  // Créer les résultats de match
  const matches: MatchResult[] = Object.entries(scores)
    .map(([stoneId, score]) => {
      const stone = stones.find((s) => s.id === stoneId);
      if (!stone) return null;

      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      return {
        stone,
        score,
        percentage,
      };
    })
    .filter((match): match is MatchResult => match !== null)
    .sort((a, b) => b.score - a.score); // Trier par score décroissant

  // Retourner les 3 meilleures pierres
  return matches.slice(0, 3);
}
