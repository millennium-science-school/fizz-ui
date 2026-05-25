import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { renderSchemaFields } from '../src/components/schemaFields'

describe('schemaFields', () => {
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
