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
