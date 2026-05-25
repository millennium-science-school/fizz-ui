export type FieldControlKind =
  | 'input'
  | 'number'
  | 'select'
  | 'date'
  | 'switch'
  | 'textarea'

export interface FieldOption<Value = unknown> {
  label: string
  value: Value
  disabled?: boolean
}

export interface FormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: FieldOption[]
}

export interface QuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  kind: FieldControlKind
  options?: FieldOption[]
}
