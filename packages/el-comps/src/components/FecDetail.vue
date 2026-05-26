<script lang="ts">
import type { PropType } from 'vue'
import type { FecDetailSchemaItem } from './types'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecDetail',
  props: {
    record: {
      type: Object as PropType<Record<string, unknown>>,
      required: true,
    },
    schema: {
      type: Array as PropType<FecDetailSchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    columns: {
      type: Number as PropType<1 | 2 | 3 | 4>,
      default: 2,
    },
    emptyText: {
      type: String,
      default: '-',
    },
  },
  setup(props) {
    return () =>
      h('dl', { class: [`fe-comps-detail`, `fe-comps-detail--cols-${props.columns}`] }, props.schema.map((item) => {
        const raw = props.record[item.prop]
        const formatted = item.formatter
          ? item.formatter(raw as never, props.record as never)
          : raw
        const display = formatted === null || formatted === undefined || formatted === ''
          ? props.emptyText
          : String(formatted)

        return [
          h('dt', { class: 'fe-comps-detail-label', key: `${item.prop}-label` }, item.label),
          h('dd', { class: 'fe-comps-detail-value', key: `${item.prop}-value` }, display),
        ]
      }).flat())
  },
})
</script>
