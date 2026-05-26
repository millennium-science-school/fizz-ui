<script setup lang="ts">
/**
 * /comps-lab — el-comps 验收 lab 页面
 *
 * 目的：专门暴露组件边界，供开发时人工检查和 integration 测试锚定。
 * 不是文档页，不追求完美排版，以覆盖行为路径为优先。
 */
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
} from '@fizz/el-comps'
import { FeButton, FeMessage } from '@fizz/el-plus'
import { defineComponent, h, ref } from 'vue'

// ─── 公共类型 ────────────────────────────────────────────────────────────────

interface Row {
  id: number
  name: string
  age: number
  status: string
  score: number | null
}

interface Query {
  keyword: string
  status: string
}

// ─── FecForm ─────────────────────────────────────────────────────────────────

const formModel = ref({ name: '', age: 0, status: '', flag: false, color: '#3b82f6' })

const formRules = {
  name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
  age: [{ min: 1, message: '年龄须大于 0', trigger: 'blur' }],
}

// 自定义控件（无外部依赖，直接 defineComponent 内联）
const ColorInput = defineComponent({
  props: { modelValue: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'color',
        value: props.modelValue ?? '#000000',
        onInput: (e: Event) =>
          emit('update:modelValue', (e.target as HTMLInputElement).value),
        style: 'height:32px;width:64px;border:none;padding:0;cursor:pointer',
      })
  },
})

const formSchema = defineFecFormSchema<typeof formModel.value>([
  { prop: 'name', label: '姓名 (input)', kind: 'input' },
  { prop: 'age', label: '年龄 (number)', kind: 'number' },
  {
    prop: 'status',
    label: '状态 (select)',
    kind: 'select',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  { prop: 'flag', label: '开关 (switch)', kind: 'switch' },
  {
    prop: 'color',
    label: '自定义控件 (color)',
    component: ColorInput,
  },
])

// ─── FecQueryForm ─────────────────────────────────────────────────────────────

const queryModel = ref<Query>({ keyword: '', status: '' })
const queryRules = { keyword: [{ min: 2, message: '至少两个字符' }] }

const querySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
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

function onQuerySubmit() {
  FeMessage.success(`查询：keyword=${queryModel.value.keyword || '全部'}, status=${queryModel.value.status || '全部'}`)
}

function onQueryReset() {
  queryModel.value = { keyword: '', status: '' }
}

// ─── 数据 & 分页 ─────────────────────────────────────────────────────────────

const allRows = ref<Row[]>([
  { id: 1, name: 'Alice', age: 28, status: 'enabled', score: 92 },
  { id: 2, name: 'Bob', age: 34, status: 'disabled', score: null },
  { id: 3, name: 'Carol', age: 22, status: 'enabled', score: 78 },
  { id: 4, name: 'Dave', age: 41, status: 'enabled', score: 55 },
  { id: 5, name: 'Eve', age: 19, status: 'disabled', score: null },
])

const tableLoading = ref(false)
const tableColumns = defineFecTableColumns<Row>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right' },
  { prop: 'status', label: '状态' },
  { prop: 'score', label: '得分', align: 'right' },
])

const tablePagination = {
  currentPage: ref(1),
  pageSize: ref(3),
  total: ref(allRows.value.length),
}

const pagedRows = ref<Row[]>([])
function refreshPage() {
  const start = (tablePagination.currentPage.value - 1) * tablePagination.pageSize.value
  pagedRows.value = allRows.value.slice(start, start + tablePagination.pageSize.value)
}
refreshPage()

// ─── FecQueryTable ────────────────────────────────────────────────────────────

const qtQueryModel = ref<Query>({ keyword: '', status: '' })
const qtRows = ref<Row[]>(allRows.value)
const qtPagination = {
  currentPage: ref(1),
  pageSize: ref(3),
  total: ref(allRows.value.length),
}

function applyQtQuery() {
  const { keyword, status } = qtQueryModel.value
  qtRows.value = allRows.value.filter((r) => {
    if (keyword && !r.name.toLowerCase().includes(keyword.toLowerCase()))
      return false
    if (status && r.status !== status)
      return false
    return true
  })
  qtPagination.total.value = qtRows.value.length
  qtPagination.currentPage.value = 1
  refreshQtPage()
}

