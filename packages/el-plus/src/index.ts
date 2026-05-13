// @fizz/el-plus 入口
// 透明包装 Element Plus 组件。
//
// namespace 策略：
//   - 通过 Element Plus 官方 namespace 能力完全接管默认 el-* 前缀为 fe-*
//   - 根应用使用 FeConfigProvider 固定 runtime namespace
//   - 样式通过 @fizz/el-plus/styles 或 @fizz/el-plus/styles/scss 接入
//   - 包装层只补充少量稳定扩展类名，如 fe-btn、fe-input
//   - 业务侧和主题侧不应依赖 el-* 选择器
//   - 少数 Element Plus 底层对象没有可挂载 fe-* class 的稳定 DOM 节点，
//     这类导出只做 Fe* 兼容别名，不声明透明样式包装语义
//
// 导出规范：
//   - 纯透明 wrapper 集中维护在 ./components/transparent-components.ts
//   - 兼容别名集中维护在 ./compat.ts
//   - 有特殊逻辑的组件保留独立文件
//   - 公共组件从此处统一导出
//   - 同步重新导出 Element Plus 的类型，方便消费侧使用
//   - 包级样式入口通过 package.json exports 暴露：
//       @fizz/el-plus/styles      → 预编译 CSS
//       @fizz/el-plus/styles/scss → SCSS 源入口
//
// Implemented Element Plus wrapper export surface for directly wrapped components.
// ConfigProvider, services, directives, and internal infrastructure stay separate.
//
// Basic: FeButton, FeButtonGroup, FeLink, FeText, FeIcon
// Layout: FeRow, FeCol, FeContainer, FeHeader, FeAside, FeMain, FeFooter, FeDivider, FeSpace,
//         FeSplitter, FeSplitterPanel
// Form: FeForm, FeFormItem, FeInput, FeInputNumber, FeAutocomplete, FeSelect,
//       FeOption, FeOptionGroup, FeSelectV2, FeCascader, FeCascaderPanel,
//       FeCheckbox, FeCheckboxButton, FeCheckboxGroup, FeRadio, FeRadioButton,
//       FeRadioGroup, FeSwitch, FeSlider, FeTimePicker, FeTimeSelect,
//       FeDatePicker, FeUpload, FeRate, FeColorPicker, FeTransfer, FeMention,
//       FeInputTag
// Data: FeTable, FeTableColumn, FePagination, FeTag, FeCheckTag, FeBadge,
//       FeAvatar, FeAvatarGroup, FeCard, FeCarousel, FeCarouselItem, FeCollapse,
//       FeCollapseItem, FeDescriptions, FeDescriptionsItem, FeEmpty,
//       FeImage, FeImageViewer, FeProgress, FeResult, FeStatistic,
//       FeCountdown, FeSkeleton, FeSkeletonItem, FeTree, FeTreeSelect,
//       FeTreeV2, FeCalendar, FeSegmented, FeWatermark, FeScrollbar,
//       FeAutoResizer, FeTableV2
// Navigation: FeAffix, FeAnchor, FeAnchorLink, FeBacktop, FeBreadcrumb,
//             FeBreadcrumbItem, FeDropdown, FeDropdownItem, FeDropdownMenu,
//             FeMenu, FeMenuItem, FeMenuItemGroup, FeSubMenu, FePageHeader,
//             FeSteps, FeStep, FeTabs, FeTabPane, FeTimeline, FeTimelineItem
// Feedback: FeAlert, FeDialog, FeDrawer, FeLoadingService, FeMessage,
//           FeMessageBox, FeNotification, FePopconfirm, FePopover,
//           FeTooltip, FeTour, FeTourStep
// Directives: vFeLoading, vFeRepeatClick, FeClickOutside, FeTrapFocus,
//             FeMousewheel, FePopoverDirective, vFeInfiniteScroll,
//             FeInfiniteScroll
// Compatibility aliases without fe-* class injection: FeLoading, FePopper,
//             FePopperArrow

export * from './compat'
export { FeConfigProvider } from './components/config-provider'
export type { TransparentWrapperComponent } from './components/transparent'
export * from './components/transparent-components'
export * from './directives'
export {
  FIZZ_ELEMENT_NAMESPACE,
  FIZZ_WRAPPER_CLASS_PREFIX,
  fizzElementNamespaceConfig,
} from './namespace'
export * from './services'
