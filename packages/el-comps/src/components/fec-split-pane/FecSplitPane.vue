<script setup lang="ts">
import type { PropType } from 'vue'
import type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './props'
import { FeSplitter, FeSplitterPanel } from '@fizz/el-plus'

defineOptions({
  name: 'FecSplitPane',
})

const splitPaneProps = defineProps({
  layout: {
    type: String as PropType<FecSplitPaneLayout>,
    default: 'horizontal',
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  leftSize: {
    type: [String, Number] as PropType<FecSplitPaneSize>,
    default: undefined,
  },
  leftMin: {
    type: [String, Number] as PropType<FecSplitPaneSize>,
    default: undefined,
  },
  leftMax: {
    type: [String, Number] as PropType<FecSplitPaneSize>,
    default: undefined,
  },
  leftResizable: {
    type: Boolean,
    default: true,
  },
  leftCollapsible: {
    type: Boolean,
    default: false,
  },
  rightMin: {
    type: [String, Number] as PropType<FecSplitPaneSize>,
    default: undefined,
  },
  rightMax: {
    type: [String, Number] as PropType<FecSplitPaneSize>,
    default: undefined,
  },
  rightResizable: {
    type: Boolean,
    default: true,
  },
  rightCollapsible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:leftSize', 'resizeStart', 'resize', 'resizeEnd', 'collapse'])
</script>

<template>
  <FeSplitter
    class="fe-comps-split-pane"
    :layout="splitPaneProps.layout"
    :lazy="splitPaneProps.lazy"
    @collapse="(index: number, type: FecSplitPaneCollapseType, sizes: FecSplitPaneSizes) => emit('collapse', index, type, sizes)"
    @resize="(index: number, sizes: FecSplitPaneSizes) => emit('resize', index, sizes)"
    @resize-end="(index: number, sizes: FecSplitPaneSizes) => emit('resizeEnd', index, sizes)"
    @resize-start="(index: number, sizes: FecSplitPaneSizes) => emit('resizeStart', index, sizes)"
  >
    <FeSplitterPanel
      class="fe-comps-split-pane__left"
      :collapsible="splitPaneProps.leftCollapsible"
      :max="splitPaneProps.leftMax"
      :min="splitPaneProps.leftMin"
      :resizable="splitPaneProps.leftResizable"
      :size="splitPaneProps.leftSize"
      @update:size="(value: FecSplitPaneSize) => emit('update:leftSize', value)"
    >
      <slot name="left" />
    </FeSplitterPanel>
    <FeSplitterPanel
      class="fe-comps-split-pane__right"
      :collapsible="splitPaneProps.rightCollapsible"
      :max="splitPaneProps.rightMax"
      :min="splitPaneProps.rightMin"
      :resizable="splitPaneProps.rightResizable"
    >
      <slot />
    </FeSplitterPanel>
  </FeSplitter>
</template>
