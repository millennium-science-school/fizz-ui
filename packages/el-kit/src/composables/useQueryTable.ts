import type { Ref } from 'vue'
import type { PaginationState } from './usePaginationState'
import type { QueryState } from './useQueryState'
import type { TableColumn, TableState } from './useTable'
import { shallowRef } from 'vue'
import { usePaginationState } from './usePaginationState'
import { useQueryState } from './useQueryState'
import { useTable } from './useTable'

export type MaybePromise<T> = T | Promise<T>

export interface QueryTableRequest<Query extends object> {
  query: Query
  currentPage: number
  pageSize: number
}

export interface QueryTableResult<Row extends object> {
  data: readonly Row[]
  total: number
}

export interface UseQueryTableOptions<Row extends object, Query extends object> {
  query: Query
  columns: readonly TableColumn<Row>[]
  fetchList?: (
    request: QueryTableRequest<Query>,
  ) => MaybePromise<QueryTableResult<Row>>
  immediate?: boolean
  pageSize?: number
}

export interface QueryTableState<Row extends object, Query extends object> {
  query: QueryState<Query>
  table: TableState<Row>
  pagination: PaginationState
  loading: Ref<boolean>
  pending: Promise<void> | undefined
  submit: () => Promise<void>
  reset: () => Promise<void>
  refresh: () => Promise<void>
  setPage: (page: number) => Promise<void>
  setPageSize: (size: number) => Promise<void>
}

function cloneQuery<Query extends object>(query: Query): Query {
  return { ...query }
}

export function useQueryTable<Row extends object, Query extends object>(
  options: UseQueryTableOptions<Row, Query>,
): QueryTableState<Row, Query> {
  const query = useQueryState<Query>({
    model: options.query,
  })
  const pagination = usePaginationState({
    pageSize: options.pageSize ?? 10,
  })
  const loading = shallowRef(false)
  const table = useTable<Row>({
    columns: options.columns,
    data: [],
    loading,
    pagination: {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
    },
  })

  let requestSeq = 0

  async function refresh() {
    if (!options.fetchList) {
      loading.value = false
      return
    }

    loading.value = true
    const seq = ++requestSeq

    try {
      const result = await options.fetchList({
        currentPage: pagination.currentPage.value,
        pageSize: pagination.pageSize.value,
        query: cloneQuery(query.model.value),
      })
      if (seq !== requestSeq)
        return
      table.setData([...result.data])
      pagination.setTotal(result.total)
    }
    finally {
      if (seq === requestSeq)
        loading.value = false
    }
  }

  async function submit() {
    pagination.resetPage()
    await refresh()
  }

  async function reset() {
    query.reset()
    pagination.resetPage()
    await refresh()
  }

  async function setPage(page: number) {
    pagination.setPage(page)
    await refresh()
  }

  async function setPageSize(size: number) {
    pagination.setPageSize(size)
    pagination.resetPage()
    await refresh()
  }

  const state: QueryTableState<Row, Query> = {
    loading,
    pagination,
    pending: undefined,
    query,
    refresh,
    reset,
    setPage,
    setPageSize,
    submit,
    table,
  }

  if (options.immediate) {
    state.pending = refresh()
  }

  return state
}
