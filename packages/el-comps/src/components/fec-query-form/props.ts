import type { QueryFormRules } from '@fizz/el-kit'
import type { FecQuerySchemaItem } from '../shared/types'

export interface FecQueryFormProps<T extends object> {
  model: T
  schema: readonly FecQuerySchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
  submitText?: string
  resetText?: string
}
