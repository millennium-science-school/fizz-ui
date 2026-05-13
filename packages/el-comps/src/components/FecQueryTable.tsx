import type { QueryFormRules, TableColumn } from '@fizz/el-kit'
import type { TransparentWrapperComponent } from '@fizz/el-plus'
import type { MaybeRefOrGetter, PropType } from 'vue'
import {
  FeButton,
  FeForm,
  FeFormItem,
  FeInput,
  FeInputNumber,
  FePagination,
  FeTable,
  FeTableColumn,
  vFeLoading,
} from '@fizz/el-plus'
import { defineComponent, toValue, withDirectives } from 'vue'

type QueryModel = Record<string, unknown>

export interface FecQuerySchemaItem<T extends object> {
  prop: Extract<keyof T, string>
  label: string
  component: 'ElInput' | 'ElInputNumber'
}

export type FecQueryTableColumn<T extends object> = TableColumn<T>

export interface FecQueryPagination {
  currentPage: MaybeRefOrGetter<number>
  pageSize: MaybeRefOrGetter<number>
  total: MaybeRefOrGetter<number>
}

export interface FecQueryTableProps<Row extends object, Query extends QueryModel> {
  query: Query
  querySchema: FecQuerySchemaItem<Query>[]
  rules?: QueryFormRules<Query>
  columns: FecQueryTableColumn<Row>[]
  data: MaybeRefOrGetter<Row[]>
  loading?: MaybeRefOrGetter<boolean>
  pagination: FecQueryPagination
}

function resolveFormComponent(component: FecQuerySchemaItem<object>['component']): TransparentWrapperComponent {
  if (component === 'ElInputNumber')
    return FeInputNumber

  return FeInput
}

export const FecQueryTable = defineComponent({
  name: 'FecQueryTable',
  props: {
    query: {
      type: Object as PropType<QueryModel>,
      required: true,
    },
    querySchema: {
      type: Array as PropType<FecQuerySchemaItem<object>[]>,
      required: true,
    },
    rules: {
      type: Object as PropType<QueryFormRules<QueryModel>>,
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

    return () => (
      <div class="fe-comps-query-table">
        <FeForm
          class="fe-comps-query-form"
          inline
          model={props.query}
          rules={props.rules}
        >
          {{
            default: () => [
              ...props.querySchema.map((item) => {
                const FormControl = resolveFormComponent(item.component)

                return (
                  <FeFormItem key={item.prop} label={item.label} prop={item.prop}>
                    {{
                      default: () => (
                        <FormControl
                          {...{
                            'modelValue': props.query[item.prop],
                            'onUpdate:modelValue': (value: unknown) => emitQueryField(item.prop, value),
                          }}
                        />
                      ),
                    }}
                  </FeFormItem>
                )
              }),
              <FeFormItem class="fe-comps-query-actions">
                {{
                  default: () => [
                    <FeButton type="primary" onClick={() => emit('submit')}>
                      查询
                    </FeButton>,
                    <FeButton onClick={() => emit('reset')}>
                      重置
                    </FeButton>,
                  ],
                }}
              </FeFormItem>,
            ],
          }}
        </FeForm>
        {withDirectives(
          <FeTable
            class="fe-comps-table"
            data={toValue(props.data)}
          >
            {{
              default: () => props.columns.map(column => (
                <FeTableColumn
                  key={column.prop}
                  align={column.align}
                  label={column.label}
                  minWidth={column.minWidth}
                  prop={column.prop}
                  width={column.width}
                />
              )),
            }}
          </FeTable>,
          [[vFeLoading, toValue(props.loading)]],
        )}
        <FePagination
          {...{
            'class': 'fe-comps-pagination',
            'currentPage': toValue(props.pagination.currentPage),
            'pageSize': toValue(props.pagination.pageSize),
            'total': toValue(props.pagination.total),
            'onUpdate:currentPage': (page: number) => emit('update:currentPage', page),
            'onUpdate:pageSize': (pageSize: number) => emit('update:pageSize', pageSize),
          }}
        />
      </div>
    )
  },
})
