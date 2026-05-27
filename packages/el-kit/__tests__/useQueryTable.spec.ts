import type { QueryTableResult } from '../src'
import { describe, expect, it, vi } from 'vitest'
import { defineTableColumns, useQueryTable } from '../src'

interface User {
  name: string
  age: number
}

interface Query {
  keyword: string
}

const columns = defineTableColumns<User>([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', align: 'right' },
])

describe('useQueryTable', () => {
  it('creates query, table, and pagination state without fetchList', async () => {
    const state = useQueryTable<User, Query>({
      columns,
      query: { keyword: '' },
    })

    expect(state.query.model.value).toEqual({ keyword: '' })
    expect(state.table.columns.value).toHaveLength(2)
    expect(state.table.data.value).toEqual([])
    expect(state.pagination.currentPage.value).toBe(1)

    await state.refresh()

    expect(state.table.data.value).toEqual([])
    expect(state.loading.value).toBe(false)
  })

  it('fetches list data and updates table plus pagination', async () => {
    const fetchList = vi.fn(async (request: { query: Query, currentPage: number, pageSize: number }) => ({
      data: [{ name: request.query.keyword || 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
    })

    state.query.setField('keyword', 'Jerry')
    await state.submit()

    expect(fetchList).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: 'Jerry' },
    })
    expect(state.table.data.value).toEqual([{ name: 'Jerry', age: 18 }])
    expect(state.pagination.total.value).toBe(1)
    expect(state.loading.value).toBe(false)
  })

  it('resets query and page before fetching again', async () => {
    const fetchList = vi.fn(async () => ({
      data: [{ name: 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
    })

    state.query.setField('keyword', 'changed')
    state.pagination.setPage(5)

    await state.reset()

    expect(state.query.model.value).toEqual({ keyword: '' })
    expect(state.pagination.currentPage.value).toBe(1)
    expect(fetchList).toHaveBeenLastCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: '' },
    })
  })

  it('runs immediate fetch when requested', async () => {
    const fetchList = vi.fn(async () => ({
      data: [{ name: 'Tom', age: 18 }],
      total: 1,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      immediate: true,
      query: { keyword: '' },
    })

    await state.pending

    expect(fetchList).toHaveBeenCalledTimes(1)
    expect(state.table.data.value).toEqual([{ name: 'Tom', age: 18 }])
  })

  it('table.loading and loading are the same ref', () => {
    const state = useQueryTable<User, Query>({
      columns,
      query: { keyword: '' },
    })

    expect(state.table.loading).toBe(state.loading)
  })

  it('setPage changes current page and refreshes', async () => {
    const fetchList = vi.fn(async (req: { query: Query, currentPage: number, pageSize: number }) => ({
      data: [{ name: 'Tom', age: req.currentPage }],
      total: 100,
    }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
      pageSize: 10,
    })

    await state.setPage(3)

    expect(state.pagination.currentPage.value).toBe(3)
    expect(fetchList).toHaveBeenCalledWith({
      currentPage: 3,
      pageSize: 10,
      query: { keyword: '' },
    })
    expect(state.table.data.value[0].age).toBe(3)
  })

  it('ignores stale responses when a newer request supersedes them', async () => {
    let resolve1!: (v: QueryTableResult<User>) => void
    let resolve2!: (v: QueryTableResult<User>) => void

    const fetchList = vi.fn()
      .mockReturnValueOnce(new Promise<QueryTableResult<User>>((res) => { resolve1 = res }))
      .mockReturnValueOnce(new Promise<QueryTableResult<User>>((res) => { resolve2 = res }))

    const state = useQueryTable<User, Query>({
      columns,
      fetchList,
      query: { keyword: '' },
    })

    // Start two requests without awaiting the first
    const p1 = state.refresh()
    const p2 = state.refresh()

    // Request 2 completes first (faster response)
    resolve2({ data: [{ name: 'Request2', age: 2 }], total: 2 })
    await p2

    // Request 1 resolves late (stale)
    resolve1({ data: [{ name: 'Request1', age: 1 }], total: 1 })
    await p1

    // Only request 2's data should be visible
    expect(state.table.data.value[0]?.name).toBe('Request2')
    expect(state.pagination.total.value).toBe(2)
    expect(state.loading.value).toBe(false)
  })
})
