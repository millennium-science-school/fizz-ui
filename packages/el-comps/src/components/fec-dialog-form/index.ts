import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecDialogFormProps } from './props'
import FecDialogFormImpl from './FecDialogForm.vue'

export const FecDialogForm = FecDialogFormImpl as unknown as new <T extends object = any>() => {
  $props: FecDialogFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:modelValue'?: (...args: any[]) => void
    'onUpdate:model'?: (...args: any[]) => void
    'onConfirm'?: (...args: any[]) => void
    'onCancel'?: (...args: any[]) => void
  }
}

export type { FecDialogFormProps } from './props'
export default FecDialogFormImpl
