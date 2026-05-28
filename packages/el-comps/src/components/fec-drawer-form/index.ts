import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDrawerFormProps } from './props'
import FecDrawerFormImpl from './FecDrawerForm.vue'

export const FecDrawerForm = FecDrawerFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDrawerFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}

export type { FecDrawerFormProps } from './props'
export default FecDrawerFormImpl
