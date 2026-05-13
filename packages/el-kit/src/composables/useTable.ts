import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  isReadonly,
  isRef,
  shallowRef,
} from 'vue'

export interface TableColumn<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  visible?: boolean
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  formatter?: (row: T, column: TableColumn<T>, rowIndex: number) => unknown
}

export interface UseTablePaginationOptions {
  currentPage?: MaybeRefOrGetter<number>
  pageSize?: MaybeRefOrGetter<number>
  total?: MaybeRefOrGetter<number>
}

export interface UseTableOptions<T extends object> {
  columns: MaybeRefOrGetter<TableColumn<T>[]>
  data: MaybeRefOrGetter<T[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: UseTablePaginationOptions
}

export interface TablePaginationState {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
}

export interface TableState<T extends object> {
  columns: Ref<TableColumn<T>[]>
  data: Ref<T[]>
  loading: Ref<boolean>
  pagination: TablePaginationState
  setColumns: (columns: TableColumn<T>[]) => void
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
}

interface StateSource<T> {
  ref: Ref<T>
  set: (value: T) => void
}

function createStateSource<T>(
  name: string,
  source: MaybeRefOrGetter<T>,
): StateSource<T> {
  const state = isRef(source)
    ? source
    : typeof source === 'function'
      ? computed(source as () => T)
      : shallowRef(source)

  return {
    ref: state as Ref<T>,
    set(value: T) {
      if (isReadonly(state)) {
        throw new Error(`${name} is readonly`)
      }

      const writableState = state as Ref<T>
      writableState.value = value
    },
  }
}

export function useTable<T extends object>(options: UseTableOptions<T>): TableState<T> {
  const columns = createStateSource('columns', options.columns)
  const data = createStateSource('data', options.data)
  const loading = createStateSource('loading', options.loading ?? false)
  const currentPage = createStateSource('pagination.currentPage', options.pagination?.currentPage ?? 1)
  const pageSize = createStateSource('pagination.pageSize', options.pagination?.pageSize ?? 10)
  const total = createStateSource('pagination.total', options.pagination?.total ?? 0)

  return {
    columns: columns.ref,
    data: data.ref,
    loading: loading.ref,
    pagination: {
      currentPage: currentPage.ref,
      pageSize: pageSize.ref,
      total: total.ref,
    },
    setColumns: columns.set,
    setData: data.set,
    setLoading: loading.set,
    setPage: currentPage.set,
    setPageSize: pageSize.set,
    setTotal: total.set,
  }
}
