<script lang="ts">
import type { PropType } from 'vue'
import type { FecActionItem } from './actionTypes'
import { FeButton } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecToolbar',
  props: {
    actions: {
      type: Array as PropType<FecActionItem[]>,
      default: () => [],
    },
  },
  emits: ['action'],
  setup(props, { emit, slots }) {
    return () =>
      h('div', { class: 'fe-comps-toolbar' }, [
        h('div', { class: 'fe-comps-toolbar-left' }, slots.default?.()),
        h('div', { class: 'fe-comps-toolbar-right' }, [
          slots.extra?.(),
          ...props.actions
            .filter(action => !action.hidden)
            .map(action =>
              h(
                FeButton,
                {
                  key: action.key,
                  type: action.type,
                  disabled: action.disabled,
                  onClick: () => emit('action', action.key, action),
                },
                () => action.label,
              ),
            ),
        ]),
      ])
  },
})
</script>
