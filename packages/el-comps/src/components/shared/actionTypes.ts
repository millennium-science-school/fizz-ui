export type FecActionType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface FecActionItem<Context = unknown> {
  key: string
  label: string
  type?: FecActionType
  disabled?: boolean
  hidden?: boolean
  context?: Context
}

export interface FecRowAction<Row extends object> extends FecActionItem<Row> {
  onClick?: (row: Row, index: number) => void
}
