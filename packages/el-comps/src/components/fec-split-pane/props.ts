export type FecSplitPaneLayout = 'horizontal' | 'vertical'
export type FecSplitPaneCollapseType = 'start' | 'end'
export type FecSplitPaneSize = string | number

export interface FecSplitPaneProps {
  layout?: FecSplitPaneLayout
  lazy?: boolean
  leftSize?: FecSplitPaneSize
  leftMin?: FecSplitPaneSize
  leftMax?: FecSplitPaneSize
  leftResizable?: boolean
  leftCollapsible?: boolean
  rightMin?: FecSplitPaneSize
  rightMax?: FecSplitPaneSize
  rightResizable?: boolean
  rightCollapsible?: boolean
}

export type FecSplitPaneSizes = FecSplitPaneSize[]
