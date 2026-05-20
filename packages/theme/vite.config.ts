import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// 注意：库 src/ 中无 .vue 文件，不需要引入 @vitejs/plugin-vue
// preview/ 目录有自己的 vite.config.ts 包含 vue 插件
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // CSS 变量文件通过 scripts/copy-styles.mjs 单独复制到 dist/styles/
    cssCodeSplit: false,
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'preset/unocss': resolve(__dirname, 'src/preset/unocss.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      // theme 根入口不依赖 UnoCSS；preset 子入口将 unocss 保持为外部 peer。
      // 组件包只允许出现在 preview/playground 中做效果验证。
      external: ['unocss'],
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*'],
      outDir: 'dist',
      copyDtsFiles: true,
    }),
  ],
})
