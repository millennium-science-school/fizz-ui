import type {
  FieldControlKind,
  FieldOption,
  FormSchemaItem,
  QueryFormRules,
  QuerySchemaItem,
  TableColumn,
  UseTableOptions,
} from '@fizz/el-kit'
import {
  defineFormSchema,
  defineQuerySchema,
  defineTableColumns,
  useDetailState,
  useDialogFormState,
  usePaginationState,
  useQueryForm,
  useQueryState,
  useQueryTable,
  useTable,
} from '@fizz/el-kit'
import { ref } from 'vue'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
  enabled: boolean
}

const columns: TableColumn<User>[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right', minWidth: 120 },
]

const helperColumns = defineTableColumns<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right', minWidth: 120 },
])

defineTableColumns<User>([
  {
    label: '缺失',
    // @ts-expect-error defineTableColumns should reject unknown row fields
    prop: 'missing',
  },
])

const invalidColumns: TableColumn<User>[] = [
  {
    label: '缺失',
    // @ts-expect-error table column prop should be keyed to the row type
    prop: 'missing',
  },
]

const tableOptions: UseTableOptions<User> = {
  columns: () => columns,
  data: ref([{ name: 'Tom', age: 18 }]),
  loading: ref(false),
  pagination: {
    currentPage: () => 1,
    pageSize: ref(10),
    total: 1,
  },
}

const table = useTable<User>(tableOptions)
table.setColumns([{ prop: 'name', label: '姓名' }])
table.setData([{ name: 'Jerry', age: 20 }])
table.setLoading(true)
table.setPage(2)
table.setPageSize(20)
table.setTotal(40)

const rules: QueryFormRules<Query> = {
  keyword: [{ required: true, min: 2, message: '至少两个字符' }],
  enabled: [{ validator: value => typeof value === 'boolean' }],
}

const invalidRules: QueryFormRules<Query> = {
  // @ts-expect-error query rules should be keyed to the query model
  missing: [{ required: true }],
}

const submitted: Query[] = []
const queryForm = useQueryForm<Query>({
  model: ref({ keyword: '', enabled: false }),
  rules,
  initialModel: { keyword: 'initial', enabled: true },
  onSubmit: model => submitted.push(model),
})

queryForm.setField('keyword', 'Fizz')
queryForm.setField('enabled', true)
queryForm.setRules({ keyword: [{ max: 20 }] })
queryForm.reset()
queryForm.submit()

// @ts-expect-error setField should reject unknown query fields
queryForm.setField('missing', 'value')

// @ts-expect-error setField should preserve the field value type
queryForm.setField('enabled', 'yes')

type Status = 'enabled' | 'disabled'

const statusOptions: FieldOption<Status>[] = [
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]

const fieldKind: FieldControlKind = 'select'

const formSchema: FormSchemaItem<User>[] = [
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
]

const helperFormSchema = defineFormSchema<User>([
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
])

const querySchema: QuerySchemaItem<Query>[] = [
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: fieldKind, options: statusOptions },
]

const helperQuerySchema = defineQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: fieldKind, options: statusOptions },
])

const querySchemaWithNewKinds = defineQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
  { prop: 'enabled', label: '状态', kind: 'multiSelect', options: statusOptions },
  { prop: 'keyword', label: '日期范围', kind: 'dateRange' },
])

const formSchemaWithNewKinds = defineFormSchema<User>([
  { prop: 'name', label: '姓名', kind: 'multiSelect', options: statusOptions },
  { prop: 'age', label: '日期范围', kind: 'dateRange' },
])

void querySchemaWithNewKinds
void formSchemaWithNewKinds

const invalidFormSchema: FormSchemaItem<User>[] = [
  {
    label: '缺失',
    kind: 'input',
    // @ts-expect-error form schema prop should be keyed to the form model
    prop: 'missing',
  },
]

const invalidControlKind: FormSchemaItem<User>[] = [
  {
    prop: 'name',
    label: '错误控件',
    // @ts-expect-error semantic controls should use FieldControlKind
    kind: 'ElInput',
  },
]

void invalidColumns
void invalidRules
void table
void queryForm
void submitted
void formSchema
void helperColumns
void helperFormSchema
void helperQuerySchema
void querySchema
void invalidFormSchema
void invalidControlKind
void statusOptions

// --- New CRUD headless APIs ---

const paginationState = usePaginationState({ pageSize: 20 })
paginationState.setPage(2)
paginationState.resetPage()

const queryState = useQueryState<Query>({
  model: { keyword: '', enabled: false },
})
queryState.setField('enabled', true)
// @ts-expect-error query state should preserve field value types
queryState.setField('enabled', 'yes')

interface UserForm {
  name: string
  age: number
}

const dialogFormState = useDialogFormState<UserForm, User>({
  createModel: () => ({ name: '', age: 0 }),
  toFormModel: user => ({ name: user.name, age: user.age }),
})
dialogFormState.openCreate()
dialogFormState.openEdit({ name: 'Tom', age: 18 })

const detailState = useDetailState<User>()
detailState.open({ name: 'Tom', age: 18 })

const queryTableState = useQueryTable<User, Query>({
  columns: helperColumns,
  query: { keyword: '', enabled: false },
  fetchList: async request => ({
    data: [{ name: request.query.keyword || 'Tom', age: 18 }],
    total: 1,
  }),
})

async function exerciseCrudApis() {
  await queryTableState.submit()
  await queryTableState.setPage(2)
  await queryTableState.setPageSize(20)
}

void paginationState
void queryState
void dialogFormState
void detailState
void queryTableState
void exerciseCrudApis
