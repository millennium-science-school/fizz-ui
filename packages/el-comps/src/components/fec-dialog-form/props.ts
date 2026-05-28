import type { FecFormProps } from '../fec-form/props'

export interface FecDialogFormProps<T extends object> extends FecFormProps<T> {
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
}
