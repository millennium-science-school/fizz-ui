import type {
  AllowedComponentProps,
  Component,
  ComponentCustomProps,
  ComponentPublicInstance,
  DefineComponent,
  Ref,
  VNodeProps,
} from 'vue'
import { defineComponent, h, ref } from 'vue'
import { FIZZ_WRAPPER_CLASS_PREFIX } from '../namespace'

type TransparentWrapperBaseProps
  = & VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps
    & Record<`on${string}`, unknown>

export type TransparentWrapperComponent<Props extends object = Record<string, unknown>>
  = DefineComponent<Partial<Props> & TransparentWrapperBaseProps>

function getWrappedInstanceRecord(
  wrappedRef: Ref<ComponentPublicInstance | null>,
): Record<PropertyKey, unknown> | null {
  return wrappedRef.value as Record<PropertyKey, unknown> | null
}

function createExposeProxy(wrappedRef: Ref<ComponentPublicInstance | null>) {
  return new Proxy({}, {
    get(_, key) {
      return getWrappedInstanceRecord(wrappedRef)?.[key]
    },
    has(_, key) {
      const target = getWrappedInstanceRecord(wrappedRef)
      return target === null ? false : key in target
    },
    set(_, key, value) {
      const target = getWrappedInstanceRecord(wrappedRef)
      if (target === null)
        return false

      target[key] = value
      return true
    },
  })
}

export function createTransparentWrapper<Props extends object = Record<string, unknown>>(
  name: string,
  component: Component,
  fizzClassSuffix: string,
): TransparentWrapperComponent<Props> {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, expose, slots }) {
      const wrappedRef = ref<ComponentPublicInstance | null>(null)
      expose(createExposeProxy(wrappedRef))

      return () =>
        h(
          component,
          {
            ...attrs,
            ref: wrappedRef,
            class: [`${FIZZ_WRAPPER_CLASS_PREFIX}-${fizzClassSuffix}`, attrs.class],
          },
          slots,
        )
    },
  }) as unknown as TransparentWrapperComponent<Props>
}
