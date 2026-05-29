<script setup lang="ts">
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecTableColumn } from '../shared/types'
import type { FecPagination } from './props'
import {
  FeButton,
  FePagination,
  FeTable,
  FeTableColumn,
  vFeLoading,
} from '@fizz/el-plus'
import { h, toValue, withDirectives } from 'vue'
import FecToolbar from '../fec-toolbar/FecToolbar.vue'
import { renderTableColumns } from './tableColumns'

defineOptions({
  name: 'FecTable',
})

const tableProps = defineProps({
  columns: {
    type: Array as PropType<readonly FecTableColumn<object>[]>,
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
  rowActions: {
    type: Array as PropType<FecRowAction<object>[]>,
    default: () => [],
  },
  toolbarActions: {
    type: Array as PropType<FecActionItem[]>,
    default: () => [],
  },
  selectable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'toolbarAction',
  'rowAction',
  'selectionChange',
  'update:currentPage',
  'update:pageSize',
])

function renderRowActionColumn() {
  const visibleActions = tableProps.rowActions.filter(a => !a.hidden)
  if (!visibleActions.length)
    return null

  return h(FeTableColumn, { label: '操作', fixed: 'right' }, {
    default: ({ row, $index }: { row: object, $index: number }) =>
      visibleActions.map(action =>
        h(FeButton, {
          key: action.key,
          size: 'small',
          type: action.type,
          disabled: action.disabled,
          onClick: () => {
            if (action.onClick)
              action.onClick(row as never, $index)
            emit('rowAction', action.key, row, $index, action)
          },
        }, () => action.label),
      ),
  })
}

function renderTableNode() {
  return withDirectives(
    h(
      FeTable,
      {
        class: 'fe-comps-table',
        data: toValue(tableProps.data),
        onSelectionChange: (selection: object[]) => emit('selectionChange', selection),
      },
      () => [
        tableProps.selectable ? h(FeTableColumn, { type: 'selection', width: 55 }) : null,
        ...renderTableColumns(tableProps.columns),
        renderRowActionColumn(),
      ],
    ),
    [[vFeLoading, toValue(tableProps.loading)]],
  )
}

const TableNode = () => renderTableNode()

function emitToolbarAction(key: string, action: FecActionItem) {
  emit('toolbarAction', key, action)
}
</script>

<template>
  <div class="fe-comps-table-wrap">
    <FecToolbar
      v-if="toolbarActions.length"
      :actions="toolbarActions"
      @action="emitToolbarAction"
    />
    <TableNode />
    <FePagination
      v-if="pagination"
      class="fe-comps-pagination"
      :current-page="toValue(pagination.currentPage)"
      :total="toValue(pagination.total)"
      :page-size="toValue(pagination.pageSize)"
      @update:current-page="emit('update:currentPage', $event)"
      @update:page-size="emit('update:pageSize', $event)"
    />
  </div>
</template>
