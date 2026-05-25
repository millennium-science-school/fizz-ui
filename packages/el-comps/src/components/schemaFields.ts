import type { VNodeChild } from 'vue'
import type { FecControl } from './controls'
import { FeFormItem } from '@fizz/el-plus'
import { h } from 'vue'
import { resolveFecControl } from './controls'

export interface FecSchemaFieldItem {
  prop: string
  label: string
  component: FecControl
}

export interface RenderSchemaFieldsOptions {
  schema: FecSchemaFieldItem[]
  model: Record<string, unknown>
  includeProp?: boolean
  onUpdateField: (prop: string, value: unknown) => void
}

export function renderSchemaFields(options: RenderSchemaFieldsOptions): VNodeChild[] {
  return options.schema.map((item, index) => {
    const resolvedControl = resolveFecControl(item.component)
    const FormControl = resolvedControl.component
    const formItemProps = options.includeProp
      ? { label: item.label, prop: item.prop }
      : { label: item.label }

    return h(
      FeFormItem,
      {
        key: `${item.prop}-${index}`,
        ...formItemProps,
      },
      () =>
        h(FormControl, {
          ...resolvedControl.props,
          'modelValue': options.model[item.prop],
          'onUpdate:modelValue': (value: unknown) => {
            options.onUpdateField(item.prop, value)
          },
        }),
    )
  })
}