const qtPagedRows = ref<Row[]>(allRows.value.slice(0, 3))
function refreshQtPage() {
  const start = (qtPagination.currentPage.value - 1) * qtPagination.pageSize.value
  qtPagedRows.value = qtRows.value.slice(start, start + qtPagination.pageSize.value)
}

// ─── FecDialogForm ────────────────────────────────────────────────────────────

const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const dialogModel = ref({ name: '', age: 0 })
const dialogRules = { name: [{ required: true, message: '姓名必填' }] }

const dialogSchema = defineFecFormSchema<typeof dialogModel.value>([
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
])

function openDialog(mode: 'create' | 'edit') {
  dialogMode.value = mode
  dialogModel.value = mode === 'edit' ? { name: 'Alice', age: 28 } : { name: '', age: 0 }
  dialogVisible.value = true
}

function handleDialogConfirm(model: { name: string, age: number }) {
  FeMessage.success(`${dialogMode.value === 'create' ? '新建' : '编辑'} → ${model.name}, ${model.age}`)
}

// ─── FecDrawerForm ────────────────────────────────────────────────────────────

const drawerVisible = ref(false)
const drawerModel = ref({ name: '', age: 0 })

function openDrawer(mode: 'create' | 'edit') {
  drawerModel.value = mode === 'edit' ? { name: 'Bob', age: 34 } : { name: '', age: 0 }
  drawerVisible.value = true
}

function handleDrawerConfirm(model: { name: string, age: number }) {
  FeMessage.success(`抽屉 confirm → ${model.name}, ${model.age}`)
}

// ─── FecDetail ────────────────────────────────────────────────────────────────

const detailRecord = { name: 'Alice', age: 28, status: 'enabled', score: null as number | null }

const detailSchema = defineFecDetailSchema<typeof detailRecord>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', formatter: (v: number) => `${v} 岁` },
  { prop: 'status', label: '状态', formatter: (v: string) => v === 'enabled' ? '启用' : '禁用' },
  { prop: 'score', label: '得分 (空值)', formatter: (v: number | null) => v == null ? '—' : String(v) },
])

function simulateLoading() {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1500)
}
</script>

