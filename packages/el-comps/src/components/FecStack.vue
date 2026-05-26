<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'

const GAP_MAP: Record<string, string> = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
}

export default defineComponent({
  name: 'FecStack',
  props: {
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical' as const,
    },
    gap: {
      type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
      default: 'md' as const,
    },
  },
  setup(props, { slots }) {
    const classes = computed(() => [
      'fe-comps-stack',
      `fe-comps-stack--${props.direction}`,
      `fe-comps-stack--gap-${props.gap}`,
    ])

    const style = computed(() => ({
      display: 'flex',
      flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
      flexWrap: props.direction === 'horizontal' ? 'wrap' : 'nowrap',
      gap: GAP_MAP[props.gap] ?? '16px',
    }))

    return () => h('div', { class: classes.value, style: style.value }, slots.default?.())
  },
})
</script>
