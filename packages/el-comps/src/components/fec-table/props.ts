import type { MaybeRefOrGetter } from 'vue'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecTableColumn } from '../shared/types'

export interface FecPagination {
  currentPage: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
}

export interface FecTableProps<Row extends object> {
  columns: readonly FecTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  rowActions?: FecRowAction<Row>[]
  toolbarActions?: FecActionItem[]
  selectable?: boolean
}
