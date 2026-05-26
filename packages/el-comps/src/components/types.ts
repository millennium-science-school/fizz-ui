import type {
  FormSchemaItem,
  QueryFormRules,
  QuerySchemaItem,
  TableColumn,
} from '@fizz/el-kit'
import type { Component, MaybeRefOrGetter } from 'vue'
import type { FecActionItem, FecRowAction } from './actionTypes'

export type FecFormModel = Record<string, unknown>
export type FecQueryModel = object

export interface FecRenderFieldConfig {
  fieldProps?: Record<string, unknown>
}

export type FecBuiltinFormSchemaItem<T extends object>
  = FormSchemaItem<T> & FecRenderFieldConfig

export type FecBuiltinQuerySchemaItem<T extends object>
  = QuerySchemaItem<T> & FecRenderFieldConfig

export interface FecCustomFormSchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: Extract<keyof T, string>
  label: string
  component: Component
}

export interface FecCustomQuerySchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: Extract<keyof T, string>
  label: string
  component: Component
}

export type FecFormSchemaItem<T extends object>
  = | FecBuiltinFormSchemaItem<T>
    | FecCustomFormSchemaItem<T>

export type FecQuerySchemaItem<T extends object>
  = | FecBuiltinQuerySchemaItem<T>
    | FecCustomQuerySchemaItem<T>

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

export interface FecFormProps<T extends object> {
  model: T
  schema: FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}

export interface FecQueryFormProps<T extends object> {
  model: T
  schema: FecQuerySchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
  submitText?: string
  resetText?: string
}

export interface FecTableProps<Row extends object> {
  columns: FecTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination?: FecPagination
  rowActions?: FecRowAction<Row>[]
  toolbarActions?: FecActionItem[]
  selectable?: boolean
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

// Re-export action types for consumers
export type { FecActionItem, FecRowAction }
