<script lang="ts">
import { computed, defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecStack',
  props: {
    direction: {
      type: String,
      default: 'vertical',
      validator: (value: string) => ['vertical', 'horizontal'].includes(value),
    },
    gap: {
      type: String,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
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