<template>
  <FecPage title="el-comps Lab" description="组件边界验收页，供开发人工检查与集成断言使用">
    <!-- ── FecForm ─────────────────────────────────────────────────── -->
    <FecSection title="FecForm — 所有 kind + 自定义控件 + 校验">
      <FecForm
        v-model:model="formModel"
        :schema="formSchema"
        :rules="formRules"
        label-width="140px"
        :columns="2"
      />
      <FecStack direction="horizontal" gap="sm" style="margin-top:12px">
        <span class="feclab-value">当前值：{{ JSON.stringify(formModel) }}</span>
      </FecStack>
    </FecSection>

    <!-- ── FecQueryForm ───────────────────────────────────────────── -->
    <FecSection title="FecQueryForm — 查询 / 重置 / 校验">
      <FecQueryForm
        v-model:model="queryModel"
        :schema="querySchema"
        :rules="queryRules"
        submit-text="搜索"
        reset-text="清空"
        @submit="onQuerySubmit"
        @reset="onQueryReset"
      />
    </FecSection>

    <!-- ── FecTable ───────────────────────────────────────────────── -->
    <FecSection title="FecTable — loading / 分页 / toolbar / row-action">
      <FecStack direction="horizontal" gap="sm" style="margin-bottom:8px">
        <FeButton @click="simulateLoading">
          模拟 loading (1.5s)
        </FeButton>
      </FecStack>
      <FecTable
        :columns="tableColumns"
        :data="pagedRows"
        :loading="tableLoading"
        :pagination="tablePagination"
        :toolbar-actions="[{ key: 'add', label: '新建', type: 'primary' }]"
        :row-actions="[{ key: 'edit', label: '编辑' }, { key: 'del', label: '删除', type: 'danger' }]"
        @update:current-page="(p) => { tablePagination.currentPage.value = p; refreshPage() }"
        @update:page-size="(s) => { tablePagination.pageSize.value = s; refreshPage() }"
        @toolbar-action="(k) => FeMessage.info(`toolbar: ${k}`)"
        @row-action="(k, row) => FeMessage.info(`row-action: ${k} → ${row.name}`)"
      />
      <!-- 空表格 -->
      <FecSection title="空数据状态">
        <FecTable
          :columns="tableColumns"
          :data="[]"
        />
      </FecSection>
    </FecSection>

    <!-- ── FecQueryTable ──────────────────────────────────────────── -->
    <FecSection title="FecQueryTable — 查询 + toolbar + row-action + 分页">
      <FecQueryTable
        v-model:query="qtQueryModel"
        :query-schema="querySchema"
        :columns="tableColumns"
        :data="qtPagedRows"
        :pagination="qtPagination"
        :toolbar-actions="[
          { key: 'create', label: '新建', type: 'primary' },
          { key: 'export', label: '导出' },
        ]"
        :row-actions="[
          { key: 'edit', label: '编辑' },
          { key: 'view', label: '查看' },
          { key: 'del', label: '删除', type: 'danger' },
        ]"
        @submit="applyQtQuery"
        @reset="() => { qtQueryModel = { keyword: '', status: '' }; applyQtQuery() }"
        @update:current-page="(p) => { qtPagination.currentPage.value = p; refreshQtPage() }"
        @toolbar-action="(k) => FeMessage.info(`QT toolbar: ${k}`)"
        @row-action="(k, row) => FeMessage.info(`QT row-action: ${k} → ${row.name}`)"
      />
    </FecSection>

    <!-- ── FecDialogForm ──────────────────────────────────────────── -->
    <FecSection title="FecDialogForm — 新建 / 编辑 / 校验 / cancel">
      <FecStack direction="horizontal" gap="sm">
        <FeButton @click="openDialog('create')">
          新建（空表单）
        </FeButton>
        <FeButton @click="openDialog('edit')">
          编辑（预填数据）
        </FeButton>
        <span style="color:#888;font-size:12px">姓名为必填，空提交应被阻断</span>
      </FecStack>
    </FecSection>

    <!-- ── FecDrawerForm ──────────────────────────────────────────── -->
    <FecSection title="FecDrawerForm — 新建 / 编辑 / 校验 / cancel">
      <FecStack direction="horizontal" gap="sm">
        <FeButton @click="openDrawer('create')">
          抽屉新建
        </FeButton>
        <FeButton @click="openDrawer('edit')">
          抽屉编辑
        </FeButton>
      </FecStack>
    </FecSection>

    <!-- ── FecDetail ──────────────────────────────────────────────── -->
    <FecSection title="FecDetail — formatter / 空值 / 列数">
      <FecDetail
        :record="detailRecord"
        :schema="detailSchema"
        :columns="2"
      />
    </FecSection>

    <!-- ── FecStack ───────────────────────────────────────────────── -->
    <FecSection title="FecStack — 方向 / 间距组合">
      <FecStack direction="vertical" gap="md">
        <div style="background:#f0f4ff;padding:8px;border-radius:4px">
          <strong>vertical + md</strong>
          <FecStack direction="horizontal" gap="xs">
            <span class="feclab-chip">xs</span>
            <span class="feclab-chip">间距</span>
            <span class="feclab-chip">演示</span>
          </FecStack>
        </div>
        <div style="background:#f0fff4;padding:8px;border-radius:4px">
          <strong>horizontal + lg</strong>
          <FecStack direction="horizontal" gap="lg">
            <span class="feclab-chip">大</span>
            <span class="feclab-chip">间距</span>
          </FecStack>
        </div>
      </FecStack>
    </FecSection>
  </FecPage>

  <!-- ── 浮层组件（在 FecPage 之外渲染）─────────────────────────── -->

  <FecDialogForm
    v-model:model-value="dialogVisible"
    v-model:model="dialogModel"
    :title="dialogMode === 'create' ? '新建用户' : '编辑用户'"
    :schema="dialogSchema"
    :rules="dialogRules"
    confirm-text="保存"
    @confirm="handleDialogConfirm"
    @cancel="dialogVisible = false"
  />

  <FecDrawerForm
    v-model:model-value="drawerVisible"
    v-model:model="drawerModel"
    title="用户表单（抽屉）"
    :schema="dialogSchema"
    :rules="dialogRules"
    @confirm="handleDrawerConfirm"
    @cancel="drawerVisible = false"
  />
</template>

<style scoped>
.feclab-value {
  font-size: 12px;
  color: #666;
  font-family: monospace;
}
.feclab-chip {
  display: inline-block;
  padding: 2px 8px;
  background: #e8f0fe;
  border-radius: 12px;
  font-size: 12px;
}
</style>
