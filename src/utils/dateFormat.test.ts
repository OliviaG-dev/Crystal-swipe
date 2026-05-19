import { describe, it, expect } from 'vitest';
import { formatHistoryDate } from './dateFormat';

describe('formatHistoryDate', () => {
  it('formats a date in French locale', () => {
    const formatted = formatHistoryDate('2026-05-17T14:30:00.000Z');

    expect(formatted).toMatch(/\d{2}/);
    expect(formatted.toLowerCase()).toMatch(/mai|may/);
  });
});
