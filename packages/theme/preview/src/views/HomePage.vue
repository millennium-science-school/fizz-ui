<script setup lang="ts">
import { lightTokens } from '@fizz/theme'
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-[var(--fe-color-text-primary)]">
      主题概览
    </h1>
    <p class="text-[var(--fe-color-text-regular)] mb-4">
      通过切换顶部「暗色」按钮，观察 CSS 变量在亮/暗主题下的切换效果。
    </p>

    <!-- 主色展示 -->
    <div class="grid grid-cols-3 gap-4">
      <div
        class="h-20 rounded-[var(--fe-border-radius-lg)] flex items-center justify-center text-white font-medium"
        style="background: var(--fe-color-primary)"
      >
        primary
      </div>
      <div
        class="h-20 rounded-[var(--fe-border-radius-lg)] flex items-center justify-center text-white font-medium"
        style="background: var(--fe-color-success)"
      >
        success
      </div>
      <div
        class="h-20 rounded-[var(--fe-border-radius-lg)] flex items-center justify-center text-white font-medium"
        style="background: var(--fe-color-danger)"
      >
        danger
      </div>
    </div>

    <!-- 令牌值展示 -->
    <pre class="mt-6 p-4 rounded-[var(--fe-border-radius)] bg-[var(--fe-color-bg-base)] border border-[var(--fe-color-border)] text-sm text-[var(--fe-color-text-regular)] overflow-auto">{{ JSON.stringify(lightTokens.colors, null, 2) }}</pre>
  </div>
</template>
