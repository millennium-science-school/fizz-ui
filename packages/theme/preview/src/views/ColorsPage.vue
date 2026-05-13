<script setup lang="ts">
import { darkTokens, lightTokens } from '@fizz/theme'

const allTokens = [
  { name: 'lightTokens', tokens: lightTokens },
  { name: 'darkTokens', tokens: darkTokens },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-[var(--fe-color-text-primary)]">
      颜色令牌
    </h1>

    <div v-for="group in allTokens" :key="group.name" class="mb-8">
      <h2 class="text-lg font-semibold mb-3 text-[var(--fe-color-text-primary)]">
        {{ group.name }}
      </h2>
      <div class="grid grid-cols-4 gap-3">
        <div
          v-for="(value, key) in group.tokens.colors"
          :key="key"
          class="rounded-[var(--fe-border-radius)] overflow-hidden border border-[var(--fe-color-border)]"
        >
          <div class="h-12" :style="{ background: value }" />
          <div class="p-2 bg-[var(--fe-color-bg-base)]">
            <p class="text-xs font-mono text-[var(--fe-color-text-primary)]">
              {{ key }}
            </p>
            <p class="text-xs font-mono text-[var(--fe-color-text-secondary)]">
              {{ value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
