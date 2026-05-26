<script setup lang="ts">
import {
  FecDetail,
  FecDialogForm,
  FecPage,
  FecQueryTable,
  FecSection,
} from '@fizz/el-comps'
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

const pagination = ref({
  currentPage: ref(1),
  pageSize: ref(10),
  total: ref(users.value.length),
})

const querySchema = [
  { prop: 'keyword' as const, label: '姓名', kind: 'input' as const },
  {
    prop: 'status' as const,
    label: '状态',
    kind: 'select' as const,
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
]

const columns = [
  { prop: 'name' as const, label: '姓名' },
  { prop: 'age' as const, label: '年龄', align: 'right' as const },
  { prop: 'status' as const, label: '状态' },
]

const formSchema = [
  { prop: 'name' as const, label: '姓名', kind: 'input' as const },
  { prop: 'age' as const, label: '年龄', kind: 'number' as const },
]

const detailSchema = [
  { prop: 'name' as const, label: '姓名' },
  { prop: 'age' as const, label: '年龄', formatter: (v: number) => `${v} 岁` },
  { prop: 'status' as const, label: '状态' },
]

// Dialog form state
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const editingUser = ref<User>({ id: 0, name: '', age: 0, status: 'enabled' })
const dialogModel = ref({ name: '', age: 0 })

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

function handleConfirm(model: { name: string, age: number }) {
  if (dialogMode.value === 'create') {
    users.value.push({ id: nextId++, status: 'enabled', ...model })
  }
  else {
    Object.assign(editingUser.value, model)
  }
  filteredUsers.value = [...users.value]
  pagination.value.total.value = users.value.length
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
    <template #extra>
      <a href="/" style="margin-right:8px">← 返回首页</a>
    </template>

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
    :title="dialogMode === 'create' ? '新建用户' : '编辑用户'"
    :model="dialogModel"
    :schema="formSchema"
    @confirm="handleConfirm"
    @cancel="dialogVisible = false"
  />

  <div v-if="detailVisible" class="fe-comps-detail-overlay">
    <FecDetail
      :record="detailRecord"
      :schema="detailSchema"
    />
    <button @click="detailVisible = false">
      关闭
    </button>
  </div>
</template>
