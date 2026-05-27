import type { MaybeRefOrGetter, Ref } from 'vue'
import { createStateSource } from './stateSource'

export type QueryStateModel = object

export interface UseQueryStateOptions<Query extends QueryStateModel> {
  model: MaybeRefOrGetter<Query>
  initialModel?: Query
}

export interface QueryState<Query extends QueryStateModel> {
  model: Ref<Query>
  initialModel: Query
  setModel: (model: Query) => void
  setField: <K extends Extract<keyof Query, string>>(field: K, value: Query[K]) => void
  reset: () => void
}

function cloneModel<Query extends QueryStateModel>(model: Query): Query {
  return { ...model }
}

export function useQueryState<Query extends QueryStateModel>(
  options: UseQueryStateOptions<Query>,
): QueryState<Query> {
  const model = createStateSource('model', options.model)
  const initialModel = cloneModel(options.initialModel ?? model.ref.value)

  function setModel(value: Query) {
    model.set(value)
  }

  function setField<K extends Extract<keyof Query, string>>(field: K, value: Query[K]) {
    setModel({
      ...model.ref.value,
      [field]: value,
    })
  }

  function reset() {
    setModel(cloneModel(initialModel))
  }

  return {
    initialModel,
    model: model.ref,
    reset,
    setField,
    setModel,
  }
}
