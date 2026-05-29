import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecTreePanelProps } from './props'
import FecTreePanelImpl from './FecTreePanel.vue'

export const FecTreePanel = FecTreePanelImpl as unknown as new <
  Node extends object = any,
>() => {
  $props: FecTreePanelProps<Node> & VNodeProps & AllowedComponentProps & {
    'onUpdate:collapsed'?: (...args: any[]) => void
    'onNodeClick'?: (...args: any[]) => void
  }
}

export type { FecTreePanelNodeProps, FecTreePanelProps } from './props'
export default FecTreePanelImpl
