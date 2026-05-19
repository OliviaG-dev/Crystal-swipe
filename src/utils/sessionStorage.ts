import type { SwipeResult, SwipeSession } from '../types';

export function getInitialSession(): SwipeSession | null {
  try {
    const savedSession = localStorage.getItem('swipeSession');
    if (savedSession) {
      const session: SwipeSession = JSON.parse(savedSession);
      if (Array.isArray(session.results)) return session;
    }

    const saved = localStorage.getItem('swipeResults');
    if (!saved) return null;
    const results: SwipeResult[] = JSON.parse(saved);

    return {
      id: `legacy-${Date.now()}`,
      completedAt: new Date().toISOString(),
      results,
    };
  } catch {
    return null;
  }
}
