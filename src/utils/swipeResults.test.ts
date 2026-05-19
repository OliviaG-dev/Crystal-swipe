import { describe, it, expect } from 'vitest';
import type { Question } from '../types';
import { buildResults, shuffleArray } from './swipeResults';

const mockQuestions: Question[] = [
  { id: 'q-a', text: 'A', icon: '/icons/a.png', stoneMatches: {} },
  { id: 'q-b', text: 'B', icon: '/icons/b.png', stoneMatches: {} },
  { id: 'q-c', text: 'C', icon: '/icons/c.png', stoneMatches: {} },
];

describe('buildResults', () => {
  it('returns an empty list when every answer was skipped', () => {
    const answers = [undefined, undefined, undefined];

    expect(buildResults(mockQuestions, answers)).toEqual([]);
  });

  it('includes yes and no answers and excludes skipped questions', () => {
    const answers: (boolean | undefined)[] = [true, undefined, false];

    expect(buildResults(mockQuestions, answers)).toEqual([
      { questionId: 'q-a', liked: true },
      { questionId: 'q-c', liked: false },
    ]);
  });

  it('maps answers by shuffled question order', () => {
    const shuffled: Question[] = [
      mockQuestions[2],
      mockQuestions[0],
      mockQuestions[1],
    ];
    const answers: (boolean | undefined)[] = [true, false, undefined];

    expect(buildResults(shuffled, answers)).toEqual([
      { questionId: 'q-c', liked: true },
      { questionId: 'q-a', liked: false },
    ]);
  });
});

describe('shuffleArray', () => {
  it('returns an empty array for empty input', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];

    shuffleArray(input);

    expect(input).toEqual(copy);
  });

  it('returns a permutation with the same elements', () => {
    const input = ['alpha', 'beta', 'gamma', 'delta'];
    const shuffled = shuffleArray(input);

    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort()).toEqual([...input].sort());
  });
});
