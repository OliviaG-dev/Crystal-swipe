import { describe, it, expect } from 'vitest';
import {
  getHistoryPaginationState,
  paginateItems,
  HISTORY_PAGE_SIZE,
} from './historyPagination';

describe('getHistoryPaginationState', () => {
  it('returns a single page when item count fits one page', () => {
    expect(getHistoryPaginationState(2, 0)).toEqual({
      totalPages: 1,
      currentPage: 0,
      showPagination: false,
    });
  });

  it('shows pagination when there are more items than the page size', () => {
    expect(getHistoryPaginationState(5, 0)).toEqual({
      totalPages: 3,
      currentPage: 0,
      showPagination: true,
    });
  });

  it('clamps the page when it exceeds the last page', () => {
    expect(getHistoryPaginationState(3, 99).currentPage).toBe(1);
  });
});

describe('paginateItems', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns the first page of items', () => {
    expect(paginateItems(items, 0).items).toEqual(['a', 'b']);
  });

  it('returns the second page of items', () => {
    const page = paginateItems(items, 1);

    expect(page.items).toEqual(['c', 'd']);
    expect(page.currentPage).toBe(1);
    expect(page.totalPages).toBe(3);
  });

  it('uses the default page size constant', () => {
    expect(HISTORY_PAGE_SIZE).toBe(2);
    expect(paginateItems(items, 0).items).toHaveLength(HISTORY_PAGE_SIZE);
  });
});
