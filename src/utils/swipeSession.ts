import type { Question, SwipeSession } from '../types';
import { buildResults } from './swipeResults';

export function createSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function saveSwipeSessionAndGoToResults(
  shuffled: Question[],
  answers: (boolean | undefined)[],
  navigate: (path: string) => void
): void {
  const finalResults = buildResults(shuffled, answers);
  const session: SwipeSession = {
    id: createSessionId(),
    completedAt: new Date().toISOString(),
    results: finalResults,
  };

  localStorage.setItem('swipeResults', JSON.stringify(finalResults));
  localStorage.setItem('swipeSession', JSON.stringify(session));
  navigate('/results');
}
