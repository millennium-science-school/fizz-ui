import type { FieldControlKind, FieldOption } from '@fizz/el-kit'
import type { Component, VNodeChild } from 'vue'
import { FeFormItem, FeOption } from '@fizz/el-plus'
import { h } from 'vue'
import { resolveFecControl } from './controls'

export interface FecSchemaFieldBase {
  prop: string
  label: string
  fieldProps?: Record<string, unknown>
}

export interface FecBuiltinSchemaFieldItem extends FecSchemaFieldBase {
  kind: FieldControlKind
  options?: FieldOption[]
}

export interface FecCustomSchemaFieldItem extends FecSchemaFieldBase {
  component: Component
}

export type FecSchemaFieldItem
  = | FecBuiltinSchemaFieldItem
    | FecCustomSchemaFieldItem

export interface RenderSchemaFieldsOptions {
  schema: FecSchemaFieldItem[]
  model: Record<string, unknown>
  includeProp?: boolean
  onUpdateField: (prop: string, value: unknown) => void
}

function isCustomSchemaField(item: FecSchemaFieldItem): item is FecCustomSchemaFieldItem {
  return 'component' in item
}

function renderFieldOptions(item: FecSchemaFieldItem): VNodeChild[] | undefined {
  if (isCustomSchemaField(item) || item.kind !== 'select') {
    return undefined
  }

  return item.options?.map((option, idx) =>
    h(FeOption, {
      key: idx,
      disabled: option.disabled,
      label: option.label,
      value: option.value as string | number | boolean | Record<string, unknown>,
    }),
  )
}

export function renderSchemaFields(options: RenderSchemaFieldsOptions): VNodeChild[] {
  return options.schema.map((item, index) => {
    const resolvedControl = resolveFecControl(
      isCustomSchemaField(item) ? item.component : item.kind,
    )
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
        h(
          FormControl,
          {
            ...resolvedControl.props,
            ...item.fieldProps,
            'modelValue': options.model[item.prop],
            'onUpdate:modelValue': (value: unknown) => {
              options.onUpdateField(item.prop, value)
            },
          },
          () => renderFieldOptions(item),
        ),
    )
  })
}
