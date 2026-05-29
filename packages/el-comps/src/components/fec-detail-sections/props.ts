export interface FecDetailSectionItem {
  key: string
  title: string
  description?: string
}

export interface FecDetailSectionsProps {
  sections: readonly FecDetailSectionItem[]
  nav?: boolean
}
