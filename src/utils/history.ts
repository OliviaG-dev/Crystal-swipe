import type { HistoryEntry, MatchResult, SwipeSession } from '../types';

const HISTORY_KEY = 'swipeHistory';
const MAX_HISTORY_ITEMS = 10;

export function getSwipeHistory(): HistoryEntry[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];

    const history = JSON.parse(saved);
    if (!Array.isArray(history)) return [];

    return history.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export function saveSwipeHistoryEntry(
  session: SwipeSession,
  matches: MatchResult[]
): HistoryEntry[] {
  const history = getSwipeHistory();

  if (history.some((entry) => entry.id === session.id)) {
    return history;
  }

  const entry: HistoryEntry = {
    id: session.id,
    completedAt: session.completedAt,
    matches,
  };

  const nextHistory = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

  return nextHistory;
}

export function clearSwipeHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function isHistoryEntry(entry: unknown): entry is HistoryEntry {
  if (!entry || typeof entry !== 'object') return false;

  const candidate = entry as Partial<HistoryEntry>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.completedAt === 'string' &&
    Array.isArray(candidate.matches)
  );
}
