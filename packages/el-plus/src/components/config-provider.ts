import { ElConfigProvider } from 'element-plus'
import { defineComponent, h } from 'vue'
import { FIZZ_ELEMENT_NAMESPACE } from '../namespace'

export const FeConfigProvider = defineComponent({
  name: 'FeConfigProvider',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        ElConfigProvider,
        {
          ...attrs,
          namespace: FIZZ_ELEMENT_NAMESPACE,
        },
        slots,
      )
  },
})
