<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'

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

    return () => h('div', { class: classes.value }, slots.default?.())
  },
})
</script>
