import { describe, expect, it } from 'vitest'
import { computed, shallowRef } from 'vue'
import { usePaginationState } from '../src'

describe('usePaginationState', () => {
  it('creates writable internal pagination state from defaults', () => {
    const pagination = usePaginationState()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.pageSize.value).toBe(10)
    expect(pagination.total.value).toBe(0)

    pagination.setPage(3)
    pagination.setPageSize(20)
    pagination.setTotal(55)

    expect(pagination.currentPage.value).toBe(3)
    expect(pagination.pageSize.value).toBe(20)
    expect(pagination.total.value).toBe(55)

    pagination.resetPage()
    expect(pagination.currentPage.value).toBe(1)
  })

  it('keeps external refs as the single state source', () => {
    const currentPage = shallowRef(2)
    const pageSize = shallowRef(15)
    const total = shallowRef(41)

    const pagination = usePaginationState({
      currentPage,
      pageSize,
      total,
    })

    pagination.setPage(4)
    pagination.setPageSize(30)
    pagination.setTotal(90)

    expect(currentPage.value).toBe(4)
    expect(pageSize.value).toBe(30)
    expect(total.value).toBe(90)
  })

  it('throws when setters target readonly state sources', () => {
    const pagination = usePaginationState({
      currentPage: computed(() => 1),
      pageSize: computed(() => 10),
      total: computed(() => 0),
    })

    expect(() => pagination.setPage(2)).toThrow('pagination.currentPage is readonly')
    expect(() => pagination.setPageSize(20)).toThrow('pagination.pageSize is readonly')
    expect(() => pagination.setTotal(40)).toThrow('pagination.total is readonly')
  })
})
