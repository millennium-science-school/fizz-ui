import { ElPopper } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import {
  FeAlert,
  FeAvatar,
  FeBadge,
  FeBreadcrumb,
  FeBreadcrumbItem,
  FeButton,
  FeButtonGroup,
  FeCard,
  FeCheckbox,
  FeCheckboxGroup,
  FeCol,
  FeCollapseTransition,
  FeConfigProvider,
  FeDivider,
  FeEmpty,
  FeForm,
  FeFormItem,
  FeIcon,
  FeInput,
  FeLink,
  FeOption,
  FeOverlay,
  FePopperContent,
  FePopperTrigger,
  FeProgress,
  FeRadio,
  FeRadioGroup,
  FeRow,
  FeSelect,
  FeSpace,
  FeSwitch,
  FeTabPane,
  FeTabs,
  FeTag,
  FeText,
} from '../src'

describe('transparent wrappers', () => {
  it('wraps input without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(FeInput, {
            class: 'consumer-input',
            placeholder: '请输入',
            modelValue: 'Fizz',
          })),
    })

    app.mount(host)
    await nextTick()

    const inputRoot = host.querySelector('.fe-input')
    const input = host.querySelector('input')
    expect(inputRoot?.classList.contains('consumer-input')).toBe(true)
    expect(host.querySelector('.el-input')).toBeNull()
    expect(input?.getAttribute('placeholder')).toBe('请输入')
    expect((input as HTMLInputElement | null)?.value).toBe('Fizz')

    app.unmount()
    host.remove()
  })

  it('exposes wrapped Element Plus instance methods through refs', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const inputRef = ref<{ focus: () => void, blur: () => void } | null>(null)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(FeInput, {
            ref: inputRef,
            modelValue: '',
          })),
    })

    app.mount(host)
    await nextTick()

    expect(typeof inputRef.value?.focus).toBe('function')
    expect(typeof inputRef.value?.blur).toBe('function')

    inputRef.value?.focus()
    await nextTick()
    expect(document.activeElement).toBe(host.querySelector('input'))

    inputRef.value?.blur()

    app.unmount()
    host.remove()
  })

  it('forwards data and aria attrs once through the wrapped component', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(FeInput, {
            'aria-label': 'Keyword',
            'data-testid': 'keyword-input',
            'modelValue': '',
          })),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelectorAll('[data-testid="keyword-input"]')).toHaveLength(1)
    expect(host.querySelectorAll('[aria-label="Keyword"]')).toHaveLength(1)

    app.unmount()
    host.remove()
  })

  it('wraps select and option while preserving option slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeSelect,
            {
              class: 'consumer-select',
              modelValue: 'shanghai',
            },
            () => [
              h(
                FeOption,
                {
                  label: '上海',
                  value: 'shanghai',
                },
                () => '上海',
              ),
            ],
          )),
    })

    app.mount(host)
    await nextTick()

    const selectRoot = host.querySelector('.fe-select')
    expect(selectRoot?.classList.contains('consumer-select')).toBe(true)
    expect(host.querySelector('.el-select')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps card without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeCard,
            {
              class: 'consumer-card',
              shadow: 'never',
            },
            {
              header: () => '卡片标题',
              default: () => '卡片内容',
            },
          )),
    })

    app.mount(host)
    await nextTick()

    const card = host.querySelector('.fe-card')
    expect(card?.classList.contains('consumer-card')).toBe(true)
    expect(host.querySelector('.el-card')).toBeNull()
    expect(card?.textContent).toContain('卡片标题')
    expect(card?.textContent).toContain('卡片内容')

    app.unmount()
    host.remove()
  })

  it('wraps form and form item without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeForm,
            {
              class: 'consumer-form',
              labelWidth: '80px',
              model: { name: 'Fizz' },
            },
            () =>
              h(
                FeFormItem,
                {
                  class: 'consumer-form-item',
                  label: '名称',
                  prop: 'name',
                },
                () => h(FeInput, { modelValue: 'Fizz' }),
              ),
          )),
    })

    app.mount(host)
    await nextTick()

    const form = host.querySelector('.fe-form')
    const formItem = host.querySelector('.fe-form-item')
    expect(form?.classList.contains('consumer-form')).toBe(true)
    expect(formItem?.classList.contains('consumer-form-item')).toBe(true)
    expect(host.querySelector('.el-form')).toBeNull()
    expect(host.querySelector('.el-form-item')).toBeNull()
    expect(form?.textContent).toContain('名称')

    app.unmount()
    host.remove()
  })

  it('wraps choice controls and switch without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h('div', [
            h(
              FeCheckboxGroup,
              {
                class: 'consumer-checkbox-group',
                modelValue: ['read'],
              },
              () => [
                h(FeCheckbox, { value: 'read' }, () => '读取'),
                h(FeCheckbox, { value: 'write' }, () => '写入'),
              ],
            ),
            h(
              FeRadioGroup,
              {
                class: 'consumer-radio-group',
                modelValue: 'day',
              },
              () => [
                h(FeRadio, { value: 'day' }, () => '白天'),
                h(FeRadio, { value: 'night' }, () => '夜晚'),
              ],
            ),
            h(FeSwitch, {
              class: 'consumer-switch',
              modelValue: true,
            }),
          ])),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-checkbox-group')?.classList.contains('consumer-checkbox-group')).toBe(true)
    expect(host.querySelector('.fe-checkbox')?.textContent).toContain('读取')
    expect(host.querySelector('.fe-radio-group')?.classList.contains('consumer-radio-group')).toBe(true)
    expect(host.querySelector('.fe-radio')?.textContent).toContain('白天')
    expect(host.querySelector('.fe-switch')?.classList.contains('consumer-switch')).toBe(true)
    expect(host.querySelector('.el-checkbox-group')).toBeNull()
    expect(host.querySelector('.el-radio-group')).toBeNull()
    expect(host.querySelector('.el-switch')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps tag and alert without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h('div', [
            h(
              FeTag,
              {
                class: 'consumer-tag',
                type: 'success',
              },
              () => 'Stable',
            ),
            h(FeAlert, {
              class: 'consumer-alert',
              title: '命名空间已接管',
              type: 'success',
              closable: false,
            }),
          ])),
    })

    app.mount(host)
    await nextTick()

    const tag = host.querySelector('.fe-tag')
    const alert = host.querySelector('.fe-alert')
    expect(tag?.classList.contains('consumer-tag')).toBe(true)
    expect(tag?.textContent).toContain('Stable')
    expect(alert?.classList.contains('consumer-alert')).toBe(true)
    expect(alert?.textContent).toContain('命名空间已接管')
    expect(host.querySelector('.el-tag')).toBeNull()
    expect(host.querySelector('.el-alert')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps tabs and tab panes without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeTabs,
            {
              class: 'consumer-tabs',
              modelValue: 'overview',
            },
            () => [
              h(FeTabPane, { label: '概览', name: 'overview' }, () => '概览内容'),
              h(FeTabPane, { label: '详情', name: 'detail' }, () => '详情内容'),
            ],
          )),
    })

    app.mount(host)
    await nextTick()

    const tabs = host.querySelector('.fe-tabs')
    const pane = host.querySelector('.fe-tab-pane')
    expect(tabs?.classList.contains('consumer-tabs')).toBe(true)
    expect(pane?.textContent).toContain('概览内容')
    expect(host.querySelector('.el-tabs')).toBeNull()
    expect(host.querySelector('.el-tab-pane')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps space divider badge and avatar without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeSpace,
            {
              class: 'consumer-space',
            },
            () => [
              h(FeBadge, { class: 'consumer-badge', value: 3 }, () =>
                h(FeAvatar, { class: 'consumer-avatar' }, () => 'FE')),
              h(FeDivider, { class: 'consumer-divider', direction: 'vertical' }),
              h(FeTag, null, () => 'Display'),
            ],
          )),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-space')?.classList.contains('consumer-space')).toBe(true)
    expect(host.querySelector('.fe-badge')?.classList.contains('consumer-badge')).toBe(true)
    expect(host.querySelector('.fe-avatar')?.classList.contains('consumer-avatar')).toBe(true)
    expect(host.querySelector('.fe-divider')?.classList.contains('consumer-divider')).toBe(true)
    expect(host.querySelector('.fe-avatar')?.textContent).toContain('FE')
    expect(host.querySelector('.el-space')).toBeNull()
    expect(host.querySelector('.el-badge')).toBeNull()
    expect(host.querySelector('.el-avatar')).toBeNull()
    expect(host.querySelector('.el-divider')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps progress and empty without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h('div', [
            h(FeProgress, {
              class: 'consumer-progress',
              percentage: 70,
            }),
            h(
              FeEmpty,
              {
                class: 'consumer-empty',
                description: '暂无数据',
              },
              {
                default: () => h(FeButton, null, () => '刷新'),
              },
            ),
          ])),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-progress')?.classList.contains('consumer-progress')).toBe(true)
    expect(host.querySelector('.fe-empty')?.classList.contains('consumer-empty')).toBe(true)
    expect(host.querySelector('.fe-empty')?.textContent).toContain('暂无数据')
    expect(host.querySelector('.fe-empty')?.textContent).toContain('刷新')
    expect(host.querySelector('.el-progress')).toBeNull()
    expect(host.querySelector('.el-empty')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps row col link text icon and button group without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeRow,
            {
              class: 'consumer-row',
              gutter: 12,
            },
            () => [
              h(
                FeCol,
                {
                  class: 'consumer-col',
                  span: 12,
                },
                () =>
                  h(
                    FeButtonGroup,
                    {
                      class: 'consumer-button-group',
                    },
                    () => [
                      h(FeButton, null, () => 'A'),
                      h(FeButton, null, () => 'B'),
                    ],
                  ),
              ),
              h(
                FeCol,
                {
                  span: 12,
                },
                () => [
                  h(FeLink, { class: 'consumer-link', type: 'primary' }, () => '链接'),
                  h(FeText, { class: 'consumer-text', type: 'success' }, () => '文本'),
                  h(FeIcon, { class: 'consumer-icon' }, () => 'i'),
                ],
              ),
            ],
          )),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-row')?.classList.contains('consumer-row')).toBe(true)
    expect(host.querySelector('.fe-col')?.classList.contains('consumer-col')).toBe(true)
    expect(host.querySelector('.fe-button-group')?.classList.contains('consumer-button-group')).toBe(true)
    expect(host.querySelector('.fe-link')?.classList.contains('consumer-link')).toBe(true)
    expect(host.querySelector('.fe-text')?.classList.contains('consumer-text')).toBe(true)
    expect(host.querySelector('.fe-icon')?.classList.contains('consumer-icon')).toBe(true)
    expect(host.querySelector('.fe-link')?.textContent).toContain('链接')
    expect(host.querySelector('.fe-text')?.textContent).toContain('文本')
    expect(host.querySelector('.el-row')).toBeNull()
    expect(host.querySelector('.el-col')).toBeNull()
    expect(host.querySelector('.el-button-group')).toBeNull()
    expect(host.querySelector('.el-link')).toBeNull()
    expect(host.querySelector('.el-text')).toBeNull()
    expect(host.querySelector('.el-icon')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps breadcrumb and breadcrumb item without hiding attrs or slots', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(
            FeBreadcrumb,
            {
              class: 'consumer-breadcrumb',
              separator: '/',
            },
            () => [
              h(FeBreadcrumbItem, { class: 'consumer-breadcrumb-item' }, () => '首页'),
              h(FeBreadcrumbItem, null, () => '组件'),
            ],
          )),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-breadcrumb')?.classList.contains('consumer-breadcrumb')).toBe(true)
    expect(host.querySelector('.fe-breadcrumb__item')?.classList.contains('consumer-breadcrumb-item')).toBe(true)
    expect(host.querySelector('.fe-breadcrumb')?.textContent).toContain('首页')
    expect(host.querySelector('.fe-breadcrumb')?.textContent).toContain('组件')
    expect(host.querySelector('.el-breadcrumb')).toBeNull()
    expect(host.querySelector('.el-breadcrumb__item')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps collapse transition and overlay with effective DOM classes', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () => [
          h(
            FeCollapseTransition,
            { class: 'consumer-collapse-transition' },
            () => h('div', '过渡内容'),
          ),
          h(
            FeOverlay,
            { class: 'consumer-overlay' },
            () => h('span', '遮罩内容'),
          ),
        ]),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-collapse-transition')?.classList.contains('consumer-collapse-transition')).toBe(true)
    expect(host.querySelector('.fe-collapse-transition')?.textContent).toContain('过渡内容')
    expect(host.querySelector('.fe-overlay')?.classList.contains('consumer-overlay')).toBe(true)
    expect(host.querySelector('.fe-overlay')?.textContent).toContain('遮罩内容')
    expect(host.querySelector('.el-overlay')).toBeNull()

    app.unmount()
    host.remove()
  })

  it('wraps popper trigger and content inside a popper provider', async () => {
    const host = document.createElement('div')
    document.body.append(host)

    const app = createApp({
      render: () =>
        h(FeConfigProvider, null, () =>
          h(ElPopper, null, () => [
            h(
              FePopperTrigger,
              { class: 'consumer-popper-trigger' },
              () => h('button', '触发'),
            ),
            h(
              FePopperContent,
              {
                class: 'consumer-popper-content',
                visible: true,
              },
              () => '弹层',
            ),
          ])),
    })

    app.mount(host)
    await nextTick()

    expect(host.querySelector('.fe-popper-trigger')?.classList.contains('consumer-popper-trigger')).toBe(true)
    expect(host.querySelector('.fe-popper-content')?.classList.contains('consumer-popper-content')).toBe(true)
    expect(host.querySelector('.fe-popper-trigger')?.textContent).toContain('触发')
    expect(host.querySelector('.fe-popper-content')?.textContent).toContain('弹层')

    app.unmount()
    host.remove()
  })
})
