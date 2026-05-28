import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecTableProps } from './props'
import FecTableImpl from './FecTable.vue'

export const FecTable = FecTableImpl as unknown as new <Row extends object = any>() => {
  $props: FecTableProps<Row> & VNodeProps & AllowedComponentProps & {
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onToolbarAction'?: (...args: any[]) => void
    'onRowAction'?: (...args: any[]) => void
    'onSelectionChange'?: (...args: any[]) => void
  }
}

export type { FecPagination, FecTableProps } from './props'
export default FecTableImpl
