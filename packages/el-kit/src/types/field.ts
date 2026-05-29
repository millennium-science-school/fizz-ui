export type FieldControlKind
  = | 'input'
    | 'number'
    | 'select'
    | 'multiSelect'
    | 'date'
    | 'dateRange'
    | 'switch'
    | 'textarea'

export interface FieldOption<Value = unknown> {
  label: string
  value: Value
  disabled?: boolean
}

export interface FormSchemaItem<T extends object> {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: readonly FieldOption[]
}

export interface QuerySchemaItem<T extends object> {
  prop: [keyof T] extends [never] ? string : Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: readonly FieldOption[]
}

export function defineFormSchema<T extends object>(
  schema: readonly FormSchemaItem<T>[],
): readonly FormSchemaItem<T>[] {
  return schema
}

export function defineQuerySchema<T extends object>(
  schema: readonly QuerySchemaItem<T>[],
): readonly QuerySchemaItem<T>[] {
  return schema
}
