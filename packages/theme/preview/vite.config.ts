import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  root: __dirname,
  base: './',
  resolve: {
    alias: {
      // CSS 子路径需要单独映射，否则 /styles 后缀不会自动续接文件名
      '@fizz/theme/styles': resolve(__dirname, '../src/styles/vars.css'),
      // preview 直接指向 src/ 源码，无需先 build 库
      '@fizz/theme': resolve(__dirname, '../src'),
      '@fizz/el-plus': resolve(__dirname, '../../el-plus/src'),
      '@fizz/el-kit': resolve(__dirname, '../../el-kit/src'),
      '@fizz/el-comps': resolve(__dirname, '../../el-comps/src'),
    },
  },
  plugins: [
    vue(),
    UnoCSS({
      configFile: resolve(__dirname, '../uno.config.ts'),
    }),
    vueDevTools(),
  ],
})
