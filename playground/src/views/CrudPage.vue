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
} from '@fizz/el-comps'
import { FeButton, FeDialog } from '@fizz/el-plus'
import { ref } from 'vue'

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

const queryModel = ref<Query>({ keyword: '', status: '' })

const filteredUsers = ref<User[]>(users.value)

function applyQuery() {
  const { keyword, status } = queryModel.value
  filteredUsers.value = users.value.filter((u) => {
    if (keyword && !u.name.includes(keyword))
      return false
    if (status && u.status !== status)
      return false
    return true
  })
}

const pagination = {
  currentPage: ref(1),
  pageSize: ref(10),
  total: ref(users.value.length),
}

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

// Dialog form state
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const editingUser = ref<User>({ id: 0, name: '', age: 0, status: 'enabled' })
const dialogModel = ref<UserForm>({ name: '', age: 0 })

function openCreate() {
  dialogMode.value = 'create'
  dialogModel.value = { name: '', age: 0 }
  dialogVisible.value = true
}

function openEdit(row: User) {
  dialogMode.value = 'edit'
  editingUser.value = row
  dialogModel.value = { name: row.name, age: row.age }
  dialogVisible.value = true
}

function handleConfirm(model: UserForm) {
  if (dialogMode.value === 'create') {
    users.value.push({ id: nextId++, status: 'enabled', ...model })
  }
  else {
    Object.assign(editingUser.value, model)
  }
  filteredUsers.value = [...users.value]
  pagination.total.value = users.value.length
  dialogVisible.value = false
}

// Detail state
const detailVisible = ref(false)
const detailRecord = ref<User>({ id: 0, name: '', age: 0, status: '' })

function openDetail(row: User) {
  detailRecord.value = row
  detailVisible.value = true
}

function handleRowAction(key: string, row: User) {
  if (key === 'edit')
    openEdit(row)
  else if (key === 'detail')
    openDetail(row)
}
</script>

<template>
  <FecPage title="用户管理" description="示例 CRUD 管理页面">
    <FecSection title="用户列表">
      <FecQueryTable
        v-model:query="queryModel"
        :query-schema="querySchema"
        :columns="columns"
        :data="filteredUsers"
        :pagination="pagination"
        :toolbar-actions="[{ key: 'create', label: '新建用户', type: 'primary' }]"
        :row-actions="[
          { key: 'edit', label: '编辑' },
          { key: 'detail', label: '详情' },
        ]"
        submit-text="查询"
        reset-text="重置"
        @submit="applyQuery"
        @reset="() => { queryModel = { keyword: '', status: '' }; applyQuery() }"
        @toolbar-action="(key) => key === 'create' && openCreate()"
        @row-action="handleRowAction"
      />
    </FecSection>
  </FecPage>

  <FecDialogForm
    v-model:model-value="dialogVisible"
    v-model:model="dialogModel"
    :title="dialogMode === 'create' ? '新建用户' : '编辑用户'"
    :schema="formSchema"
    :rules="formRules"
    @confirm="handleConfirm"
    @cancel="dialogVisible = false"
  />

  <FeDialog v-model="detailVisible" title="用户详情" width="480px">
    <FecDetail :record="detailRecord" :schema="detailSchema" :columns="1" />
    <template #footer>
      <FeButton @click="detailVisible = false">
        关闭
      </FeButton>
    </template>
  </FeDialog>
</template>
