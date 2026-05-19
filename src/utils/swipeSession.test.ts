import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import type { Question } from '../types';
import { createSessionId, saveSwipeSessionAndGoToResults } from './swipeSession';

const mockQuestions: Question[] = [
  { id: 'q1', text: 'Q1', icon: '/icons/1.png', stoneMatches: {} },
  { id: 'q2', text: 'Q2', icon: '/icons/2.png', stoneMatches: {} },
];

describe('createSessionId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses crypto.randomUUID when available', () => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'uuid-test') });

    expect(createSessionId()).toBe('uuid-test');
  });

  it('falls back to a timestamp-based id when randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {});

    const sessionId = createSessionId();

    expect(sessionId).toMatch(/^\d+-[a-z0-9]+$/);
  });
});

describe('saveSwipeSessionAndGoToResults', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists results, session and navigates to results', () => {
    const navigate = vi.fn();

    saveSwipeSessionAndGoToResults(
      mockQuestions,
      [true, undefined],
      navigate
    );

    expect(navigate).toHaveBeenCalledWith('/results');
    expect(JSON.parse(localStorage.getItem('swipeResults')!)).toEqual([
      { questionId: 'q1', liked: true },
    ]);

    const session = JSON.parse(localStorage.getItem('swipeSession')!);
    expect(session.results).toEqual([{ questionId: 'q1', liked: true }]);
    expect(session.id).toBeTruthy();
    expect(session.completedAt).toBeTruthy();
  });
});
