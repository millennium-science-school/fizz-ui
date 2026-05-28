import type { TableColumn } from '@fizz/el-kit'
import type { VNodeChild } from 'vue'
import { FeTableColumn } from '@fizz/el-plus'
import { h } from 'vue'

export function renderTableColumns<T extends object>(columns: readonly TableColumn<T>[]): VNodeChild[] {
  return columns.map(column =>
    h(FeTableColumn, {
      key: column.prop,
      align: column.align,
      label: column.label,
      minWidth: column.minWidth,
      prop: column.prop,
      width: column.width,
    }),
  )
}
