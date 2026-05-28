import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDetailProps } from './props'
import FecDetailImpl from './FecDetail.vue'

export const FecDetail = FecDetailImpl as unknown as new <T extends object = any>() => {
  $props: FecDetailProps<T> & VNodeProps & AllowedComponentProps
}

export {
  defineFecDetailSchema,
} from './props'
export type {
  FecDetailProps,
  FecDetailSchemaItem,
  FecLooseDetailSchemaItem,
} from './props'
export default FecDetailImpl
