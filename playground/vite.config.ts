import { resolve } from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_PAGES === 'true' && githubRepositoryName
  ? `/${githubRepositoryName}/`
  : './'

export default defineConfig({
  base,
  resolve: {
    alias: {
      // 开发时直接指向源码，无需先构建上游包
      '@fizz/theme/styles': resolve(__dirname, '../packages/theme/src/styles/vars.css'),
      '@fizz/theme': resolve(__dirname, '../packages/theme/src'),
      '@fizz/el-plus/styles/scss': resolve(__dirname, '../packages/el-plus/src/styles/index.scss'),
      '@fizz/el-plus/styles': resolve(__dirname, '../packages/el-plus/src/styles/index.scss'),
      '@fizz/el-plus': resolve(__dirname, '../packages/el-plus/src'),
      '@fizz/el-kit': resolve(__dirname, '../packages/el-kit/src'),
      '@fizz/el-comps': resolve(__dirname, '../packages/el-comps/src'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      configFile: resolve(__dirname, '../packages/theme/uno.config.ts'),
    }),
    vueDevTools(),
  ],
})
