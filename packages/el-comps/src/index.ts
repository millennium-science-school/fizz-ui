// @fizz/el-comps 入口
// 基于 @fizz/el-kit 的无主题样式结构化组合组件层。
// 提供 form + table + pagination 等高阶组合，供业务页面直接使用
//
// 注意：此包不是严格 headless。它会控制组件嵌套层级和 DOM 结构；
// 颜色、字体、间距等主题样式由 @fizz/theme 或业务侧通过 CSS 变量提供。
//
// 导出规范：
//   - composables 子目录：useFecTable 等
//   - components 子目录：FecTable 等渲染组件（由 composable 返回）
//   - types 子目录：UseFecTableOptions<T> 等公共类型
//
// 组件 CSS 类名约定（结构类，无颜色/字体）：
//   fe-comps-table、fe-comps-form、fe-comps-pagination
//   结构变量通过 CSS 变量暴露，由 @fizz/theme 赋值：
//     --fe-form-cols、--fe-form-gap、--fe-table-stripe 等
//
// 示例（就绪后取消注释）：
// export { useFecTable } from './composables/useFecTable'
// export type { UseFecTableOptions, FecTableColumn } from './types'

import { FecDetail } from './components/fec-detail'
import { FecDialogForm } from './components/fec-dialog-form'
import { FecDrawerForm } from './components/fec-drawer-form'
import { FecForm } from './components/fec-form'
import { FecPage } from './components/fec-page'
import { FecQueryForm } from './components/fec-query-form'
import { FecQueryTable } from './components/fec-query-table'
import { FecSection } from './components/fec-section'
import { FecStack } from './components/fec-stack'
import { FecTable } from './components/fec-table'
import { FecToolbar } from './components/fec-toolbar'

export type { FecActionItem, FecActionType, FecRowAction } from './components/shared/actionTypes'
export { defineFecDetailSchema } from './components/fec-detail'
export {
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
} from './components/shared/types'

export { FecDetail }
export type {
  FecDetailProps,
  FecDetailSchemaItem,
} from './components/fec-detail'
export { FecDialogForm }
export type { FecDialogFormProps } from './components/fec-dialog-form'
export { FecDrawerForm }
export type { FecDrawerFormProps } from './components/fec-drawer-form'
export { FecForm, FecQueryForm }
export type { FecFormProps } from './components/fec-form'
export type { FecQueryFormProps } from './components/fec-query-form'
export { FecQueryTable, FecTable }
export type { FecPagination, FecTableProps } from './components/fec-table'
export type {
  FecQueryPagination,
  FecQueryTableProps,
} from './components/fec-query-table'

export { FecPage, FecSection, FecStack, FecToolbar }
export type {
  FecBuiltinFormSchemaItem,
  FecBuiltinQuerySchemaItem,
  FecCustomFormSchemaItem,
  FecCustomQuerySchemaItem,
  FecFormSchemaItem,
  FecQuerySchemaItem,
  FecRenderFieldConfig,
} from './components/shared/types'
