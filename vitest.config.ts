import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  resolve: {
    alias: {
      // 测试中跨包引用直接指向源码
      '@fizz/el-plus': resolve(__dirname, 'packages/el-plus/src'),
      '@fizz/el-kit': resolve(__dirname, 'packages/el-kit/src'),
      '@fizz/el-comps': resolve(__dirname, 'packages/el-comps/src'),
      '@fizz/theme': resolve(__dirname, 'packages/theme/src'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: [
      'packages/**/__tests__/**/*.{test,spec}.ts',
      'playground/**/__tests__/**/*.{test,spec}.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**'],
      exclude: ['**/index.ts'],
    },
  },
})
