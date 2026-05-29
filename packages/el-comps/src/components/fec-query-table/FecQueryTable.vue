<script setup lang="ts">
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { FecPagination } from '../fec-table/props'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecQueryModel, FecQuerySchemaItem, FecQueryTableColumn } from '../shared/types'
import FecQueryForm from '../fec-query-form/FecQueryForm.vue'
import FecTable from '../fec-table/FecTable.vue'

defineOptions({
  name: 'FecQueryTable',
})

defineProps({
  query: {
    type: Object as PropType<FecQueryModel>,
    required: true,
  },
  querySchema: {
    type: Array as PropType<readonly FecQuerySchemaItem<Record<string, unknown>>[]>,
    required: true,
  },
  queryRules: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array as PropType<readonly FecQueryTableColumn<object>[]>,
    required: true,
  },
  data: {
    type: [Array, Object, Function] as PropType<MaybeRefOrGetter<object[]>>,
    required: true,
  },
  loading: {
    type: [Boolean, Object, Function] as PropType<MaybeRefOrGetter<boolean>>,
    default: false,
  },
  pagination: {
    type: Object as PropType<FecPagination>,
    default: undefined,
  },
  toolbarActions: {
    type: Array as PropType<FecActionItem[]>,
    default: () => [],
  },
  rowActions: {
    type: Array as PropType<FecRowAction<object>[]>,
    default: () => [],
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  submitText: {
    type: String,
    default: '查询',
  },
  resetText: {
    type: String,
    default: '重置',
  },
})

const emit = defineEmits([
  'update:query',
  'submit',
  'reset',
  'update:currentPage',
  'update:pageSize',
  'toolbarAction',
  'rowAction',
  'selectionChange',
])

function emitRowAction(
  key: string,
  row: object,
  index: number,
  action: FecRowAction<object>,
) {
  emit('rowAction', key, row, index, action)
}

function emitToolbarAction(key: string, action: FecActionItem) {
  emit('toolbarAction', key, action)
}
</script>

<template>
  <div class="fe-comps-query-table">
    <FecQueryForm
      :model="query as Record<string, unknown>"
      :schema="querySchema"
      :rules="queryRules"
      :submit-text="submitText"
      :reset-text="resetText"
      @update:model="emit('update:query', $event)"
      @submit="emit('submit', $event)"
      @reset="emit('reset')"
    />
    <FecTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :toolbar-actions="toolbarActions"
      :row-actions="rowActions"
      :selectable="selectable"
      @update:current-page="emit('update:currentPage', $event)"
      @update:page-size="emit('update:pageSize', $event)"
      @toolbar-action="emitToolbarAction"
      @row-action="emitRowAction"
      @selection-change="emit('selectionChange', $event)"
    />
  </div>
</template>
