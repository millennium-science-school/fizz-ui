import type {
  FecFormSchemaItem,
  FecPagination,
  FecQueryPagination,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecTableProps,
} from '@fizz/el-comps'
import type { Component } from 'vue'
import type { FieldOption } from '@fizz/el-kit'
import { FecQueryTable, FecTable } from '@fizz/el-comps'
import { ref } from 'vue'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

declare const CustomControl: Component

const statusOptions: FieldOption<string>[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

const formSchema: FecFormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', kind: 'input', fieldProps: { placeholder: '姓名' } },
  { prop: 'age', label: '年龄', kind: 'number' },
  { prop: 'name', label: '自定义', component: CustomControl, fieldProps: { placeholder: 'custom' } },
]

const invalidFormSchema: FecFormSchemaItem<User>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error form schema prop should be keyed to the row type
    prop: 'missing',
  },
]

const removedComponentStringSchema: FecFormSchemaItem<User>[] = [
  {
    prop: 'name',
    label: '旧写法',
    // @ts-expect-error semantic controls should use kind instead of component strings
    component: 'input',
  },
]

const querySchema: FecQuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', kind: 'select', options: statusOptions },
]

const invalidQuerySchema: FecQuerySchemaItem<Query>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error query schema prop should be keyed to the query model
    prop: 'missing',
  },
]

const pagination: FecPagination = {
  currentPage: ref(1),
  pageSize: () => 10,
  total: 1,
}

const queryPagination: FecQueryPagination = {
  currentPage: ref(1),
  pageSize: ref(10),
  total: () => 30,
}

const tableProps: FecTableProps<User> = {
  form: { name: '' },
  formSchema,
  columns: [{ prop: 'name', label: '姓名', width: 160, align: 'center' }],
  data: ref([{ name: 'Tom', age: 18 }]),
  pagination,
}

const queryTableProps: FecQueryTableProps<User, Query> = {
  query: { keyword: '' },
  querySchema,
  rules: { keyword: [{ min: 2, message: '至少两个字符' }] },
  columns: [{ prop: 'age', label: '年龄', minWidth: 120 }],
  data: () => [{ name: 'Jerry', age: 20 }],
  loading: ref(false),
  pagination: queryPagination,
  submitText: 'Search',
  resetText: 'Clear',
}

const tableVNode = (
  <FecTable<User>
    {...tableProps}
    {...{ 'onUpdate:form': (form: Record<string, unknown>) => { void form } }}
  />
)

const invalidTableJsx = (
  <FecTable<User>
    form={{ name: '' }}
    formSchema={[
      {
        label: '缺失',
        kind: 'input',
        // @ts-expect-error FecTable formSchema prop should be keyed to the row type
        prop: 'missing',
      },
    ]}
    columns={[{ prop: 'name', label: '姓名' }]}
    data={ref([{ name: 'Tom', age: 18 }])}
    pagination={pagination}
  />
)

const queryTableVNode = (
  <FecQueryTable<User, Query>
    {...queryTableProps}
    {...{
      'onUpdate:currentPage': (page: number) => {
        void page
      },
      'onUpdate:pageSize': (pageSize: number) => {
        void pageSize
      },
      'onUpdate:query': (query: Query) => {
        void query
      },
    }}
  />
)

const invalidQueryTableJsx = (
  <FecQueryTable<User, Query>
    query={{ keyword: '' }}
    querySchema={[
      {
        label: '缺失',
        kind: 'input',
        // @ts-expect-error FecQueryTable querySchema prop should be keyed to the query model
        prop: 'missing',
      },
    ]}
    columns={[{ prop: 'age', label: '年龄' }]}
    data={[]}
    pagination={queryPagination}
  />
)

void invalidFormSchema
void invalidQuerySchema
void tableVNode
void invalidTableJsx
void queryTableVNode
void invalidQueryTableJsx
void removedComponentStringSchema
