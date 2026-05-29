import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecSplitPaneProps } from './props'
import FecSplitPaneImpl from './FecSplitPane.vue'

export const FecSplitPane = FecSplitPaneImpl as unknown as new () => {
  $props: FecSplitPaneProps & VNodeProps & AllowedComponentProps & {
    'onUpdate:leftSize'?: (...args: any[]) => void
    'onResizeStart'?: (...args: any[]) => void
    'onResize'?: (...args: any[]) => void
    'onResizeEnd'?: (...args: any[]) => void
    'onCollapse'?: (...args: any[]) => void
  }
}

export type {
  FecSplitPaneCollapseType,
  FecSplitPaneLayout,
  FecSplitPaneProps,
  FecSplitPaneSize,
  FecSplitPaneSizes,
} from './props'
export default FecSplitPaneImpl
