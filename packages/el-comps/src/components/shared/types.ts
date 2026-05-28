import type {
  FormSchemaItem,
  QuerySchemaItem,
  TableColumn,
} from '@fizz/el-kit'
import type { Component } from 'vue'

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
