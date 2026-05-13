<script setup lang="ts">
import { FecQueryTable, FecTable } from '@fizz/el-comps'
import { useQueryForm, useTable } from '@fizz/el-kit'
import {
  FeAlert,
  FeAvatar,
  FeBadge,
  FeBreadcrumb,
  FeBreadcrumbItem,
  FeButton,
  FeButtonGroup,
  FeCard,
  FeCheckbox,
  FeCheckboxGroup,
  FeCol,
  FeDialog,
  FeDivider,
  FeEmpty,
  FeForm,
  FeFormItem,
  FeIcon,
  FeInput,
  FeLink,
  FeLoadingService,
  FeMessage,
  FeOption,
  FeProgress,
  FeRadio,
  FeRadioGroup,
  FeRow,
  FeSelect,
  FeSpace,
  FeSwitch,
  FeTable,
  FeTableColumn,
  FeTabPane,
  FeTabs,
  FeTag,
  FeText,
} from '@fizz/el-plus'
import { ref, shallowRef } from 'vue'

interface User {
  name: string
  age: number
}

const data = shallowRef<User[]>([
  { name: 'Tom', age: 18 },
  { name: 'Jerry', age: 20 },
])

const table = useTable<User>({
  columns: [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
  ],
  data,
})

const form = ref({
  name: '',
})

const queryForm = useQueryForm({
  model: ref({
    keyword: '',
  }),
  rules: {
    keyword: [{ min: 2, message: '至少两个字符' }],
  },
})

const formSchema = [
  { prop: 'name', label: '姓名', component: 'ElInput' },
] as const

const querySchema = [
  { prop: 'keyword', label: '关键词', component: 'ElInput' },
] as const

const currentPage = ref(1)
const keyword = ref('Fizz UI')
const city = ref('shanghai')
const enabled = ref(true)
const permissions = ref(['read'])
const mode = ref('day')
const activeTab = ref('overview')
const dialogVisible = ref(false)

function resetQuery() {
  queryForm.reset()
}

function submitQuery() {
  FeMessage.success(`查询：${queryForm.model.value.keyword || '全部'}`)
}

function showMessage() {
  FeMessage.success('fe-message')
}

function showLoading() {
  const loading = FeLoadingService({
    text: 'fe-loading',
  })

  window.setTimeout(() => loading.close(), 800)
}
</script>

