import type { Ref } from 'vue'
import { shallowRef } from 'vue'

export type DialogFormMode = 'create' | 'edit'

export interface UseDialogFormStateOptions<Form extends object, Row extends object = Form> {
  createModel: () => Form
  toFormModel?: (record: Row) => Form
  clone?: (model: Form) => Form
}

export interface DialogFormState<Form extends object, Row extends object = Form> {
  visible: Ref<boolean>
  mode: Ref<DialogFormMode>
  model: Ref<Form>
  editingRecord: Ref<Row | undefined>
  openCreate: (initial?: Partial<Form>) => void
  openEdit: (record: Row, model?: Partial<Form>) => void
  close: () => void
  reset: () => void
  setModel: (model: Form) => void
}

export function useDialogFormState<Form extends object, Row extends object = Form>(
  options: UseDialogFormStateOptions<Form, Row>,
): DialogFormState<Form, Row> {
  const cloneModel: (m: Form) => Form = options.clone ?? (m => ({ ...m }))
  const visible = shallowRef(false)
  const mode = shallowRef<DialogFormMode>('create')
  const model = shallowRef(options.createModel()) as Ref<Form>
  const editingRecord = shallowRef<Row>() as Ref<Row | undefined>
  let resetModel = cloneModel(model.value)

  function setModel(value: Form) {
    model.value = value
  }

  function openCreate(initial: Partial<Form> = {}) {
    const nextModel = {
      ...options.createModel(),
      ...initial,
    }
    mode.value = 'create'
    editingRecord.value = undefined
    resetModel = cloneModel(nextModel)
    model.value = nextModel
    visible.value = true
  }

  function openEdit(record: Row, partialModel: Partial<Form> = {}) {
    const baseModel = options.toFormModel
      ? options.toFormModel(record)
      : (record as unknown as Form)
    const nextModel = {
      ...baseModel,
      ...partialModel,
    }
    mode.value = 'edit'
    editingRecord.value = record
    resetModel = cloneModel(nextModel)
    model.value = nextModel
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function reset() {
    model.value = cloneModel(resetModel)
  }

  return {
    close,
    editingRecord,
    mode,
    model,
    openCreate,
    openEdit,
    reset,
    setModel,
    visible,
  }
}
