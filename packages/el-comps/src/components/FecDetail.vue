<script lang="ts">
import type { PropType } from 'vue'
import type { FecLooseDetailSchemaItem } from './types'
import { FeDescriptions, FeDescriptionsItem } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecDetail',
  props: {
    record: {
      type: Object as PropType<Record<string, unknown>>,
      required: true,
    },
    schema: {
      type: Array as PropType<readonly FecLooseDetailSchemaItem[]>,
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
      h(
        FeDescriptions,
        {
          class: 'fe-comps-detail',
          column: props.columns,
          border: true,
        },
        () =>
          props.schema.map((item) => {
            const raw = props.record[item.prop]
            const formatted = item.formatter
              ? item.formatter(raw, props.record)
              : raw
            const display = formatted === null || formatted === undefined || formatted === ''
              ? props.emptyText
              : String(formatted)

            return h(FeDescriptionsItem, { key: item.prop, label: item.label }, () => display)
          }),
      )
  },
})
</script>
