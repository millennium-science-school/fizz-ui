<script lang="ts">
import type { PropType } from 'vue'
import type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './props'
import { FeSplitter, FeSplitterPanel } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecSplitPane',
  props: {
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
  },
  emits: ['update:leftSize', 'resizeStart', 'resize', 'resizeEnd', 'collapse'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        FeSplitter,
        {
          class: 'fe-comps-split-pane',
          layout: props.layout,
          lazy: props.lazy,
          onCollapse: (index: number, type: FecSplitPaneCollapseType, sizes: FecSplitPaneSizes) =>
            emit('collapse', index, type, sizes),
          onResize: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resize', index, sizes),
          onResizeEnd: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resizeEnd', index, sizes),
          onResizeStart: (index: number, sizes: FecSplitPaneSizes) =>
            emit('resizeStart', index, sizes),
        },
        () => [
          h(
            FeSplitterPanel,
            {
              'class': 'fe-comps-split-pane__left',
              'collapsible': props.leftCollapsible,
              'max': props.leftMax,
              'min': props.leftMin,
              'resizable': props.leftResizable,
              'size': props.leftSize,
              'onUpdate:size': (value: FecSplitPaneSize) => emit('update:leftSize', value),
            },
            slots.left,
          ),
          h(
            FeSplitterPanel,
            {
              class: 'fe-comps-split-pane__right',
              collapsible: props.rightCollapsible,
              max: props.rightMax,
              min: props.rightMin,
              resizable: props.rightResizable,
            },
            slots.default,
          ),
        ],
      )
  },
})
</script>
