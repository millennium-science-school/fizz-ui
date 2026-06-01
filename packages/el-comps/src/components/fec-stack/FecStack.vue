<script setup lang="ts">
import type { CSSProperties, PropType } from 'vue'
import type { FecStackDirection, FecStackGap } from './props'
import { computed } from 'vue'

defineOptions({
  name: 'FecStack',
})

const stackProps = defineProps({
  direction: {
    type: String as PropType<FecStackDirection>,
    default: 'vertical',
  },
  gap: {
    type: String as PropType<FecStackGap>,
    default: 'md',
  },
})

const GAP_MAP: Record<FecStackGap, string> = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
}

const classes = computed(() => [
  'fe-comps-stack',
  `fe-comps-stack--${stackProps.direction}`,
  `fe-comps-stack--gap-${stackProps.gap}`,
])

const style = computed((): CSSProperties => ({
  display: 'flex',
  flexDirection: stackProps.direction === 'horizontal' ? 'row' : 'column',
  flexWrap: stackProps.direction === 'horizontal' ? 'wrap' : 'nowrap',
  gap: GAP_MAP[stackProps.gap] ?? GAP_MAP.md,
}))
</script>

<template>
  <div
    :class="classes"
    :style="style"
  >
    <slot />
  </div>
</template>
