<script setup lang="ts">
import {
  defineFecDetailSchema,
  defineFecFormSchema,
  defineFecQuerySchema,
  defineFecTableColumns,
  FecDetail,
  FecForm,
  FecQueryTable,
} from '@fizz/el-comps'
import { defineComponent, h, ref } from 'vue'

const ColorInput = defineComponent({
  props: { modelValue: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

interface Row {
  name: string
  age: number
  status: string
}

interface Query {
  keyword: string
}

const formModel = ref({
  name: '',
  age: 0,
  status: '',
  flag: false,
  color: '#3b82f6',
})

const formSchema = defineFecFormSchema<typeof formModel.value>([
  { prop: 'name', label: '姓名', kind: 'input' },
  { prop: 'age', label: '年龄', kind: 'number' },
  { prop: 'status', label: '状态', kind: 'select', options: [{ label: '启用', value: 'enabled' }] },
  { prop: 'flag', label: '开关', kind: 'switch' },
  { prop: 'color', label: '颜色', component: ColorInput },
])

const query = ref<Query>({ keyword: '' })
const querySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: '关键词', kind: 'input' },
])

const columns = defineFecTableColumns<Row>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right' },
])

const rows = ref<Row[]>([
  { name: 'Tom', age: 18, status: 'enabled' },
])

const detailRecord = ref<Row>({ name: 'Tom', age: 18, status: 'enabled' })
const detailSchema = defineFecDetailSchema<Row>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', formatter: value => `${value} 岁` },
])
</script>

<template>
  <FecForm
    v-model:model="formModel"
    :schema="formSchema"
  />
  <FecQueryTable
    v-model:query="query"
    :query-schema="querySchema"
    :columns="columns"
    :data="rows"
  />
  <FecDetail
    :record="detailRecord"
    :schema="detailSchema"
  />
</template>
