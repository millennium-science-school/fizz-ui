// @fizz/theme 库入口
//
// 只导出主题相关内容。@fizz/theme 运行时不依赖任何 fizz 组件包；
// preview/playground 可以安装组件包做主题效果验证。
//
// 组件包由业务项目按需单独安装：
//   pnpm add @fizz/el-plus @fizz/el-kit @fizz/el-comps @fizz/theme
//
// 消费侧典型用法：
//   uno.config.ts   → import { fizzPreset } from '@fizz/theme/preset/unocss'
//   vite/main.ts    → import '@fizz/el-plus/styles'
//                     import '@fizz/theme/styles'
//   ECharts 配色等  → import { lightTokens } from '@fizz/theme'

// ── 设计令牌（JS 对象，方便在 JS 中读取颜色值）────────────────────────────
export { createThemeCssVars, createThemeVarsCss, darkTokens, lightTokens } from './tokens'
export type { ElementThemeVars, FizzThemeVars, ThemeCssVars, ThemeTokens, ThemeVarsCssOptions } from './tokens'
