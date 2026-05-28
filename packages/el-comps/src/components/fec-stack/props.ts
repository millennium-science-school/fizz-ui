export type FecStackDirection = 'vertical' | 'horizontal'
export type FecStackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg'

export interface FecStackProps {
  direction?: FecStackDirection
  gap?: FecStackGap
}