<template>
  <div class="min-h-screen bg-[var(--fe-bg-color-page)] p-6 text-[var(--fe-text-color-primary)]">
    <header class="mb-6">
      <h1 class="text-2xl font-bold">
        @fizz UI 验收台
      </h1>
      <p class="mt-2 text-sm text-[var(--fe-text-color-regular)]">
        @fizz/el-plus 覆盖面、@fizz/theme 核心变量和消费侧接入验证。
      </p>
    </header>

    <section class="mb-6 grid gap-4 md:grid-cols-4">
      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            覆盖面
          </div>
        </template>
        <div class="text-2xl font-semibold">
          122
        </div>
        <div class="mt-1 text-sm text-[var(--fe-text-color-regular)]">
          Element Plus El* 导出
        </div>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            透明包装
          </div>
        </template>
        <div class="text-2xl font-semibold">
          111
        </div>
        <div class="mt-1 text-sm text-[var(--fe-text-color-regular)]">
          注入稳定 fe-* 扩展类
        </div>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            特殊导出
          </div>
        </template>
        <div class="text-2xl font-semibold">
          8
        </div>
        <div class="mt-1 text-sm text-[var(--fe-text-color-regular)]">
          namespace、服务和指令别名
        </div>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            兼容别名
          </div>
        </template>
        <div class="text-2xl font-semibold">
          3
        </div>
        <div class="mt-1 text-sm text-[var(--fe-text-color-regular)]">
          只做 API 对齐，不注入 class
        </div>
      </FeCard>
    </section>

    <section class="mb-6 grid gap-4 md:grid-cols-2">
      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            主题变量
          </div>
        </template>

        <div class="grid gap-3 text-sm">
          <div class="flex items-center justify-between rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] p-3">
            <span>--fe-color-primary</span>
            <span class="h-5 w-10 rounded bg-[var(--fe-color-primary)]" />
          </div>
          <div class="flex items-center justify-between rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] p-3">
            <span>--fe-fizz-control-radius</span>
            <span class="rounded-[var(--fe-fizz-control-radius)] border border-[var(--fe-border-color)] px-3 py-1">control</span>
          </div>
          <div class="flex items-center justify-between rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] p-3">
            <span>--fe-fizz-surface-shadow</span>
            <span class="rounded-[var(--fe-fizz-surface-radius)] bg-[var(--fe-bg-color)] px-3 py-1 shadow-[var(--fe-fizz-surface-shadow)]">surface</span>
          </div>
        </div>
      </FeCard>

      <FeCard shadow="hover">
        <template #header>
          <div class="font-semibold">
            Runtime namespace
          </div>
        </template>

        <div class="text-sm leading-6">
          <div>FeConfigProvider namespace: fe</div>
          <div>Expected DOM classes: fe-input, fe-select, fe-card</div>
          <div>Style entries: @fizz/el-plus/styles + @fizz/theme/styles</div>
        </div>
      </FeCard>
    </section>

    <section class="mb-6 grid gap-4 md:grid-cols-2">
      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            表单控件
          </div>
        </template>

        <FeForm label-width="72px">
          <FeFormItem label="关键词">
            <FeInput v-model="keyword" placeholder="FeInput" />
          </FeFormItem>

          <FeFormItem label="城市">
            <FeSelect v-model="city" placeholder="FeSelect">
              <FeOption label="上海" value="shanghai" />
              <FeOption label="杭州" value="hangzhou" />
              <FeOption label="深圳" value="shenzhen" />
            </FeSelect>
          </FeFormItem>

          <FeFormItem label="开关">
            <FeSwitch v-model="enabled" />
          </FeFormItem>

          <FeFormItem label="权限">
            <FeCheckboxGroup v-model="permissions">
              <FeCheckbox value="read">
                读取
              </FeCheckbox>
              <FeCheckbox value="write">
                写入
              </FeCheckbox>
            </FeCheckboxGroup>
          </FeFormItem>

          <FeFormItem label="模式">
            <FeRadioGroup v-model="mode">
              <FeRadio value="day">
                白天
              </FeRadio>
              <FeRadio value="night">
                夜晚
              </FeRadio>
            </FeRadioGroup>
          </FeFormItem>
        </FeForm>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            反馈组件
          </div>
        </template>

        <div class="grid gap-3">
          <FeAlert
            title="theme styles 已接入"
            type="success"
            :closable="false"
          />

          <FeSpace wrap>
            <FeButton type="primary" @click="showMessage">
              FeMessage
            </FeButton>
            <FeButton @click="showLoading">
              FeLoading
            </FeButton>
            <FeButton @click="dialogVisible = true">
              FeDialog
            </FeButton>
          </FeSpace>

          <div class="flex flex-wrap gap-2">
            <FeTag type="success">
              FeTag
            </FeTag>
            <FeTag type="info">
              {{ enabled ? 'Enabled' : 'Disabled' }}
            </FeTag>
            <FeTag>
              {{ permissions.join(', ') || 'none' }}
            </FeTag>
          </div>
        </div>
      </FeCard>
    </section>

    <section class="mb-6 grid gap-4 md:grid-cols-2">
      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            数据展示
          </div>
        </template>

        <FeTabs v-model="activeTab">
          <FeTabPane label="概览" name="overview">
            <FeSpace wrap>
              <FeBadge :value="3">
                <FeAvatar>
                  FE
                </FeAvatar>
              </FeBadge>
              <FeDivider direction="vertical" />
              <FeTag type="success">
                FeSpace
              </FeTag>
            </FeSpace>
          </FeTabPane>

          <FeTabPane label="进度" name="progress">
            <div class="grid gap-3 pt-2">
              <FeProgress :percentage="70" />
              <FeProgress :percentage="45" status="warning" />
            </div>
          </FeTabPane>
        </FeTabs>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            Table
          </div>
        </template>

        <FeTable :data="data" size="small">
          <FeTableColumn prop="name" label="姓名" />
          <FeTableColumn prop="age" label="年龄" />
        </FeTable>
      </FeCard>
    </section>

    <section class="mb-6 grid gap-4 md:grid-cols-2">
      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            基础组件
          </div>
        </template>

        <div class="grid gap-4">
          <FeBreadcrumb separator="/">
            <FeBreadcrumbItem>首页</FeBreadcrumbItem>
            <FeBreadcrumbItem>组件</FeBreadcrumbItem>
            <FeBreadcrumbItem>基础</FeBreadcrumbItem>
          </FeBreadcrumb>

          <FeSpace wrap>
            <FeButtonGroup>
              <FeButton>上一步</FeButton>
              <FeButton type="primary">
                下一步
              </FeButton>
            </FeButtonGroup>

            <FeLink type="primary">
              FeLink
            </FeLink>

            <FeText type="success">
              FeText
            </FeText>

            <FeIcon>
              i
            </FeIcon>
          </FeSpace>
        </div>
      </FeCard>

      <FeCard shadow="never">
        <template #header>
          <div class="font-semibold">
            Layout wrappers
          </div>
        </template>

        <FeRow :gutter="12">
          <FeCol :span="12">
            <div class="rounded-[var(--fe-border-radius-base)] bg-[var(--fe-color-primary-light-9)] p-3 text-sm">
              FeCol 12
            </div>
          </FeCol>
          <FeCol :span="12">
            <div class="rounded-[var(--fe-border-radius-base)] bg-[var(--fe-color-primary-light-9)] p-3 text-sm">
              FeCol 12
            </div>
          </FeCol>
        </FeRow>
      </FeCard>
    </section>

    <section class="mb-6 rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] bg-[var(--fe-bg-color)] p-4">
      <h2 class="mb-3 text-base font-semibold">
        useTable&lt;T&gt;
      </h2>
      <pre class="text-sm">{{ table.columns.value.map(column => column.prop).join(', ') }}</pre>
    </section>

    <section class="mb-6 rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] bg-[var(--fe-bg-color)] p-4">
      <h2 class="mb-3 text-base font-semibold">
        FecQueryTable
      </h2>
      <FecQueryTable
        v-model:query="queryForm.model"
        :query-schema="querySchema"
        :rules="queryForm.rules"
        :columns="table.columns.value"
        :data="table.data"
        :loading="table.loading"
        :pagination="table.pagination"
        @reset="resetQuery"
        @submit="submitQuery"
        @update:current-page="table.setPage"
        @update:page-size="table.setPageSize"
      />
    </section>

    <section class="rounded-[var(--fe-fizz-surface-radius)] border border-[var(--fe-border-color)] bg-[var(--fe-bg-color)] p-4">
      <h2 class="mb-3 text-base font-semibold">
        组合组件
      </h2>
      <FecTable
        v-model:form="form"
        :form-schema="formSchema"
        :columns="table.columns.value"
        :data="data"
        :pagination="{ currentPage, total: data.length, pageSize: 10 }"
      />
    </section>

    <FeDialog v-model="dialogVisible" title="FeDialog" width="420px">
      <FeEmpty description="反馈组件验收" />
    </FeDialog>
  </div>
</template>
