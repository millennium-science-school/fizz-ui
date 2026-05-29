export interface FecTreePanelNodeProps {
  label?: string
  children?: string
  disabled?: string
  isLeaf?: string
}

export interface FecTreePanelProps<Node extends object> {
  data: readonly Node[]
  nodeKey?: string
  props?: FecTreePanelNodeProps
  searchable?: boolean
  searchPlaceholder?: string
  filterDebounce?: number
  collapsible?: boolean
  collapsed?: boolean
  loading?: boolean
  emptyText?: string
}
