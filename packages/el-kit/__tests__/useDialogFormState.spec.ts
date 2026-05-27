import { describe, expect, it } from 'vitest'
import { useDialogFormState } from '../src'

interface User {
  id: number
  name: string
  age: number
}

interface UserForm {
  name: string
  age: number
}

describe('useDialogFormState', () => {
  it('opens create mode with a fresh model', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })

    form.openCreate()

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('create')
    expect(form.model.value).toEqual({ name: '', age: 0 })
    expect(form.editingRecord.value).toBeUndefined()
  })

  it('opens edit mode with mapped record data', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })
    const record = { id: 1, name: 'Tom', age: 18 }

    form.openEdit(record)

    expect(form.visible.value).toBe(true)
    expect(form.mode.value).toBe('edit')
    expect(form.editingRecord.value).toBe(record)
    expect(form.model.value).toEqual({ name: 'Tom', age: 18 })
  })

  it('resets and closes without clearing the current editing record unexpectedly', () => {
    const form = useDialogFormState<UserForm, User>({
      createModel: () => ({ name: '', age: 0 }),
      toFormModel: user => ({ name: user.name, age: user.age }),
    })

    form.openEdit({ id: 1, name: 'Tom', age: 18 })
    form.setModel({ name: 'Changed', age: 20 })
    form.reset()

    expect(form.model.value).toEqual({ name: 'Tom', age: 18 })

    form.close()
    expect(form.visible.value).toBe(false)
  })
})
