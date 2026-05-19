import { describe, it, expect } from 'vitest';
import type { Question, SwipeResult } from '../types';
import { stones } from '../data/stones';
import { calculateMatches } from './scoring';

const tourmaline = stones.find((stone) => stone.id === 'tourmaline')!;

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Question test 1',
    icon: '/icons/test.png',
    stoneMatches: { tourmaline: 10, aquamarine: 5 },
  },
  {
    id: 'q2',
    text: 'Question test 2',
    icon: '/icons/test2.png',
    stoneMatches: { aquamarine: 8 },
  },
];

describe('calculateMatches', () => {
  it('returns an empty list when there are no results', () => {
    expect(calculateMatches([], mockQuestions)).toEqual([]);
  });

  it('ignores negative answers', () => {
    const results: SwipeResult[] = [{ questionId: 'q1', liked: false }];

    expect(calculateMatches(results, mockQuestions)).toEqual([]);
  });

  it('ignores answers to unknown questions', () => {
    const results: SwipeResult[] = [{ questionId: 'unknown', liked: true }];

    expect(calculateMatches(results, mockQuestions)).toEqual([]);
  });

  it('computes scores, relative percentages and descending sort', () => {
    const results: SwipeResult[] = [
      { questionId: 'q1', liked: true },
      { questionId: 'q2', liked: true },
    ];

    const matches = calculateMatches(results, mockQuestions);

    expect(matches).toHaveLength(2);
    expect(matches[0].stone.id).toBe('aquamarine');
    expect(matches[0].score).toBe(13);
    expect(matches[0].percentage).toBe(100);
    expect(matches[1].stone.id).toBe('tourmaline');
    expect(matches[1].score).toBe(10);
    expect(matches[1].percentage).toBe(77);
  });

  it('returns at most three stones', () => {
    const multiStoneQuestion: Question = {
      id: 'q-multi',
      text: 'Multi',
      icon: '/icons/multi.png',
      stoneMatches: Object.fromEntries(stones.slice(0, 5).map((stone) => [stone.id, 1])),
    };

    const results: SwipeResult[] = [{ questionId: 'q-multi', liked: true }];
    const matches = calculateMatches(results, [multiStoneQuestion]);

    expect(matches).toHaveLength(3);
  });

  it('returns zero percent when all stone scores are zero', () => {
    const zeroScoreQuestion: Question = {
      id: 'q-zero',
      text: 'Zero',
      icon: '/icons/zero.png',
      stoneMatches: { tourmaline: 0 },
    };

    const results: SwipeResult[] = [{ questionId: 'q-zero', liked: true }];
    const matches = calculateMatches(results, [zeroScoreQuestion]);

    expect(matches).toHaveLength(1);
    expect(matches[0].percentage).toBe(0);
  });

  it('ignores unknown stone ids in question matches', () => {
    const questionWithUnknownStone: Question = {
      id: 'q-unknown-stone',
      text: 'Unknown stone',
      icon: '/icons/unknown.png',
      stoneMatches: { 'not-a-real-stone': 50, tourmaline: 4 },
    };

    const results: SwipeResult[] = [{ questionId: 'q-unknown-stone', liked: true }];
    const matches = calculateMatches(results, [questionWithUnknownStone]);

    expect(matches).toHaveLength(1);
    expect(matches[0].stone).toEqual(tourmaline);
    expect(matches[0].percentage).toBe(100);
  });
});
