<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecLooseDetailSchemaItem } from './props'
import { FeDescriptions, FeDescriptionsItem } from '@fizz/el-plus'

defineOptions({
  name: 'FecDetail',
})

const detailProps = defineProps({
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
})

function displayValue(item: FecLooseDetailSchemaItem): string {
  const raw = detailProps.record[item.prop]
  const formatted = item.formatter
    ? item.formatter(raw, detailProps.record)
    : raw
  return formatted === null || formatted === undefined || formatted === ''
    ? detailProps.emptyText
    : String(formatted)
}
</script>

<template>
  <FeDescriptions
    class="fe-comps-detail"
    :column="columns"
    border
  >
    <FeDescriptionsItem
      v-for="item in schema"
      :key="item.prop"
      :label="item.label"
    >
      {{ displayValue(item) }}
    </FeDescriptionsItem>
  </FeDescriptions>
</template>
