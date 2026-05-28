import type { AllowedComponentProps, VNodeProps } from 'vue'
import type { FecQueryFormProps } from './props'
import FecQueryFormImpl from './FecQueryForm.vue'

export const FecQueryForm = FecQueryFormImpl as unknown as new <T extends object = any>() => {
  $props: FecQueryFormProps<T> & VNodeProps & AllowedComponentProps & {
    'onUpdate:model'?: (...args: any[]) => void
    'onSubmit'?: (...args: any[]) => void
    'onReset'?: (...args: any[]) => void
  }
}

export type { FecQueryFormProps } from './props'
export default FecQueryFormImpl
