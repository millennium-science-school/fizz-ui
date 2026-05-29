<script setup lang="ts">
import {
  defineFecDetailSchema,
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
  FecDetail,
  FecDialogForm,
  FecPage,
  FecQueryTable,
  FecSection,
  useFecQueryTableBindings,
} from '@fizz/el-comps'
import {
  useDetailState,
  useDialogFormState,
  useQueryTable,
} from '@fizz/el-kit'
import { FeButton, FeDialog } from '@fizz/el-plus'
import { computed, ref } from 'vue'

interface User {
  id: number
  name: string
  age: number
  status: string
}

interface Query {
  keyword: string
  status: string
}

interface UserForm {
  name: string
  age: number
}

const users = ref<User[]>([
  { id: 1, name: 'Tom', age: 18, status: 'enabled' },
  { id: 2, name: 'Jerry', age: 20, status: 'disabled' },
  { id: 3, name: 'Ann', age: 22, status: 'enabled' },
])

let nextId = 4

const querySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: '姓名', kind: 'input' },
  {
    prop: 'status',
    label: '状态',
    kind: 'select',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
])

const columns = defineFecTableColumns<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right' },
  { prop: 'status', label: '状态' },
])

const formSchema = defineFecFormSchema<UserForm>([
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
])

const detailSchema = defineFecDetailSchema<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', formatter: (v: number) => `${v} 岁` },
  { prop: 'status', label: '状态' },
])

const formRules = {
  name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
  age: [{ type: 'number', min: 1, message: '年龄须大于 0', trigger: 'blur' }],
}

const list = useQueryTable<User, Query>({
  columns,
  fetchList: ({ query, currentPage, pageSize }) => {
    const filtered = users.value.filter((u) => {
      if (query.keyword && !u.name.includes(query.keyword))
        return false
      if (query.status && u.status !== query.status)
        return false
      return true
    })
    const start = (currentPage - 1) * pageSize
    return { data: filtered.slice(start, start + pageSize), total: filtered.length }
  },
  immediate: true,
  query: { keyword: '', status: '' },
})

const dialog = useDialogFormState<UserForm, User>({
  createModel: () => ({ name: '', age: 0 }),
  toFormModel: user => ({ name: user.name, age: user.age }),
})

const detail = useDetailState<User>()
const queryTableBindings = useFecQueryTableBindings(list)

const dialogTitle = computed(() =>
  dialog.mode.value === 'create' ? '新建用户' : '编辑用户',
)

function openCreate() {
  dialog.openCreate()
}

function openEdit(row: User) {
  dialog.openEdit(row)
}

async function handleConfirm(model: UserForm) {
  if (dialog.mode.value === 'create') {
    users.value.push({ id: nextId++, status: 'enabled', ...model })
  }
  else if (dialog.editingRecord.value) {
    Object.assign(dialog.editingRecord.value, model)
  }
  dialog.close()
  await list.refresh()
}

function handleRowAction(key: string, row: User) {
  if (key === 'edit')
    openEdit(row)
  else if (key === 'detail')
    detail.open(row)
}
</script>

<template>
  <FecPage title="用户管理" description="示例 CRUD 管理页面">
    <FecSection title="用户列表">
      <FecQueryTable
        v-bind="queryTableBindings"
        :query-schema="querySchema"
        :toolbar-actions="[{ key: 'create', label: '新建用户', type: 'primary' }]"
        :row-actions="[
          { key: 'edit', label: '编辑' },
          { key: 'detail', label: '详情' },
        ]"
        submit-text="查询"
        reset-text="重置"
        @toolbar-action="(key) => key === 'create' && openCreate()"
        @row-action="handleRowAction"
      />
    </FecSection>
  </FecPage>

  <FecDialogForm
    :model-value="dialog.visible.value"
    :model="dialog.model.value"
    :title="dialogTitle"
    :schema="formSchema"
    :rules="formRules"
    @update:model-value="(value: boolean) => { if (!value) dialog.close() }"
    @update:model="dialog.setModel"
    @confirm="handleConfirm"
    @cancel="dialog.close"
  />

  <FeDialog
    :model-value="detail.visible.value"
    title="用户详情"
    width="480px"
    @update:model-value="(value: boolean) => { if (!value) detail.close() }"
  >
    <FecDetail
      v-if="detail.record.value"
      :record="detail.record.value"
      :schema="detailSchema"
      :columns="1"
    />
    <template #footer>
      <FeButton @click="detail.close">
        关闭
      </FeButton>
    </template>
  </FeDialog>
</template>
