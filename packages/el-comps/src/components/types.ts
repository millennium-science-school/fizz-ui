import type { QueryFormRules, TableColumn } from '@fizz/el-kit'
import type { MaybeRefOrGetter } from 'vue'
import type { FecControl } from './controls'

export type FecFormModel = Record<string, unknown>
export type FecQueryModel = Record<string, unknown>

export interface FecFormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}

export interface FecQuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}

export type FecTableColumn<T extends object> = TableColumn<T>
export type FecQueryTableColumn<T extends object> = TableColumn<T>

export interface FecPagination {
  currentPage: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
}

export interface FecQueryPagination {
  currentPage: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
}

export interface FecTableProps<T extends object> {
  form: FecFormModel
  formSchema: FecFormSchemaItem<T>[]
  columns: FecTableColumn<T>[]
  data: MaybeRefOrGetter<T[]>
  pagination: FecPagination
}

export interface FecQueryTableProps<Row extends object, Query extends FecQueryModel> {
  query: Query
  querySchema: FecQuerySchemaItem<Query>[]
  rules?: QueryFormRules<Query>
  columns: FecQueryTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination: FecQueryPagination
  submitText?: string
  resetText?: string
}
