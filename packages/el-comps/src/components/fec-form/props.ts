import type { QueryFormRules } from '@fizz/el-kit'
import type { FecFormSchemaItem } from '../shared/types'

export interface FecFormProps<T extends object> {
  model: T
  schema: readonly FecFormSchemaItem<T>[]
  rules?: QueryFormRules<T>
  labelWidth?: string | number
  columns?: 1 | 2 | 3 | 4
}
