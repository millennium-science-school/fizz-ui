import type {
  FecActionItem,
  FecDetailProps,
  FecDetailSchemaItem,
  FecDialogFormProps,
  FecDrawerFormProps,
  FecFormProps,
  FecFormSchemaItem,
  FecPagination,
  FecQueryFormProps,
  FecQuerySchemaItem,
  FecQueryTableProps,
  FecRowAction,
  FecTableProps,
} from '@fizz/el-comps'
import type { FieldOption } from '@fizz/el-kit'
import type { Component } from 'vue'
import {
  defineFecDetailSchema,
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
  FecDetail,
  FecDialogForm,
  FecDrawerForm,
  FecForm,
  FecPage,
  FecQueryForm,
  FecQueryTable,
  FecSection,
  FecStack,
  FecTable,
  FecToolbar,
} from '@fizz/el-comps'
import { ref } from 'vue'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

declare const CustomControl: Component

// ---- shared data ----

const statusOptions: FieldOption<string>[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

const pagination: FecPagination = {
  currentPage: ref(1),
  pageSize: () => 10,
  total: 1,
}

// ---- FecPage / FecSection / FecStack / FecToolbar ----

const toolbarActions: FecActionItem[] = [
  { key: 'create', label: '新建', type: 'primary' },
]

const pageVNode = (
  <FecPage title="Users" description="Manage users">
    {{
      extra: () => <button>Create</button>,
      default: () => (
        <FecSection title="List">
          {{
            default: () => (
              <FecStack direction="horizontal" gap="sm">
                <FecToolbar
                  actions={toolbarActions}
                  onAction={(key: string) => { void key }}
                />
              </FecStack>
            ),
          }}
        </FecSection>
      ),
    }}
  </FecPage>
)

// ---- FecForm ----

const formSchema: FecFormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', kind: 'input', fieldProps: { placeholder: '姓名' } },
  { prop: 'age', label: '年龄', kind: 'number' },
  { prop: 'name', label: '自定义', component: CustomControl, fieldProps: { placeholder: 'custom' } },
]

const helperFormSchema = defineFecFormSchema<User>([
  { prop: 'name', label: '姓名', kind: 'input', fieldProps: { placeholder: '姓名' } },
  { prop: 'age', label: '年龄', kind: 'number' },
  { prop: 'name', label: '自定义', component: CustomControl, fieldProps: { placeholder: 'custom' } },
])

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

const formProps: FecFormProps<User> = {
  model: { name: '', age: 0 },
  schema: formSchema,
  columns: 2,
}

const formVNode = (
  <FecForm<User>
    {...formProps}
    {...{ 'onUpdate:model': (model: User) => { void model } }}
  />
)

// ---- FecQueryForm ----

const querySchema: FecQuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', kind: 'select', options: statusOptions },
]

const helperQuerySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'select', options: statusOptions },
])

const invalidQuerySchema: FecQuerySchemaItem<Query>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error query schema prop should be keyed to the query model
    prop: 'missing',
  },
]

const queryFormProps: FecQueryFormProps<Query> = {
  model: { keyword: '' },
  schema: querySchema,
  submitText: '搜索',
}

const queryFormVNode = (
  <FecQueryForm<Query>
    {...queryFormProps}
    onSubmit={(model: Query) => { void model }}
    onReset={() => {}}
    {...{ 'onUpdate:model': (model: Query) => { void model } }}
  />
)

// ---- FecTable ----

const tableProps: FecTableProps<User> = {
  columns: [{ prop: 'name', label: '姓名', width: 160, align: 'center' }],
  data: ref([{ name: 'Tom', age: 18 }]),
  pagination,
}

const helperColumns = defineFecTableColumns<User>([
  { prop: 'name', label: '姓名', width: 160, align: 'center' },
  { prop: 'age', label: '年龄', minWidth: 120 },
])

defineFecTableColumns<User>([
  {
    label: '缺失',
    // @ts-expect-error defineFecTableColumns should reject unknown row fields
    prop: 'missing',
  },
])

