// @fizz/el-kit 入口
// 基于 @fizz/el-plus 的 headless composable 层，提供逻辑封装和泛型类型系统。
// 此包不负责渲染固定 DOM 结构；需要结构化组合时使用 @fizz/el-comps。
//
// 导出规范：
//   - composables 子目录：useTable、useFormLinkage 等
//   - types 子目录：TableColumn<T>、FormSchemaItem<T> 等公共类型
//
// 示例（就绪后取消注释）：
// export { useTable } from './composables/useTable'
// export { useFormLinkage } from './composables/useFormLinkage'
// export type { TableColumn, UseTableOptions } from './types/table'
// export type { FormLinkageRule } from './types/form'

export { usePaginationState } from './composables/usePaginationState'
export type {
  PaginationState,
  UsePaginationStateOptions,
} from './composables/usePaginationState'
export { useDetailState } from './composables/useDetailState'
export type { DetailState } from './composables/useDetailState'
export { useDialogFormState } from './composables/useDialogFormState'
export type {
  DialogFormMode,
  DialogFormState,
  UseDialogFormStateOptions,
} from './composables/useDialogFormState'
export { useQueryForm } from './composables/useQueryForm'
export type {
  QueryFormModel,
  QueryFormRule,
  QueryFormRules,
  QueryFormState,
  UseQueryFormOptions,
} from './composables/useQueryForm'
export { useQueryState } from './composables/useQueryState'
export type {
  QueryState,
  QueryStateModel,
  UseQueryStateOptions,
} from './composables/useQueryState'
export { defineTableColumns, useTable } from './composables/useTable'
export type {
  TableColumn,
  TablePaginationState,
  TableState,
  UseTableOptions,
  UseTablePaginationOptions,
} from './composables/useTable'
export {
  defineFormSchema,
  defineQuerySchema,
} from './types/field'
export type {
  FieldControlKind,
  FieldOption,
  FormSchemaItem,
  QuerySchemaItem,
} from './types/field'
