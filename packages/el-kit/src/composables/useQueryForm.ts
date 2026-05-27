import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'
import { useQueryState } from './useQueryState'

export type QueryFormModel = object

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

function cloneModel<T extends QueryFormModel>(model: T): T {
  return { ...model }
}

export function useQueryForm<T extends QueryFormModel>(
  options: UseQueryFormOptions<T>,
): QueryFormState<T> {
  const query = useQueryState({
    initialModel: options.initialModel,
    model: options.model,
  })
  const rules = createStateSource<QueryFormRules<T>>('rules', options.rules ?? {})

  function setRules(value: QueryFormRules<T>) {
    rules.set(value)
  }

  function submit() {
    options.onSubmit?.(cloneModel(query.model.value))
  }

  return {
    model: query.model,
    reset: query.reset,
    rules: rules.ref,
    setField: query.setField,
    setModel: query.setModel,
    setRules,
    submit,
  }
}
