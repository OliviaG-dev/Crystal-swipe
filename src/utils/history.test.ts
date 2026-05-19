import { beforeEach, describe, it, expect } from 'vitest';
import type { HistoryEntry, MatchResult, SwipeSession } from '../types';
import { stones } from '../data/stones';
import {
  clearSwipeHistory,
  getSwipeHistory,
  saveSwipeHistoryEntry,
} from './history';

const HISTORY_KEY = 'swipeHistory';

function createMatch(stoneId: string, score = 10, percentage = 100): MatchResult {
  const stone = stones.find((item) => item.id === stoneId)!;
  return { stone, score, percentage };
}

function createSession(id: string): SwipeSession {
  return {
    id,
    completedAt: '2026-05-17T12:00:00.000Z',
    results: [],
  };
}

describe('getSwipeHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when storage is empty', () => {
    expect(getSwipeHistory()).toEqual([]);
  });

  it('returns an empty array when storage is invalid JSON', () => {
    localStorage.setItem(HISTORY_KEY, '{not-json');
    expect(getSwipeHistory()).toEqual([]);
  });

  it('returns an empty array when storage is not an array', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ id: 'x' }));
    expect(getSwipeHistory()).toEqual([]);
  });

  it('filters out invalid entries', () => {
    const validEntry: HistoryEntry = {
      id: 'valid-1',
      completedAt: '2026-05-17T12:00:00.000Z',
      matches: [createMatch('tourmaline')],
    };

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([validEntry, { id: 42 }, null, 'invalid'])
    );

    expect(getSwipeHistory()).toEqual([validEntry]);
  });
});

describe('saveSwipeHistoryEntry', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('prepends a new entry and persists it', () => {
    const session = createSession('session-1');
    const matches = [createMatch('tourmaline')];

    const saved = saveSwipeHistoryEntry(session, matches);

    expect(saved).toHaveLength(1);
    expect(saved[0]).toEqual({
      id: 'session-1',
      completedAt: session.completedAt,
      matches,
    });
    expect(getSwipeHistory()).toEqual(saved);
  });

  it('does not duplicate an entry with the same session id', () => {
    const session = createSession('session-1');
    const matches = [createMatch('tourmaline')];

    saveSwipeHistoryEntry(session, matches);
    const secondSave = saveSwipeHistoryEntry(session, [
      createMatch('aquamarine', 5, 100),
    ]);

    expect(secondSave).toHaveLength(1);
    expect(secondSave[0].matches[0].stone.id).toBe('tourmaline');
  });

  it('keeps only the 10 most recent entries', () => {
    const firstMatches = [createMatch('tourmaline')];

    for (let index = 0; index < 11; index += 1) {
      saveSwipeHistoryEntry(createSession(`session-${index}`), firstMatches);
    }

    const history = getSwipeHistory();

    expect(history).toHaveLength(10);
    expect(history[0].id).toBe('session-10');
    expect(history[9].id).toBe('session-1');
  });
});

describe('clearSwipeHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes all stored history', () => {
    saveSwipeHistoryEntry(createSession('session-1'), [createMatch('tourmaline')]);

    clearSwipeHistory();

    expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
    expect(getSwipeHistory()).toEqual([]);
  });
});
