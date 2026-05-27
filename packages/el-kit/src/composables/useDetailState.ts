import type { Ref } from 'vue'
import { shallowRef } from 'vue'

export interface DetailState<Row extends object> {
  visible: Ref<boolean>
  record: Ref<Row | undefined>
  open: (record: Row) => void
  close: () => void
  clear: () => void
}

export function useDetailState<Row extends object>(): DetailState<Row> {
  const visible = shallowRef(false)
  const record = shallowRef<Row>() as Ref<Row | undefined>

  function open(value: Row) {
    record.value = value
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function clear() {
    record.value = undefined
    visible.value = false
  }

  return {
    clear,
    close,
    open,
    record,
    visible,
  }
}
