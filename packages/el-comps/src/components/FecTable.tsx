import type { TableColumn } from '@fizz/el-kit'
import type { MaybeRefOrGetter, PropType, Ref } from 'vue'
import type { FecControl } from './controls'
import {
  FeForm,
  FeFormItem,
  FePagination,
  FeTable,
  FeTableColumn,
} from '@fizz/el-plus'
import { defineComponent, h, isRef, toValue } from 'vue'
import { resolveFecControl } from './controls'

type FormModel = Record<string, unknown>

export interface FecFormSchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: FecControl
}

export type FecTableColumn<T extends object> = TableColumn<T>

export interface FecPagination {
  currentPage: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
}

export interface FecTableProps<T extends object> {
  form: FormModel
  formSchema: FecFormSchemaItem<T>[]
  columns: FecTableColumn<T>[]
  data: MaybeRefOrGetter<T[]>
  pagination: FecPagination
}

export const FecTable = defineComponent({
  name: 'FecTable',
  props: {
    form: {
      type: Object as PropType<FormModel>,
      required: true,
    },
    formSchema: {
      type: Array as PropType<FecFormSchemaItem<object>[]>,
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

    return () => (
      <div class="fe-comps-table-wrap">
        <FeForm model={props.form} class="fe-comps-form" inline>
          {{
            default: () => props.formSchema.map((item) => {
              const resolvedControl = resolveFecControl(item.component)
              const FormControl = resolvedControl.component

              return (
                <FeFormItem key={item.prop} label={item.label}>
                  {{
                    default: () => h(FormControl, {
                      ...resolvedControl.props,
                      'modelValue': props.form[item.prop],
                      'onUpdate:modelValue': (value: unknown) => emitFormField(item.prop, value),
                    }),
                  }}
                </FeFormItem>
              )
            }),
          }}
        </FeForm>
        <FeTable data={toValue(props.data)} class="fe-comps-table">
          {{
            default: () => props.columns.map(column => (
              <FeTableColumn key={column.prop} prop={column.prop} label={column.label} />
            )),
          }}
        </FeTable>
        <FePagination
          {...{
            'class': 'fe-comps-pagination',
            'currentPage': toValue(props.pagination.currentPage),
            'total': toValue(props.pagination.total),
            'pageSize': toValue(props.pagination.pageSize),
            'onUpdate:currentPage': updateCurrentPage,
          }}
        />
      </div>
    )
  },
})
