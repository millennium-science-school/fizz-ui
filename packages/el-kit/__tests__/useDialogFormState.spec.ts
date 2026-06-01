import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { useDialogFormState } from '../src'

interface User {
  id: number
  name: string
  tags: string[]
}

interface UserForm {
  name: string
  tags: string[]
}

describe('useDialogFormState', () => {
  it('opens create mode with a fresh model', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: user.tags }),
    })

    form.openCreate()

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('create')
    expect(form.model.value).toEqual({ name: '', tags: [] })
    expect(form.editingRecord.value).toBeUndefined()
  })

  it('opens edit mode with mapped record data', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: user.tags }),
    })
    const record = { id: 1, name: 'Tom', tags: ['admin'] }

    form.openEdit(record)

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('edit')
    expect(form.editingRecord.value).toBe(record)
    expect(form.model.value).toEqual({ name: 'Tom', tags: ['admin'] })
  })

  it('resets and closes without clearing the current editing record unexpectedly', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: user.tags }),
    })

    form.openEdit({ id: 1, name: 'Tom', tags: ['admin'] })
    form.setModel({ name: 'Changed', tags: ['user'] })
    form.reset()

    expect(form.model.value).toEqual({ name: 'Tom', tags: ['admin'] })

    form.close()
    expect(form.visible.value).toBe(false)
  })

  it('accepts a reactive record in openEdit without DataCloneError (proxy safety)', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: [...user.tags] }),
    })
    const record = reactive({ id: 1, name: 'Tom', tags: ['admin'] })

    expect(() => form.openEdit(record)).not.toThrow()
    expect(form.model.value).toEqual({ name: 'Tom', tags: ['admin'] })
  })

  it('resets correctly after setModel replaces model (default shallow clone)', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: user.tags }),
    })

    form.openEdit({ id: 1, name: 'Tom', tags: ['admin'] })
    // Replace whole model — does NOT mutate the resetModel snapshot's arrays
    form.setModel({ name: 'Changed', tags: ['user', 'extra'] })
    form.reset()

    expect(form.model.value.name).toBe('Tom')
    expect(form.model.value.tags).toEqual(['admin'])
  })

  it('deep-clones array fields when clone option is provided', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', tags: [] }),
      toFormModel: user => ({ name: user.name, tags: user.tags }),
      clone: m => ({ ...m, tags: [...m.tags] }),
    })

    form.openEdit({ id: 1, name: 'Tom', tags: ['admin'] })
    form.model.value.tags.push('extra')
    form.reset()

    expect(form.model.value.tags).toEqual(['admin'])
  })
})
