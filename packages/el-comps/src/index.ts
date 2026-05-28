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

import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDetailProps, FecDialogFormProps, FecDrawerFormProps, FecFormProps, FecQueryFormProps, FecQueryModel, FecQueryTableProps, FecTableProps } from './components/shared/types'
import FecDetailImpl from './components/FecDetail.vue'
import FecDialogFormImpl from './components/FecDialogForm.vue'
import FecDrawerFormImpl from './components/FecDrawerForm.vue'
import FecFormImpl from './components/FecForm.vue'
import { FecPage } from './components/fec-page'
import { FecSection } from './components/fec-section'
import { FecStack } from './components/fec-stack'
import { FecToolbar } from './components/fec-toolbar'
import FecQueryFormImpl from './components/FecQueryForm.vue'
import FecQueryTableImpl from './components/FecQueryTable.vue'

import FecTableImpl from './components/FecTable.vue'

export type { FecActionItem, FecActionType, FecRowAction } from './components/shared/actionTypes'
export {
  defineFecDetailSchema,
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
} from './components/shared/types'

export const FecForm = FecFormImpl as unknown as new <T extends object = any>() => {
  $props: FecFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
  }
}
export const FecQueryForm = FecQueryFormImpl as unknown as new <T extends object = any>() => {
  $props: FecQueryFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
    'onSubmit'?: (...args: any[]) => void
    'onReset'?: (...args: any[]) => void
  }
}

// Typed facades: SFC vite-plugin-dts erases the generic T to `object`.
// Using the constructor-generic pattern (`new <T>() => { $props: P }`) lets
// consumers pass explicit type arguments (`<FecTable<User> ...>` in JSX) and
// preserves row/query-key validation at the component level.
// The generic defaults stay wide because Vue templates cannot provide explicit
// generic arguments; strict schema/column checking is provided by defineFec* helpers.
export const FecTable = FecTableImpl as unknown as new <Row extends object = any>() => {
  $props: FecTableProps<Row> & VNodeProps & AllowedComponentProps & {
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onToolbarAction'?: (...args: any[]) => void
    'onRowAction'?: (...args: any[]) => void
    'onSelectionChange'?: (...args: any[]) => void
  }
}
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

export { FecPage, FecSection, FecStack, FecToolbar }
export type {
  FecBuiltinFormSchemaItem,
  FecBuiltinQuerySchemaItem,
  FecCustomFormSchemaItem,
  FecCustomQuerySchemaItem,
  FecDetailProps,
  FecDetailSchemaItem,
  FecDialogFormProps,
  FecDrawerFormProps,
  FecFormProps,
  FecFormSchemaItem,
  FecPagination,
  FecQueryFormProps,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecRenderFieldConfig,
  FecTableProps,
} from './components/shared/types'

export const FecDetail = FecDetailImpl as unknown as new <T extends object = any>() => {
  $props: FecDetailProps<T> & VNodeProps & AllowedComponentProps
}
export const FecDialogForm = FecDialogFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDialogFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}
export const FecDrawerForm = FecDrawerFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDrawerFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}
