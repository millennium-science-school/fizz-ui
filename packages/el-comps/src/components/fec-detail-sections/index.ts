import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDetailSectionsProps } from './props'
import FecDetailSectionsImpl from './FecDetailSections.vue'

export const FecDetailSections = FecDetailSectionsImpl as unknown as new () => {
  $props: FecDetailSectionsProps & VNodeProps & AllowedComponentProps
}

export type { FecDetailSectionItem, FecDetailSectionsProps } from './props'
export default FecDetailSectionsImpl
