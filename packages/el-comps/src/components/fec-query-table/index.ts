import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecQueryModel } from '../shared/types'
import type { FecQueryTableProps } from './props'
import FecQueryTableImpl from './FecQueryTable.vue'

export const FecQueryTable = FecQueryTableImpl as unknown as new <
  Row extends object = any,
  Query extends FecQueryModel = any,
>() => {
  $props: FecQueryTableProps<Row, Query> & VNodeProps & AllowedComponentProps & {
    'onUpdate:query'?: (...args: any[]) => void
    'onSubmit'?: (...args: any[]) => void
    'onReset'?: (...args: any[]) => void
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onToolbarAction'?: (...args: any[]) => void
    'onRowAction'?: (...args: any[]) => void
    'onSelectionChange'?: (...args: any[]) => void
  }
}

export type { FecQueryPagination, FecQueryTableProps } from './props'
export type { FecQueryTableBindings } from './useQueryTableBindings'
export { useFecQueryTableBindings } from './useQueryTableBindings'
export default FecQueryTableImpl
