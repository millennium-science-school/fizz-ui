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
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  component: Component
}

export interface FecCustomQuerySchemaItem<T extends object> extends FecRenderFieldConfig {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
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

export function defineFecFormSchema<T extends object>(
  schema: readonly FecFormSchemaItem<T>[],
): readonly FecFormSchemaItem<T>[] {
  return schema
}

export function defineFecQuerySchema<T extends object>(
  schema: readonly FecQuerySchemaItem<T>[],
): readonly FecQuerySchemaItem<T>[] {
  return schema
}

export function defineFecTableColumns<T extends object>(
  columns: readonly FecTableColumn<T>[],
): readonly FecTableColumn<T>[] {
  return columns
}

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
  schema: readonly FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}

export interface FecQueryFormProps<T extends object> {
  model: T
  schema: readonly FecQuerySchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
  submitText?: string
  resetText?: string
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

// Re-export action types for consumers
export type { FecActionItem, FecRowAction }

export type FecDetailSchemaItem<T extends object> = [keyof T] extends [never]
  ? {
      prop: string
      label: string
      formatter?: (value: unknown, record: T) => unknown
    }
  : {
      [K in Extract<keyof T, string>]: {
        prop: K
        label: string
        formatter?: (value: T[K], record: T) => unknown
      }
    }[Extract<keyof T, string>]

export interface FecLooseDetailSchemaItem {
  prop: string
  label: string
  formatter?: (value: unknown, record: Record<string, unknown>) => unknown
}

export function defineFecDetailSchema<T extends object>(
  schema: readonly FecDetailSchemaItem<T>[],
): readonly FecDetailSchemaItem<T>[] {
  return schema
}

export interface FecDetailProps<T extends object> {
  record: T
  schema: readonly FecDetailSchemaItem<T>[]
  columns?: 1 | 2 | 3 | 4
  emptyText?: string
}

export interface FecDialogFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}

export interface FecDrawerFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}
