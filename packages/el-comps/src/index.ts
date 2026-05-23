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

export type {
  FecBuiltinControlName,
  FecControl,
  FecCustomControl,
  FecLegacyControlName,
} from './components/controls'
import type { DefineComponent } from 'vue'
import type { FecQueryTableProps, FecTableProps } from './components/types'
import FecQueryTableImpl from './components/FecQueryTable.vue'
import FecTableImpl from './components/FecTable.vue'

// Typed facades: SFC vite-plugin-dts erases the generic T to `object`.
// Casting to DefineComponent<Props<any>> restores a usable public surface
// while keeping the runtime component intact.
export const FecTable = FecTableImpl as unknown as DefineComponent<
  FecTableProps<any> & { 'onUpdate:form'?: (...args: any[]) => void }
>
export const FecQueryTable = FecQueryTableImpl as unknown as DefineComponent<
  FecQueryTableProps<any, any> & {
    onReset?: (...args: any[]) => void
    onSubmit?: (...args: any[]) => void
    'onUpdate:currentPage'?: (...args: any[]) => void
    'onUpdate:pageSize'?: (...args: any[]) => void
    'onUpdate:query'?: (...args: any[]) => void
  }
>
export type {
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecTableProps,
} from './components/types'
