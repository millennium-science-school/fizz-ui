import type { QueryFormRules } from '@fizz/el-kit'
import type { MaybeRefOrGetter } from 'vue'
import type { FecPagination } from '../fec-table/props'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type {
  FecQueryModel,
  FecQuerySchemaItem,
  FecQueryTableColumn,
} from '../shared/types'

export interface FecQueryPagination {
  currentPage: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
}

export interface FecQueryTableProps<Row extends object, Query extends FecQueryModel> {
  query: Query
  querySchema: readonly FecQuerySchemaItem<Query>[]
  queryRules?: QueryFormRules<Query>
  columns: readonly FecQueryTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  toolbarActions?: FecActionItem[]
  rowActions?: FecRowAction<Row>[]
  selectable?: boolean
  submitText?: string
  resetText?: string
}
