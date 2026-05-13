// uno.config.ts — 供 preview 开发预览使用
// 同时也是消费侧接入 @fizz/theme 的参考配置示例
import { defineConfig, presetWind3 } from 'unocss'
import { fizzPreset } from './src/preset'

export default defineConfig({
  presets: [
    presetWind3(),
    fizzPreset(),
  ],
})
