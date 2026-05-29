<script setup lang="ts">
import {
  defineFecDetailSchema,
  defineFecQuerySchema,
  FecDetail,
  FecDetailSections,
  FecPage,
  FecQueryForm,
  FecSplitPane,
  FecTreePanel,
} from '@fizz/el-comps'
import { ref } from 'vue'

interface ResourceNode {
  id: string
  label: string
  type: string
  children?: ResourceNode[]
}

interface Query {
  keyword: string
  status: string[]
  period: string[]
}

interface ResourceDetail {
  name: string
  type: string
  status: string
  owner: string
}

const tree = ref<ResourceNode[]>([
  {
    id: 'network',
    label: 'Network',
    type: 'group',
    children: [
      { id: 'router-1', label: 'Router 1', type: 'device' },
      { id: 'switch-1', label: 'Switch 1', type: 'device' },
    ],
  },
  {
    id: 'service',
    label: 'Service',
    type: 'group',
    children: [
      { id: 'vpn-1', label: 'VPN 1', type: 'service' },
    ],
  },
])

const query = ref<Query>({ keyword: '', period: [], status: [] })
const selected = ref<ResourceDetail>({
  name: 'Router 1',
  owner: 'Network Team',
  status: 'Online',
  type: 'Device',
})
const treeCollapsed = ref(false)
const leftSize = ref<string | number>(280)

const querySchema = defineFecQuerySchema<Query>([
  { prop: 'keyword', label: 'Keyword', kind: 'input' },
  {
    prop: 'status',
    label: 'Status',
    kind: 'multiSelect',
    options: [
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
    ],
  },
  { prop: 'period', label: 'Period', kind: 'dateRange' },
])

const detailSchema = defineFecDetailSchema<ResourceDetail>([
  { prop: 'name', label: 'Name' },
  { prop: 'type', label: 'Type' },
  { prop: 'status', label: 'Status' },
  { prop: 'owner', label: 'Owner' },
])

const sections = [
  { key: 'basic', title: 'Basic Information' },
  { key: 'resource', title: 'Resource Information' },
]

function handleNodeClick(node: ResourceNode) {
  selected.value = {
    name: node.label,
    owner: node.type === 'service' ? 'Service Team' : 'Network Team',
    status: 'Online',
    type: node.type,
  }
}
</script>

<template>
  <FecPage title="Resource Layout" description="Tree-driven resource management layout">
    <FecQueryForm
      v-model:model="query"
      :schema="querySchema"
      submit-text="Search"
      reset-text="Reset"
    />

    <FecSplitPane
      v-model:left-size="leftSize"
      class="resource-layout-demo__split"
      :left-min="220"
      left-max="50%"
      left-collapsible
    >
      <template #left>
        <FecTreePanel
          v-model:collapsed="treeCollapsed"
          :data="tree"
          node-key="id"
          searchable
          collapsible
          @node-click="handleNodeClick"
        />
      </template>

      <FecDetailSections :sections="sections" nav>
        <template #basic>
          <FecDetail :record="selected" :schema="detailSchema" :columns="2" />
        </template>
        <template #resource>
          <FecDetail :record="selected" :schema="detailSchema" :columns="2" />
        </template>
      </FecDetailSections>
    </FecSplitPane>
  </FecPage>
</template>
