import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  isReadonly,
  isRef,
  shallowRef,
} from 'vue'

export interface StateSource<T> {
  ref: Ref<T>
  set: (value: T) => void
}

export function createStateSource<T>(
  name: string,
  source: MaybeRefOrGetter<T>,
): StateSource<T> {
  const state = isRef(source)
    ? source
    : typeof source === 'function'
      ? computed(source as () => T)
      : shallowRef(source)

  return {
    ref: state as Ref<T>,
    set(value: T) {
      if (isReadonly(state)) {
        throw new Error(`${name} is readonly`)
      }

      const writableState = state as Ref<T>
      writableState.value = value
    },
  }
}
