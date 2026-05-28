import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecFormProps } from './props'
import FecFormImpl from './FecForm.vue'

export const FecForm = FecFormImpl as unknown as new <T extends object = any>() => {
  $props: FecFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
  }
}

export type { FecFormProps } from './props'
export default FecFormImpl