const rowActions: FecRowAction<User>[] = [
  { key: 'edit', label: '编辑' },
]

const tableVNode = (
  <FecTable<User>
    {...tableProps}
    toolbarActions={toolbarActions}
    rowActions={rowActions}
    {...{
      'onUpdate:currentPage': (page: number) => { void page },
      'onUpdate:pageSize': (size: number) => { void size },
      'onToolbarAction': (key: string) => { void key },
      'onRowAction': (key: string, row: User) => {
        void key
        void row
      },
    }}
  />
)

const invalidTableJsx = (
  <FecTable<User>
    columns={[
      {
        label: '缺失',
        // @ts-expect-error FecTable columns prop should be keyed to the row type
        prop: 'missing',
      },
    ]}
    data={ref([{ name: 'Tom', age: 18 }])}
  />
)

// ---- FecQueryTable ----

const queryTableProps: FecQueryTableProps<User, Query> = {
  query: { keyword: '' },
  querySchema,
  queryRules: { keyword: [{ min: 2, message: '至少两个字符' }] },
  columns: [{ prop: 'age', label: '年龄', minWidth: 120 }],
  data: () => [{ name: 'Jerry', age: 20 }],
  loading: ref(false),
  pagination,
  submitText: 'Search',
  resetText: 'Clear',
}

const queryTableVNode = (
  <FecQueryTable<User, Query>
    {...queryTableProps}
    toolbarActions={toolbarActions}
    rowActions={rowActions}
    {...{
      'onUpdate:query': (query: Query) => { void query },
      'onSubmit': (model: Query) => { void model },
      'onReset': () => {},
      'onUpdate:currentPage': (page: number) => { void page },
      'onUpdate:pageSize': (size: number) => { void size },
      'onToolbarAction': (key: string) => { void key },
      'onRowAction': (key: string, row: User) => {
        void key
        void row
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
  />
)

// ---- FecDetail ----

const detailSchema: FecDetailSchemaItem<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', formatter: value => `${value} 岁` },
]

const helperDetailSchema = defineFecDetailSchema<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', formatter: value => `${value} 岁` },
])

defineFecDetailSchema<User>([
  // @ts-expect-error detail formatter value should match the selected field type
  {
    prop: 'age',
    label: '年龄',
    formatter: (value: string) => value,
  },
])

const detailProps: FecDetailProps<User> = {
  record: { name: 'Tom', age: 18 },
  schema: detailSchema,
  columns: 2,
  emptyText: '-',
}

const detailVNode = <FecDetail<User> {...detailProps} />

// ---- FecDialogForm ----

const dialogFormProps: FecDialogFormProps<User> = {
  modelValue: true,
  title: '新建用户',
  model: { name: '', age: 0 },
  schema: formSchema,
}

const dialogVNode = (
  <FecDialogForm<User>
    {...dialogFormProps}
    onConfirm={(model: User) => { void model }}
    onCancel={() => {}}
    {...{
      'onUpdate:modelValue': (val: boolean) => { void val },
      'onUpdate:model': (model: User) => { void model },
    }}
  />
)

// ---- FecDrawerForm ----

const drawerFormProps: FecDrawerFormProps<User> = {
  modelValue: false,
  title: '编辑用户',
  model: { name: 'Tom', age: 18 },
  schema: formSchema,
}

const drawerVNode = (
  <FecDrawerForm<User>
    {...drawerFormProps}
    onConfirm={(model: User) => { void model }}
    onCancel={() => {}}
    {...{
      'onUpdate:modelValue': (val: boolean) => { void val },
      'onUpdate:model': (model: User) => { void model },
    }}
  />
)

void invalidFormSchema
void invalidQuerySchema
void removedComponentStringSchema
void helperFormSchema
void helperQuerySchema
void helperColumns
void helperDetailSchema
void pageVNode
void formVNode
void queryFormVNode
void tableVNode
void invalidTableJsx
void queryTableVNode
void invalidQueryTableJsx
void detailVNode
void dialogVNode
void drawerVNode
