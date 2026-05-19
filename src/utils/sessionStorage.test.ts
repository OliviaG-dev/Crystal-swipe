import { beforeEach, describe, it, expect } from 'vitest';
import { getInitialSession } from './sessionStorage';

const validResults = [{ questionId: '1', liked: true }];

describe('getInitialSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns a valid swipeSession from storage', () => {
    const session = {
      id: 'session-1',
      completedAt: '2026-05-17T12:00:00.000Z',
      results: validResults,
    };
    localStorage.setItem('swipeSession', JSON.stringify(session));

    expect(getInitialSession()).toEqual(session);
  });

  it('falls back to legacy swipeResults when swipeSession is missing', () => {
    localStorage.setItem('swipeResults', JSON.stringify(validResults));

    const session = getInitialSession();

    expect(session?.results).toEqual(validResults);
    expect(session?.id).toMatch(/^legacy-/);
    expect(session?.completedAt).toBeTruthy();
  });

  it('falls back to swipeResults when swipeSession has no results array', () => {
    localStorage.setItem(
      'swipeSession',
      JSON.stringify({ id: 'broken', completedAt: '2026-05-17T12:00:00.000Z' })
    );
    localStorage.setItem('swipeResults', JSON.stringify(validResults));

    const session = getInitialSession();

    expect(session?.results).toEqual(validResults);
    expect(session?.id).toMatch(/^legacy-/);
  });

  it('returns null when storage is empty', () => {
    expect(getInitialSession()).toBeNull();
  });

  it('returns null when stored JSON is invalid', () => {
    localStorage.setItem('swipeSession', '{invalid');

    expect(getInitialSession()).toBeNull();
  });
});
