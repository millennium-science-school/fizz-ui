import type { VNode } from 'vue'
import { describe, expect, it } from 'vitest'
import { renderSchemaFields } from '../src/components/shared/schemaFields'

describe('schemaFields', () => {
  it('renders multi-select options through the select control', () => {
    const nodes = renderSchemaFields({
      model: { status: ['enabled'] },
      onUpdateField: () => {},
      schema: [
        {
          kind: 'multiSelect',
          label: '状态',
          options: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled', disabled: true },
          ],
          prop: 'status',
        },
      ],
    })

    expect(nodes).toHaveLength(1)
  })

  it('renders date range fields through the date picker control', () => {
    const nodes = renderSchemaFields({
      model: { createdAt: [] },
      onUpdateField: () => {},
      schema: [
        {
          kind: 'dateRange',
          label: '创建时间',
          prop: 'createdAt',
        },
      ],
    })

    expect(nodes).toHaveLength(1)
  })

  it('renders select options from headless field metadata', () => {
    const fields = renderSchemaFields({
      schema: [
        {
          prop: 'status',
          label: '状态',
          kind: 'select',
          options: [
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled', disabled: true },
          ],
        },
      ],
      model: { status: 'enabled' },
      onUpdateField: () => {},
    })

    const formItem = fields[0] as VNode
    const slots = formItem.children as { default: () => VNode }
    const control = slots.default()
    const controlSlots = control.children as { default: () => VNode[] | undefined }
    const options = controlSlots.default() ?? []

    expect(options.map(option => option.props?.label)).toEqual(['Enabled', 'Disabled'])
    expect(options.map(option => option.props?.value)).toEqual(['enabled', 'disabled'])
    expect(options[1]?.props?.disabled).toBe(true)
  })
})
