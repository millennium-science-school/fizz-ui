import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  isReadonly,
  isRef,
  shallowRef,
} from 'vue'

export type QueryFormModel = Record<string, unknown>

export interface QueryFormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  trigger?: string | string[]
  validator?: (value: unknown, model: QueryFormModel) => boolean | string | Promise<boolean | string>
}

export type QueryFormRules<T extends QueryFormModel> = Partial<
  Record<Extract<keyof T, string>, QueryFormRule[]>
>

export interface UseQueryFormOptions<T extends QueryFormModel> {
  model: MaybeRefOrGetter<T>
  rules?: MaybeRefOrGetter<QueryFormRules<T>>
  initialModel?: T
  onSubmit?: (model: T) => void
}

export interface QueryFormState<T extends QueryFormModel> {
  model: Ref<T>
  rules: Ref<QueryFormRules<T>>
  setModel: (model: T) => void
  setField: <K extends Extract<keyof T, string>>(field: K, value: T[K]) => void
  setRules: (rules: QueryFormRules<T>) => void
  reset: () => void
  submit: () => void
}

interface StateSource<T> {
  ref: Ref<T>
  set: (value: T) => void
}

function cloneModel<T extends QueryFormModel>(model: T): T {
  return { ...model }
}

function createModelSource<T extends QueryFormModel>(
  source: MaybeRefOrGetter<T>,
): StateSource<T> {
  return createStateSource('model', source)
}

function createStateSource<T>(
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

export function useQueryForm<T extends QueryFormModel>(
  options: UseQueryFormOptions<T>,
): QueryFormState<T> {
  const model = createModelSource(options.model)
  const rules = createStateSource<QueryFormRules<T>>('rules', options.rules ?? {})
  const initialModel = cloneModel(options.initialModel ?? model.ref.value)

  function setModel(value: T) {
    model.set(value)
  }

  function setField<K extends Extract<keyof T, string>>(field: K, value: T[K]) {
    setModel({
      ...model.ref.value,
      [field]: value,
    })
  }

  function setRules(value: QueryFormRules<T>) {
    rules.set(value)
  }

  function reset() {
    setModel(cloneModel(initialModel))
  }

  function submit() {
    options.onSubmit?.(cloneModel(model.ref.value))
  }

  return {
    model: model.ref,
    reset,
    rules: rules.ref,
    setField,
    setModel,
    setRules,
    submit,
  }
}
