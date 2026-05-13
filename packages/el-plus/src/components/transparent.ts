import type {
  AllowedComponentProps,
  Component,
  ComponentCustomProps,
  DefineComponent,
  VNodeProps,
} from 'vue'
import { defineComponent, h } from 'vue'
import { FIZZ_WRAPPER_CLASS_PREFIX } from '../namespace'

type TransparentWrapperBaseProps
  = & VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps
    & Record<`on${string}`, unknown>

export type TransparentWrapperComponent<Props extends object = Record<string, unknown>>
  = DefineComponent<Partial<Props> & TransparentWrapperBaseProps>

export function createTransparentWrapper<Props extends object = Record<string, unknown>>(
  name: string,
  component: Component,
  fizzClassSuffix: string,
): TransparentWrapperComponent<Props> {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () =>
        h(
          component,
          {
            ...attrs,
            class: [`${FIZZ_WRAPPER_CLASS_PREFIX}-${fizzClassSuffix}`, attrs.class],
          },
          slots,
        )
    },
  }) as unknown as TransparentWrapperComponent<Props>
}
