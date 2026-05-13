import type { TableColumn } from '../src'
import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { useTable } from '../src'

interface User {
  name: string
  age: number
}

describe('useTable', () => {
  it('keeps typed columns and reactive data in a headless table state', () => {
    const data = shallowRef<User[]>([{ name: 'Tom', age: 18 }])
    const columns: TableColumn<User>[] = [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄' },
    ]

    const table = useTable<User>({
      columns,
      data,
    })

    expect(table.columns.value).toHaveLength(2)
    expect(table.columns.value[0]?.prop).toBe('name')
    expect(table.data.value[0]?.age).toBe(18)
  })

  it('keeps external refs as the single state source', () => {
    const columns = shallowRef<TableColumn<User>[]>([
      { prop: 'name', label: '姓名' },
    ])
    const data = shallowRef<User[]>([{ name: 'Tom', age: 18 }])
    const loading = shallowRef(false)

    const table = useTable<User>({
      columns,
      data,
      loading,
      pagination: {
        currentPage: shallowRef(1),
        pageSize: shallowRef(10),
        total: shallowRef(1),
      },
    })

    columns.value = [{ prop: 'age', label: '年龄' }]
    data.value = [{ name: 'Jerry', age: 20 }]
    loading.value = true

    expect(table.columns.value[0]?.prop).toBe('age')
    expect(table.data.value[0]?.name).toBe('Jerry')
    expect(table.loading.value).toBe(true)

    table.setColumns([{ prop: 'name', label: '姓名' }])
    table.setData([{ name: 'Ann', age: 22 }])
    table.setLoading(false)
    table.setPage(2)
    table.setPageSize(20)
    table.setTotal(30)

    expect(columns.value[0]?.prop).toBe('name')
    expect(data.value[0]?.name).toBe('Ann')
    expect(loading.value).toBe(false)
    expect(table.pagination.currentPage.value).toBe(2)
    expect(table.pagination.pageSize.value).toBe(20)
    expect(table.pagination.total.value).toBe(30)
  })

  it('creates internal refs for plain values', () => {
    const table = useTable<User>({
      columns: [{ prop: 'name', label: '姓名' }],
      data: [{ name: 'Tom', age: 18 }],
    })

    table.setColumns([{ prop: 'age', label: '年龄' }])
    table.setData([{ name: 'Jerry', age: 20 }])
    table.setLoading(true)
    table.setPage(3)

    expect(table.columns.value[0]?.prop).toBe('age')
    expect(table.data.value[0]?.age).toBe(20)
    expect(table.loading.value).toBe(true)
    expect(table.pagination.currentPage.value).toBe(3)
    expect(table.pagination.pageSize.value).toBe(10)
    expect(table.pagination.total.value).toBe(0)
  })

  it('throws when setter targets a readonly state source', () => {
    const columns = computed<TableColumn<User>[]>(() => [{ prop: 'name', label: '姓名' }])
    const data = computed<User[]>(() => [{ name: 'Tom', age: 18 }])

    const table = useTable<User>({
      columns,
      data,
    })

    expect(table.columns.value[0]?.prop).toBe('name')
    expect(() => table.setColumns([{ prop: 'age', label: '年龄' }])).toThrow(
      'columns is readonly',
    )
    expect(() => table.setData([{ name: 'Jerry', age: 20 }])).toThrow(
      'data is readonly',
    )
  })
})
