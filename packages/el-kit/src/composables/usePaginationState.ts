import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'

export interface UsePaginationStateOptions {
  currentPage?: MaybeRefOrGetter<number>
  pageSize?: MaybeRefOrGetter<number>
  total?: MaybeRefOrGetter<number>
}

export interface PaginationState {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export function usePaginationState(
  options: UsePaginationStateOptions = {},
): PaginationState {
  const currentPage = createStateSource('pagination.currentPage', options.currentPage ?? 1)
  const pageSize = createStateSource('pagination.pageSize', options.pageSize ?? 10)
  const total = createStateSource('pagination.total', options.total ?? 0)

  return {
    currentPage: currentPage.ref,
    pageSize: pageSize.ref,
    resetPage: () => currentPage.set(1),
    setPage: currentPage.set,
    setPageSize: pageSize.set,
    setTotal: total.set,
    total: total.ref,
  }
}
