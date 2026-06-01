<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecTreePanelNodeProps } from './props'
import { FeButton, FeEmpty, FeInput, FeTree, vFeLoading } from '@fizz/el-plus'
import { watchDebounced } from '@vueuse/core'
import { ref } from 'vue'

type TreeNodeRecord = Record<string, unknown>

interface FilterableTreeInstance {
  filter: (value: string) => void
}

defineOptions({
  name: 'FecTreePanel',
})

const treePanelProps = defineProps({
  data: {
    type: Array as PropType<readonly TreeNodeRecord[]>,
    required: true,
  },
  nodeKey: {
    type: String,
    default: 'id',
  },
  props: {
    type: Object as PropType<FecTreePanelNodeProps>,
    default: () => ({ label: 'label', children: 'children', disabled: 'disabled', isLeaf: 'isLeaf' }),
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: '搜索',
  },
  filterDebounce: {
    type: Number,
    default: 120,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '暂无数据',
  },
})

const emit = defineEmits(['update:collapsed', 'nodeClick'])
const keyword = ref('')
const treeRef = ref<FilterableTreeInstance>()

watchDebounced(
  keyword,
  value => treeRef.value?.filter(value),
  { debounce: () => treePanelProps.filterDebounce },
)

function filterNode(value: string, data: TreeNodeRecord) {
  if (!value)
    return true

  const labelKey = treePanelProps.props.label ?? 'label'
  return String(data[labelKey] ?? '').toLowerCase().includes(value.toLowerCase())
}

function emitNodeClick(
  node: TreeNodeRecord,
  treeNode: unknown,
  component: unknown,
  event: Event,
) {
  emit('nodeClick', node, treeNode, component, event)
}
</script>

<template>
  <aside
    class="fe-comps-tree-panel"
    :class="collapsed ? 'fe-comps-tree-panel--collapsed' : undefined"
  >
    <div
      v-if="searchable || collapsible"
      class="fe-comps-tree-panel__header"
    >
      <FeInput
        v-if="searchable"
        v-model="keyword"
        class="fe-comps-tree-panel__search"
        :placeholder="searchPlaceholder"
      />
      <FeButton
        v-if="collapsible"
        class="fe-comps-tree-panel__collapse"
        @click="emit('update:collapsed', !collapsed)"
      >
        {{ collapsed ? '展开' : '收起' }}
      </FeButton>
    </div>

    <div
      v-if="!collapsed"
      v-fe-loading="loading"
    >
      <FeTree
        v-if="data.length"
        ref="treeRef"
        class="fe-comps-tree-panel__tree"
        :data="data"
        :filter-node-method="filterNode"
        :node-key="nodeKey"
        :props="props"
        @node-click="emitNodeClick"
      >
        <slot />
      </FeTree>
      <FeEmpty
        v-else
        class="fe-comps-tree-panel__empty"
        :description="emptyText"
      />
    </div>
  </aside>
</template>
