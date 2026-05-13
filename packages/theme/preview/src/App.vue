<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isDark = ref(false)
const [toggle] = useToggle(isDark)

function onToggleDark() {
  toggle()
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="min-h-screen bg-[var(--fe-color-bg-page)] transition-colors">
    <!-- 顶部导航 -->
    <header class="h-14 flex items-center gap-6 px-6 bg-[var(--fe-color-bg-base)] border-b border-[var(--fe-color-border)]">
      <span class="font-bold text-[var(--fe-color-primary)]">@fizz/theme Preview</span>
      <nav class="flex gap-4 flex-1">
        <RouterLink to="/" class="text-[var(--fe-color-text-regular)] hover:text-[var(--fe-color-primary)]">
          概览
        </RouterLink>
        <RouterLink to="/colors" class="text-[var(--fe-color-text-regular)] hover:text-[var(--fe-color-primary)]">
          颜色令牌
        </RouterLink>
        <RouterLink to="/components" class="text-[var(--fe-color-text-regular)] hover:text-[var(--fe-color-primary)]">
          组件预览
        </RouterLink>
      </nav>
      <button
        class="px-3 py-1 rounded-[var(--fe-border-radius)] border border-[var(--fe-color-border)] text-sm text-[var(--fe-color-text-regular)]"
        @click="onToggleDark"
      >
        {{ isDark ? '☀️ 亮色' : '🌙 暗色' }}
      </button>
    </header>

    <!-- 页面内容 -->
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>
