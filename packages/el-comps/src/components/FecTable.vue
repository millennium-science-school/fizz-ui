<script lang="ts">
import type { MaybeRefOrGetter, PropType, Ref } from 'vue'
import type {
  FecFormModel,
  FecFormSchemaItem,
  FecPagination,
  FecTableColumn,
} from './types'
import {
  FeForm,
  FePagination,
  FeTable,
} from '@fizz/el-plus'
import { defineComponent, h, isRef, toValue } from 'vue'
import { renderSchemaFields } from './schemaFields'
import { renderTableColumns } from './tableColumns'

export default defineComponent({
  name: 'FecTable',
  props: {
    form: {
      type: Object as PropType<FecFormModel>,
      required: true,
    },
    formSchema: {
      type: Array as PropType<FecFormSchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<FecTableColumn<object>[]>,
      required: true,
    },
    data: {
      type: [Array, Object, Function] as PropType<MaybeRefOrGetter<object[]>>,
      required: true,
    },
    pagination: {
      type: Object as PropType<FecPagination>,
      required: true,
    },
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    function emitFormField(prop: string, value: unknown) {
      emit('update:form', {
        ...props.form,
        [prop]: value,
      })
    }

    function updateCurrentPage(page: number) {
      if (isRef(props.pagination.currentPage)) {
        const currentPage = props.pagination.currentPage as Ref<number>
        currentPage.value = page
      }
    }

    return () =>
      h('div', { class: 'fe-comps-table-wrap' }, [
        h(
          FeForm,
          {
            class: 'fe-comps-form',
            inline: true,
            model: props.form,
          },
          () =>
            renderSchemaFields({
              schema: props.formSchema,
              model: props.form,
              onUpdateField: emitFormField,
            }),
        ),
        h(
          FeTable,
          {
            class: 'fe-comps-table',
            data: toValue(props.data),
          },
          () => renderTableColumns(props.columns),
        ),
        h(FePagination, {
          class: 'fe-comps-pagination',
          currentPage: toValue(props.pagination.currentPage),
          total: toValue(props.pagination.total),
          pageSize: toValue(props.pagination.pageSize),
          'onUpdate:currentPage': updateCurrentPage,
        }),
      ])
  },
})
</script>
