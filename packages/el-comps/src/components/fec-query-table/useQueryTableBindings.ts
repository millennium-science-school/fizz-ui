import type { QueryTableState } from '@fizz/el-kit'
import type { ComputedRef } from 'vue'
import type { FecQueryModel } from '../shared/types'
import type { FecQueryTableProps } from './props'
import { computed } from 'vue'

/**
 * Reactive bindings that connect a `QueryTableState` (from `useQueryTable`)
 * to `FecQueryTable` props and events.
 *
 * Returns a `ComputedRef` so `query` and `columns` stay in sync with the state.
 * Assign to a top-level `<script setup>` variable and spread with `v-bind`:
 *
 * ```ts
 * const queryTableBindings = useFecQueryTableBindings(list)
 * ```
 *
 * ```vue
 * <FecQueryTable v-bind="queryTableBindings" :query-schema="querySchema" />
 * ```
 *
 * App-specific props (`querySchema`, `toolbarActions`, `rowActions`, etc.)
 * remain explicit on the component.
 */

export type FecQueryTableBindings<
  Row extends object,
  Query extends FecQueryModel,
> = Pick<FecQueryTableProps<Row, Query>, 'query' | 'columns' | 'data' | 'loading' | 'pagination'> & {
  'onUpdate:query': (model: Query) => void
  'onUpdate:currentPage': (page: number) => Promise<void>
  'onUpdate:pageSize': (size: number) => Promise<void>
  'onSubmit': () => Promise<void>
  'onReset': () => Promise<void>
}

export function useFecQueryTableBindings<Row extends object, Query extends FecQueryModel>(
  state: QueryTableState<Row, Query>,
): ComputedRef<FecQueryTableBindings<Row, Query>> {
  return computed(() => ({
    'query': state.query.model.value,
    'columns': state.table.columns.value,
    'data': state.table.data,
    'loading': state.loading,
    'pagination': state.pagination,
    'onUpdate:query': state.query.setModel,
    'onUpdate:currentPage': state.setPage,
    'onUpdate:pageSize': state.setPageSize,
    'onSubmit': state.submit,
    'onReset': state.reset,
  }))
}
