import type {
  ElMessageBoxOptions,
  LoadingInstance,
  LoadingOptions,
  MessageHandler,
  MessageOptions,
  NotificationHandle,
  NotificationOptions,
} from 'element-plus'
import type {
  FeLoadingInstance,
  FeLoadingOptions,
  FeMessageBoxOptions,
  FeMessageHandler,
  FeMessageOptions,
  FeNotificationHandle,
  FeNotificationOptions,
} from '../src'
import {
  ClickOutside,
  ElInfiniteScroll,
  ElLoading,
  ElLoadingDirective,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElPopoverDirective,
  ElPopper,
  ElPopperArrow,
  Mousewheel,
  TrapFocus,
  vLoading,
  vRepeatClick,
} from 'element-plus'
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest'
import { nextTick } from 'vue'
import * as FizzEl from '../src'
import { transparentWrappers } from './transparentWrapperList'

describe('@fizz/el-plus runtime exports', () => {
  afterEach(() => {
    FizzEl.FeMessage.closeAll()
    FizzEl.FeNotification.closeAll()
    FizzEl.FeMessageBox.close()
    document.body.innerHTML = ''
  })

  it('wraps Element Plus services so fizz classes can target service DOM', () => {
    expect(FizzEl.FeMessage).not.toBe(ElMessage)
    expect(FizzEl.FeNotification).not.toBe(ElNotification)
    expect(FizzEl.FeMessageBox).not.toBe(ElMessageBox)
  })

  it('does not expose Element Plus service installers', () => {
    expect('install' in FizzEl.FeMessage).toBe(false)
    expect('install' in FizzEl.FeNotification).toBe(false)
    expect('install' in FizzEl.FeMessageBox).toBe(false)
    expect('install' in FizzEl.FeLoadingService).toBe(false)
  })

  it('aliases Element Plus directives without app-level registration', () => {
    expect(FizzEl.vFeLoading).toBe(vLoading)
    expect(FizzEl.FeLoadingDirective).toBe(ElLoadingDirective)
    expect(FizzEl.FeClickOutside).toBe(ClickOutside)
    expect(FizzEl.vFeRepeatClick).toBe(vRepeatClick)
    expect(FizzEl.FeTrapFocus).toBe(TrapFocus)
    expect(FizzEl.FeMousewheel).toBe(Mousewheel)
    expect(FizzEl.FePopoverDirective).toBe(ElPopoverDirective)
    expect(FizzEl.FeInfiniteScroll).toBe(ElInfiniteScroll)
    expect(FizzEl.vFeInfiniteScroll).toBe(ElInfiniteScroll)
  })

  it('exports transparent component wrappers', () => {
    for (const { name } of transparentWrappers) {
      const wrapper = FizzEl[name as keyof typeof FizzEl] as { name?: string } | undefined

      expect(wrapper?.name).toBe(name)
    }
  })

  it('exports compatibility aliases for Element Plus primitives that cannot receive a fizz class', () => {
    expect(FizzEl.FeLoading).toBe(ElLoading)
    expect(FizzEl.FePopper).toBe(ElPopper)
    expect(FizzEl.FePopperArrow).toBe(ElPopperArrow)
  })

  it('adds a fizz class to FeMessage while preserving consumer classes', async () => {
    const handler = FizzEl.FeMessage({
      customClass: 'consumer-message',
      duration: 0,
      message: 'Saved',
    })

    await nextTick()

    const message = document.querySelector('.fe-message')
    expect(message).not.toBeNull()
    expect(message?.classList.contains('consumer-message')).toBe(true)

    handler.close()
  })

  it('adds a fizz class to typed FeMessage shortcuts', async () => {
    const handler = FizzEl.FeMessage.success({
      duration: 0,
      message: 'Saved',
    })

    await nextTick()

    expect(document.querySelector('.fe-message')).not.toBeNull()

    handler.close()
  })

  it('adds a fizz class to FeMessageBox alert when options are passed as the second argument', async () => {
    void FizzEl.FeMessageBox
      .alert('Saved', {
        customClass: 'consumer-message-box',
      })
      .catch(() => undefined)

    await nextTick()

    const messageBox = document.querySelector('.fe-message-box')
    expect(messageBox).not.toBeNull()
    expect(messageBox?.classList.contains('consumer-message-box')).toBe(true)

    FizzEl.FeMessageBox.close()
  })

  it('adds a fizz class to FeMessageBox alert when title and options are passed', async () => {
    void FizzEl.FeMessageBox
      .alert('Saved', 'Notice', {
        customClass: 'consumer-message-box-title',
      })
      .catch(() => undefined)

    await nextTick()

    const messageBox = document.querySelector('.fe-message-box')
    expect(messageBox).not.toBeNull()
    expect(messageBox?.classList.contains('consumer-message-box-title')).toBe(true)

    FizzEl.FeMessageBox.close()
  })

  it('adds a fizz class to FeLoadingService while preserving consumer classes', async () => {
    const loading = FizzEl.FeLoadingService({
      customClass: 'consumer-loading',
      target: document.body,
    })

    await nextTick()

    const mask = document.querySelector('.fe-loading')
    expect(mask).not.toBeNull()
    expect(mask?.classList.contains('consumer-loading')).toBe(true)

    loading.close()
  })

  it('re-exports minimal service types', () => {
    expectTypeOf<FeMessageOptions>().toEqualTypeOf<MessageOptions>()
    expectTypeOf<FeMessageHandler>().toEqualTypeOf<MessageHandler>()
    expectTypeOf<FeMessageBoxOptions>().toEqualTypeOf<ElMessageBoxOptions>()
    expectTypeOf<FeNotificationOptions>().toEqualTypeOf<NotificationOptions>()
    expectTypeOf<FeNotificationHandle>().toEqualTypeOf<NotificationHandle>()
    expectTypeOf<FeLoadingOptions>().toEqualTypeOf<LoadingOptions>()
    expectTypeOf<FeLoadingInstance>().toEqualTypeOf<LoadingInstance>()
  })
})
