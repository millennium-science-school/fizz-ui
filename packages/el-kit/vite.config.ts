import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    rollupOptions: {
      // 上游包和 vue 由消费侧提供
      external: ['vue', 'element-plus', '@fizz/el-plus'],
    },
  },
  plugins: [
    vue(),
    dts({
      tsconfigPath: '../../tsconfig.web.json',
      include: ['src/**/*'],
      entryRoot: 'src',
      outDir: 'dist',
      copyDtsFiles: true,
    }),
  ],
})
