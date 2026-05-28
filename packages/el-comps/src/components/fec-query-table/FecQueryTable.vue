<script lang="ts">
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { FecPagination } from '../fec-table/props'
import type { FecActionItem, FecRowAction } from '../shared/actionTypes'
import type { FecQueryModel, FecQuerySchemaItem, FecQueryTableColumn } from '../shared/types'
import { defineComponent, h } from 'vue'
import FecQueryForm from '../fec-query-form/FecQueryForm.vue'
import FecTable from '../fec-table/FecTable.vue'

export default defineComponent({
  name: 'FecQueryTable',
  props: {
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
  },
  emits: [
    'update:query',
    'submit',
    'reset',
    'update:currentPage',
    'update:pageSize',
    'toolbarAction',
    'rowAction',
    'selectionChange',
  ],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'fe-comps-query-table' }, [
        h(FecQueryForm, {
          'model': props.query as Record<string, unknown>,
          'schema': props.querySchema,
          'rules': props.queryRules,
          'submitText': props.submitText,
          'resetText': props.resetText,
          'onUpdate:model': (updated: FecQueryModel) => emit('update:query', updated),
          'onSubmit': (model: FecQueryModel) => emit('submit', model),
          'onReset': () => emit('reset'),
        }),
        h(FecTable, {
          'columns': props.columns,
          'data': props.data,
          'loading': props.loading,
          'pagination': props.pagination,
          'toolbarActions': props.toolbarActions,
          'rowActions': props.rowActions,
          'selectable': props.selectable,
          'onUpdate:currentPage': (page: number) => emit('update:currentPage', page),
          'onUpdate:pageSize': (size: number) => emit('update:pageSize', size),
          'onToolbarAction': (key: string, action: FecActionItem) => emit('toolbarAction', key, action),
          'onRowAction': (key: string, row: object, index: number, action: FecRowAction<object>) => emit('rowAction', key, row, index, action),
          'onSelectionChange': (selection: object[]) => emit('selectionChange', selection),
        }),
      ])
  },
})
</script>
