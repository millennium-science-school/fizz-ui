<script lang="ts">
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { FecActionItem, FecRowAction } from './shared/actionTypes'
import type { FecPagination, FecTableColumn } from './shared/types'
import {
  FeButton,
  FePagination,
  FeTable,
  FeTableColumn,
  vFeLoading,
} from '@fizz/el-plus'
import { defineComponent, h, toValue, withDirectives } from 'vue'
import FecToolbar from './fec-toolbar/FecToolbar.vue'
import { renderTableColumns } from './tableColumns'

export default defineComponent({
  name: 'FecTable',
  props: {
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
  },
  emits: ['toolbarAction', 'rowAction', 'selectionChange', 'update:currentPage', 'update:pageSize'],
  setup(props, { emit }) {
    function renderRowActionColumn() {
      const visibleActions = props.rowActions.filter(a => !a.hidden)
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

    return () => {
      const data = toValue(props.data)
      const loading = toValue(props.loading)

      const tableNode = withDirectives(
        h(
          FeTable,
          {
            class: 'fe-comps-table',
            data,
            onSelectionChange: (selection: object[]) => emit('selectionChange', selection),
          },
          () => [
            props.selectable ? h(FeTableColumn, { type: 'selection', width: 55 }) : null,
            ...renderTableColumns(props.columns),
            renderRowActionColumn(),
          ],
        ),
        [[vFeLoading, loading]],
      )

      return h('div', { class: 'fe-comps-table-wrap' }, [
        props.toolbarActions.length
          ? h(FecToolbar, {
              actions: props.toolbarActions,
              onAction: (key: string, action: FecActionItem) => emit('toolbarAction', key, action),
            })
          : null,
        tableNode,
        props.pagination
          ? h(FePagination, {
              'class': 'fe-comps-pagination',
              'currentPage': toValue(props.pagination.currentPage),
              'total': toValue(props.pagination.total),
              'pageSize': toValue(props.pagination.pageSize),
              'onUpdate:currentPage': (page: number) => emit('update:currentPage', page),
              'onUpdate:pageSize': (size: number) => emit('update:pageSize', size),
            })
          : null,
      ])
    }
  },
})
</script>
