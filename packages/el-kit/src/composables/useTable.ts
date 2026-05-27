import type { MaybeRefOrGetter, Ref } from 'vue'
import type { PaginationState, UsePaginationStateOptions } from './usePaginationState'
import { createStateSource } from './stateSource'
import { usePaginationState } from './usePaginationState'

export interface TableColumn<T extends object> {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  visible?: boolean
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  formatter?: (row: T, column: TableColumn<T>, rowIndex: number) => unknown
}

export type UseTablePaginationOptions = UsePaginationStateOptions
export type TablePaginationState = PaginationState

export interface UseTableOptions<T extends object> {
  columns: MaybeRefOrGetter<readonly TableColumn<T>[]>
  data: MaybeRefOrGetter<T[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: UseTablePaginationOptions
}

export interface TableState<T extends object> {
  columns: Ref<readonly TableColumn<T>[]>
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: TablePaginationState
  setColumns: (columns: readonly TableColumn<T>[]) => void
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  resetPage: () => void
}

export function defineTableColumns<T extends object>(
  columns: readonly TableColumn<T>[],
): readonly TableColumn<T>[] {
  return columns
}

export function useTable<T extends object>(options: UseTableOptions<T>): TableState<T> {
  const columns = createStateSource('columns', options.columns)
  const data = createStateSource('data', options.data)
  const loading = createStateSource('loading', options.loading ?? false)
  const pagination = usePaginationState(options.pagination)

  return {
    columns: columns.ref,
    data: data.ref,
    loading: loading.ref,
    pagination,
    resetPage: pagination.resetPage,
    setColumns: columns.set,
    setData: data.set,
    setLoading: loading.set,
    setPage: pagination.setPage,
    setPageSize: pagination.setPageSize,
    setTotal: pagination.setTotal,
  }
}
