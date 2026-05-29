<script lang="ts">
import type { PropType } from 'vue'
import type { FecTreePanelNodeProps } from './props'
import { FeButton, FeEmpty, FeInput, FeTree, vFeLoading } from '@fizz/el-plus'
import { watchDebounced } from '@vueuse/core'
import { defineComponent, h, ref, withDirectives } from 'vue'

type TreeNodeRecord = Record<string, unknown>

export default defineComponent({
  name: 'FecTreePanel',
  props: {
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
  },
  emits: ['update:collapsed', 'nodeClick'],
  setup(props, { emit, slots }) {
    const keyword = ref('')
    const treeRef = ref<any>()

    watchDebounced(keyword, value => treeRef.value?.filter?.(value), { debounce: () => props.filterDebounce })

    function filterNode(value: string, data: TreeNodeRecord) {
      if (!value)
        return true

      const labelKey = props.props.label ?? 'label'
      return String(data[labelKey] ?? '').toLowerCase().includes(value.toLowerCase())
    }

    return () =>
      h('aside', {
        class: [
          'fe-comps-tree-panel',
          props.collapsed ? 'fe-comps-tree-panel--collapsed' : undefined,
        ],
      }, [
        props.searchable || props.collapsible
          ? h('div', { class: 'fe-comps-tree-panel__header' }, [
              props.searchable
                ? h(FeInput, {
                    'class': 'fe-comps-tree-panel__search',
                    'modelValue': keyword.value,
                    'placeholder': props.searchPlaceholder,
                    'onUpdate:modelValue': (value: string) => {
                      keyword.value = value
                    },
                  })
                : null,
              props.collapsible
                ? h(FeButton, {
                    class: 'fe-comps-tree-panel__collapse',
                    onClick: () => emit('update:collapsed', !props.collapsed),
                  }, () => props.collapsed ? '展开' : '收起')
                : null,
            ])
          : null,
        props.collapsed
          ? null
          : withDirectives(
              props.data.length
                ? h(FeTree, {
                    ref: treeRef,
                    class: 'fe-comps-tree-panel__tree',
                    data: props.data,
                    filterNodeMethod: filterNode,
                    nodeKey: props.nodeKey,
                    props: props.props,
                    onNodeClick: (node: TreeNodeRecord, treeNode: unknown, component: unknown, event: Event) =>
                      emit('nodeClick', node, treeNode, component, event),
                  }, slots)
                : h(FeEmpty, {
                    class: 'fe-comps-tree-panel__empty',
                    description: props.emptyText,
                  }),
              [[vFeLoading, props.loading]],
            ),
      ])
  },
})
</script>
