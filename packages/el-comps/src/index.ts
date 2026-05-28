// @fizz/el-comps 入口
// 基于 @fizz/el-kit 的无主题样式结构化组合组件层。
// 提供 form + table + pagination 等高阶组合，供业务页面直接使用。

export { defineFecDetailSchema, FecDetail } from './components/fec-detail'
export type {
  FecDetailProps,
  FecDetailSchemaItem,
} from './components/fec-detail'
export { FecDialogForm } from './components/fec-dialog-form'
export type { FecDialogFormProps } from './components/fec-dialog-form'
export { FecDrawerForm } from './components/fec-drawer-form'
export type { FecDrawerFormProps } from './components/fec-drawer-form'
export { FecForm } from './components/fec-form'
export type { FecFormProps } from './components/fec-form'
export { FecPage } from './components/fec-page'
export { FecQueryForm } from './components/fec-query-form'
export type { FecQueryFormProps } from './components/fec-query-form'
export { FecQueryTable } from './components/fec-query-table'
export type {
  FecQueryPagination,
  FecQueryTableProps,
} from './components/fec-query-table'
export { FecSection } from './components/fec-section'
export { FecStack } from './components/fec-stack'
export { FecTable } from './components/fec-table'
export type {
  FecPagination,
  FecTableProps,
} from './components/fec-table'
export { FecToolbar } from './components/fec-toolbar'

export type { FecActionItem, FecActionType, FecRowAction } from './components/shared/actionTypes'
export {
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
} from './components/shared/types'
export type {
  FecBuiltinFormSchemaItem,
  FecBuiltinQuerySchemaItem,
  FecCustomFormSchemaItem,
  FecCustomQuerySchemaItem,
  FecFormSchemaItem,
  FecQuerySchemaItem,
  FecRenderFieldConfig,
} from './components/shared/types'
