export const HISTORY_PAGE_SIZE = 2;

export interface HistoryPaginationState {
  totalPages: number;
  currentPage: number;
  showPagination: boolean;
}

export function getHistoryPaginationState(
  itemCount: number,
  page: number,
  pageSize = HISTORY_PAGE_SIZE
): HistoryPaginationState {
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const currentPage = Math.min(page, totalPages - 1);

  return {
    totalPages,
    currentPage,
    showPagination: totalPages > 1,
  };
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = HISTORY_PAGE_SIZE
): HistoryPaginationState & { items: T[] } {
  const pagination = getHistoryPaginationState(items.length, page, pageSize);
  const start = pagination.currentPage * pageSize;

  return {
    ...pagination,
    items: items.slice(start, start + pageSize),
  };
}
