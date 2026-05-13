import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
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
      // 全部上游包由消费侧提供
      external: ['vue', 'element-plus', '@fizz/el-plus', '@fizz/el-kit'],
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath: './tsconfig.dts.json',
      include: ['src/**/*'],
      entryRoot: 'src',
      outDir: 'dist',
      pathsToAliases: false,
      copyDtsFiles: true,
    }),
  ],
})
