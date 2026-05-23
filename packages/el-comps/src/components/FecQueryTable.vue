<script lang="ts">
import type { QueryFormRules } from '@fizz/el-kit'
import type { MaybeRefOrGetter, PropType } from 'vue'
import type {
  FecQueryModel,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableColumn,
} from './types'
import {
  FeButton,
  FeForm,
  FeFormItem,
  FePagination,
  FeTable,
  vFeLoading,
} from '@fizz/el-plus'
import { defineComponent, h, toValue, withDirectives } from 'vue'
import { renderSchemaFields } from './schemaFields'
import { renderTableColumns } from './tableColumns'

export default defineComponent({
  name: 'FecQueryTable',
  props: {
    query: {
      type: Object as PropType<FecQueryModel>,
      required: true,
    },
    querySchema: {
      type: Array as PropType<FecQuerySchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    rules: {
      type: Object as PropType<QueryFormRules<FecQueryModel>>,
      default: () => ({}),
    },
    columns: {
      type: Array as PropType<FecQueryTableColumn<object>[]>,
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
      type: Object as PropType<FecQueryPagination>,
      required: true,
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
    'reset',
    'submit',
    'update:currentPage',
    'update:pageSize',
    'update:query',
  ],
  setup(props, { emit }) {
    function emitQueryField(prop: string, value: unknown) {
      emit('update:query', {
        ...props.query,
        [prop]: value,
      })
    }

    return () =>
      h('div', { class: 'fe-comps-query-table' }, [
        h(
          FeForm,
          {
            class: 'fe-comps-query-form',
            inline: true,
            model: props.query,
            rules: props.rules,
          },
          () => [
            ...renderSchemaFields({
              schema: props.querySchema,
              model: props.query,
              includeProp: true,
              onUpdateField: emitQueryField,
            }),
            h(
              FeFormItem,
              { class: 'fe-comps-query-actions' },
              () => [
                h(
                  FeButton,
                  {
                    type: 'primary',
                    onClick: () => emit('submit'),
                  },
                  () => props.submitText,
                ),
                h(
                  FeButton,
                  {
                    onClick: () => emit('reset'),
                  },
                  () => props.resetText,
                ),
              ],
            ),
          ],
        ),
        withDirectives(
          h(
            FeTable,
            {
              class: 'fe-comps-table',
              data: toValue(props.data),
            },
            () => renderTableColumns(props.columns),
          ),
          [[vFeLoading, toValue(props.loading)]],
        ),
        h(FePagination, {
          class: 'fe-comps-pagination',
          currentPage: toValue(props.pagination.currentPage),
          pageSize: toValue(props.pagination.pageSize),
          total: toValue(props.pagination.total),
          'onUpdate:currentPage': (page: number) => emit('update:currentPage', page),
          'onUpdate:pageSize': (pageSize: number) => emit('update:pageSize', pageSize),
        }),
      ])
  },
})
</script>
