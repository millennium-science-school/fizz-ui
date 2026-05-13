import type {
  AlertProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DialogProps,
  DrawerProps,
  ElTooltipProps,
  EmptyProps,
  FormItemProps,
  FormProps,
  InputNumberProps,
  InputProps,
  LinkProps,
  PaginationProps,
  PopconfirmProps,
  PopoverProps,
  ProgressProps,
  RadioButtonProps,
  RadioGroupProps,
  RadioProps,
  SelectProps,
  SwitchProps,
  TableProps,
  TabPaneProps,
  TabsProps,
  TagProps,
  TextProps,
  UploadProps,
} from 'element-plus'
import type { Component } from 'vue'
import type { TransparentWrapperComponent } from './transparent'
import {
  ElAffix,
  ElAlert,
  ElAnchor,
  ElAnchorLink,
  ElAside,
  ElAutocomplete,
  ElAutoResizer,
  ElAvatar,
  ElAvatarGroup,
  ElBacktop,
  ElBadge,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElButtonGroup,
  ElCalendar,
  ElCard,
  ElCarousel,
  ElCarouselItem,
  ElCascader,
  ElCascaderPanel,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCheckTag,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElColorPickerPanel,
  ElContainer,
  ElCountdown,
  ElDatePicker,
  ElDatePickerPanel,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDivider,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElImage,
  ElImageViewer,
  ElInput,
  ElInputNumber,
  ElInputTag,
  ElLink,
  ElMain,
  ElMention,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElOption,
  ElOptionGroup,
  ElOverlay,
  ElPageHeader,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElPopperContent,
  ElPopperTrigger,
  ElProgress,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElResult,
  ElRow,
  ElScrollbar,
  ElSegmented,
  ElSelect,
  ElSelectV2,
  ElSkeleton,
  ElSkeletonItem,
  ElSlider,
  ElSpace,
  ElSplitter,
  ElSplitterPanel,
  ElStatistic,
  ElStep,
  ElSteps,
  ElSubMenu,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElTableV2,
  ElTabPane,
  ElTabs,
  ElTag,
  ElText,
  ElTimeline,
  ElTimelineItem,
  ElTimePicker,
  ElTimeSelect,
  ElTooltip,
  ElTour,
  ElTourStep,
  ElTransfer,
  ElTree,
  ElTreeSelect,
  ElTreeV2,
  ElUpload,
  ElWatermark,
} from 'element-plus'
import { createTransparentWrapper } from './transparent'

function defineFeTransparentComponent<Props extends object>(
  name: string,
  component: Component,
  fizzClassSuffix: string,
): TransparentWrapperComponent<Props> {
  return createTransparentWrapper<Props>(name, component, fizzClassSuffix)
}

// Public type tiers:
// 1. Use Element Plus root-level public props when they produce stable dts.
// 2. Use small Fizz facades for high-value components without clean public props.
// 3. Leave the rest as wide transparent wrappers to avoid leaking internals.
export type FeAlertProps = AlertProps
export type FeBadgeProps = BadgeProps
export type FeButtonProps = ButtonProps
export type FeCardProps = CardProps
export type FeCheckboxProps = CheckboxProps
export type FeCheckboxGroupProps = CheckboxGroupProps
export type FeDatePickerProps = DatePickerProps
export type FeDialogProps = DialogProps
export type FeDrawerProps = DrawerProps
export type FeEmptyProps = EmptyProps
export type FeFormProps = FormProps
export type FeFormItemProps = FormItemProps
export type FeInputProps = InputProps
export type FeInputNumberProps = InputNumberProps
export type FeLinkProps = LinkProps
export type FePaginationProps = PaginationProps
export type FePopconfirmProps = PopconfirmProps
export type FePopoverProps = PopoverProps
export type FeProgressProps = ProgressProps
export type FeRadioButtonProps = RadioButtonProps
export type FeRadioProps = RadioProps
export type FeRadioGroupProps = RadioGroupProps
export type FeSelectProps = SelectProps
export type FeSwitchProps = SwitchProps
export type FeTabPaneProps = TabPaneProps
export type FeTagProps = TagProps
export type FeTableProps<Row extends Record<PropertyKey, any> = any> = TableProps<Row>
export type FeTabsProps = TabsProps
export type FeTextProps = TextProps
export type FeTooltipProps = ElTooltipProps
export type FeUploadProps = UploadProps

export interface FeTableColumnProps {
  prop?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right' | string
  headerAlign?: 'left' | 'center' | 'right' | string
  fixed?: boolean | 'left' | 'right' | string
  type?: string
  sortable?: boolean | 'custom' | string
}

export interface FeOptionProps {
  value?: string | number | boolean | Record<string, unknown>
  label?: string | number
  disabled?: boolean
}

export const FeAffix = /* @__PURE__ */ createTransparentWrapper('FeAffix', ElAffix, 'affix')
export const FeAlert = /* @__PURE__ */ defineFeTransparentComponent<FeAlertProps>('FeAlert', ElAlert, 'alert')
export const FeAnchor = /* @__PURE__ */ createTransparentWrapper('FeAnchor', ElAnchor, 'anchor')
export const FeAnchorLink = /* @__PURE__ */ createTransparentWrapper('FeAnchorLink', ElAnchorLink, 'anchor-link')
export const FeAside = /* @__PURE__ */ createTransparentWrapper('FeAside', ElAside, 'aside')
export const FeAutoResizer = /* @__PURE__ */ createTransparentWrapper('FeAutoResizer', ElAutoResizer, 'auto-resizer')
export const FeAutocomplete = /* @__PURE__ */ createTransparentWrapper('FeAutocomplete', ElAutocomplete, 'autocomplete')
export const FeAvatar = /* @__PURE__ */ createTransparentWrapper('FeAvatar', ElAvatar, 'avatar')
export const FeAvatarGroup = /* @__PURE__ */ createTransparentWrapper('FeAvatarGroup', ElAvatarGroup, 'avatar-group')
export const FeBacktop = /* @__PURE__ */ createTransparentWrapper('FeBacktop', ElBacktop, 'backtop')
export const FeBadge = /* @__PURE__ */ defineFeTransparentComponent<FeBadgeProps>('FeBadge', ElBadge, 'badge')
export const FeBreadcrumb = /* @__PURE__ */ createTransparentWrapper('FeBreadcrumb', ElBreadcrumb, 'breadcrumb')
export const FeBreadcrumbItem = /* @__PURE__ */ createTransparentWrapper('FeBreadcrumbItem', ElBreadcrumbItem, 'breadcrumb-item')
export const FeButton = /* @__PURE__ */ defineFeTransparentComponent<FeButtonProps>('FeButton', ElButton, 'btn')
export const FeButtonGroup = /* @__PURE__ */ createTransparentWrapper('FeButtonGroup', ElButtonGroup, 'button-group')
export const FeCalendar = /* @__PURE__ */ createTransparentWrapper('FeCalendar', ElCalendar, 'calendar')
export const FeCard = /* @__PURE__ */ defineFeTransparentComponent<FeCardProps>('FeCard', ElCard, 'card')
export const FeCarousel = /* @__PURE__ */ createTransparentWrapper('FeCarousel', ElCarousel, 'carousel')
export const FeCarouselItem = /* @__PURE__ */ createTransparentWrapper('FeCarouselItem', ElCarouselItem, 'carousel-item')
export const FeCascader = /* @__PURE__ */ createTransparentWrapper('FeCascader', ElCascader, 'cascader')
export const FeCascaderPanel = /* @__PURE__ */ createTransparentWrapper('FeCascaderPanel', ElCascaderPanel, 'cascader-panel')
export const FeCheckbox = /* @__PURE__ */ defineFeTransparentComponent<FeCheckboxProps>('FeCheckbox', ElCheckbox, 'checkbox')
export const FeCheckboxButton = /* @__PURE__ */ createTransparentWrapper('FeCheckboxButton', ElCheckboxButton, 'checkbox-button')
export const FeCheckboxGroup = /* @__PURE__ */ defineFeTransparentComponent<FeCheckboxGroupProps>('FeCheckboxGroup', ElCheckboxGroup, 'checkbox-group')
export const FeCheckTag = /* @__PURE__ */ createTransparentWrapper('FeCheckTag', ElCheckTag, 'check-tag')
export const FeCol = /* @__PURE__ */ createTransparentWrapper('FeCol', ElCol, 'col')
export const FeCollapse = /* @__PURE__ */ createTransparentWrapper('FeCollapse', ElCollapse, 'collapse')
export const FeCollapseItem = /* @__PURE__ */ createTransparentWrapper('FeCollapseItem', ElCollapseItem, 'collapse-item')
export const FeCollapseTransition = /* @__PURE__ */ createTransparentWrapper('FeCollapseTransition', ElCollapseTransition, 'collapse-transition')
export const FeColorPicker = /* @__PURE__ */ createTransparentWrapper('FeColorPicker', ElColorPicker, 'color-picker')
export const FeColorPickerPanel = /* @__PURE__ */ createTransparentWrapper('FeColorPickerPanel', ElColorPickerPanel, 'color-picker-panel')
export const FeContainer = /* @__PURE__ */ createTransparentWrapper('FeContainer', ElContainer, 'container')
export const FeCountdown = /* @__PURE__ */ createTransparentWrapper('FeCountdown', ElCountdown, 'countdown')
export const FeDatePicker = /* @__PURE__ */ defineFeTransparentComponent<FeDatePickerProps>('FeDatePicker', ElDatePicker, 'date-picker')
export const FeDatePickerPanel = /* @__PURE__ */ createTransparentWrapper('FeDatePickerPanel', ElDatePickerPanel, 'date-picker-panel')
export const FeDescriptions = /* @__PURE__ */ createTransparentWrapper('FeDescriptions', ElDescriptions, 'descriptions')
export const FeDescriptionsItem = /* @__PURE__ */ createTransparentWrapper('FeDescriptionsItem', ElDescriptionsItem, 'descriptions-item')
export const FeDialog = /* @__PURE__ */ defineFeTransparentComponent<FeDialogProps>('FeDialog', ElDialog, 'dialog')
export const FeDivider = /* @__PURE__ */ createTransparentWrapper('FeDivider', ElDivider, 'divider')
export const FeDrawer = /* @__PURE__ */ defineFeTransparentComponent<FeDrawerProps>('FeDrawer', ElDrawer, 'drawer')
export const FeDropdown = /* @__PURE__ */ createTransparentWrapper('FeDropdown', ElDropdown, 'dropdown')
export const FeDropdownItem = /* @__PURE__ */ createTransparentWrapper('FeDropdownItem', ElDropdownItem, 'dropdown-item')
export const FeDropdownMenu = /* @__PURE__ */ createTransparentWrapper('FeDropdownMenu', ElDropdownMenu, 'dropdown-menu')
export const FeEmpty = /* @__PURE__ */ defineFeTransparentComponent<FeEmptyProps>('FeEmpty', ElEmpty, 'empty')
export const FeFooter = /* @__PURE__ */ createTransparentWrapper('FeFooter', ElFooter, 'footer')
export const FeForm = /* @__PURE__ */ defineFeTransparentComponent<FeFormProps>('FeForm', ElForm, 'form')
export const FeFormItem = /* @__PURE__ */ defineFeTransparentComponent<FeFormItemProps>('FeFormItem', ElFormItem, 'form-item')
export const FeHeader = /* @__PURE__ */ createTransparentWrapper('FeHeader', ElHeader, 'header')
export const FeIcon = /* @__PURE__ */ createTransparentWrapper('FeIcon', ElIcon, 'icon')
export const FeImage = /* @__PURE__ */ createTransparentWrapper('FeImage', ElImage, 'image')
export const FeImageViewer = /* @__PURE__ */ createTransparentWrapper('FeImageViewer', ElImageViewer, 'image-viewer')
export const FeInput = /* @__PURE__ */ defineFeTransparentComponent<FeInputProps>('FeInput', ElInput, 'input')
export const FeInputNumber = /* @__PURE__ */ defineFeTransparentComponent<FeInputNumberProps>('FeInputNumber', ElInputNumber, 'input-number')
export const FeInputTag = /* @__PURE__ */ createTransparentWrapper('FeInputTag', ElInputTag, 'input-tag')
export const FeLink = /* @__PURE__ */ defineFeTransparentComponent<FeLinkProps>('FeLink', ElLink, 'link')
export const FeMain = /* @__PURE__ */ createTransparentWrapper('FeMain', ElMain, 'main')
export const FeMention = /* @__PURE__ */ createTransparentWrapper('FeMention', ElMention, 'mention')
export const FeMenu = /* @__PURE__ */ createTransparentWrapper('FeMenu', ElMenu, 'menu')
export const FeMenuItem = /* @__PURE__ */ createTransparentWrapper('FeMenuItem', ElMenuItem, 'menu-item')
export const FeMenuItemGroup = /* @__PURE__ */ createTransparentWrapper('FeMenuItemGroup', ElMenuItemGroup, 'menu-item-group')
export const FeOption = /* @__PURE__ */ defineFeTransparentComponent<FeOptionProps>('FeOption', ElOption, 'option')
export const FeOptionGroup = /* @__PURE__ */ createTransparentWrapper('FeOptionGroup', ElOptionGroup, 'option-group')
export const FeOverlay = /* @__PURE__ */ createTransparentWrapper('FeOverlay', ElOverlay, 'overlay')
export const FePageHeader = /* @__PURE__ */ createTransparentWrapper('FePageHeader', ElPageHeader, 'page-header')
export const FePagination = /* @__PURE__ */ defineFeTransparentComponent<FePaginationProps>('FePagination', ElPagination, 'pagination')
export const FePopconfirm = /* @__PURE__ */ defineFeTransparentComponent<FePopconfirmProps>('FePopconfirm', ElPopconfirm, 'popconfirm')
export const FePopover = /* @__PURE__ */ defineFeTransparentComponent<FePopoverProps>('FePopover', ElPopover, 'popover')
export const FePopperContent = /* @__PURE__ */ createTransparentWrapper('FePopperContent', ElPopperContent, 'popper-content')
export const FePopperTrigger = /* @__PURE__ */ createTransparentWrapper('FePopperTrigger', ElPopperTrigger, 'popper-trigger')
export const FeProgress = /* @__PURE__ */ defineFeTransparentComponent<FeProgressProps>('FeProgress', ElProgress, 'progress')
export const FeRadio = /* @__PURE__ */ defineFeTransparentComponent<FeRadioProps>('FeRadio', ElRadio, 'radio')
export const FeRadioButton = /* @__PURE__ */ defineFeTransparentComponent<FeRadioButtonProps>('FeRadioButton', ElRadioButton, 'radio-button')
export const FeRadioGroup = /* @__PURE__ */ defineFeTransparentComponent<FeRadioGroupProps>('FeRadioGroup', ElRadioGroup, 'radio-group')
export const FeRate = /* @__PURE__ */ createTransparentWrapper('FeRate', ElRate, 'rate')
export const FeResult = /* @__PURE__ */ createTransparentWrapper('FeResult', ElResult, 'result')
export const FeRow = /* @__PURE__ */ createTransparentWrapper('FeRow', ElRow, 'row')
export const FeScrollbar = /* @__PURE__ */ createTransparentWrapper('FeScrollbar', ElScrollbar, 'scrollbar')
export const FeSegmented = /* @__PURE__ */ createTransparentWrapper('FeSegmented', ElSegmented, 'segmented')
export const FeSelect = /* @__PURE__ */ defineFeTransparentComponent<FeSelectProps>('FeSelect', ElSelect, 'select')
export const FeSelectV2 = /* @__PURE__ */ createTransparentWrapper('FeSelectV2', ElSelectV2, 'select-v2')
export const FeSkeleton = /* @__PURE__ */ createTransparentWrapper('FeSkeleton', ElSkeleton, 'skeleton')
export const FeSkeletonItem = /* @__PURE__ */ createTransparentWrapper('FeSkeletonItem', ElSkeletonItem, 'skeleton-item')
export const FeSlider = /* @__PURE__ */ createTransparentWrapper('FeSlider', ElSlider, 'slider')
export const FeSpace = /* @__PURE__ */ createTransparentWrapper('FeSpace', ElSpace, 'space')
export const FeSplitter = /* @__PURE__ */ createTransparentWrapper('FeSplitter', ElSplitter, 'splitter')
export const FeSplitterPanel = /* @__PURE__ */ createTransparentWrapper('FeSplitterPanel', ElSplitterPanel, 'splitter-panel')
export const FeStatistic = /* @__PURE__ */ createTransparentWrapper('FeStatistic', ElStatistic, 'statistic')
export const FeStep = /* @__PURE__ */ createTransparentWrapper('FeStep', ElStep, 'step')
export const FeSteps = /* @__PURE__ */ createTransparentWrapper('FeSteps', ElSteps, 'steps')
export const FeSubMenu = /* @__PURE__ */ createTransparentWrapper('FeSubMenu', ElSubMenu, 'sub-menu')
export const FeSwitch = /* @__PURE__ */ defineFeTransparentComponent<FeSwitchProps>('FeSwitch', ElSwitch, 'switch')
export const FeTable = /* @__PURE__ */ defineFeTransparentComponent<FeTableProps>('FeTable', ElTable, 'table')
export const FeTableColumn = /* @__PURE__ */ defineFeTransparentComponent<FeTableColumnProps>('FeTableColumn', ElTableColumn, 'table-column')
export const FeTableV2 = /* @__PURE__ */ createTransparentWrapper('FeTableV2', ElTableV2, 'table-v2')
export const FeTabPane = /* @__PURE__ */ defineFeTransparentComponent<FeTabPaneProps>('FeTabPane', ElTabPane, 'tab-pane')
export const FeTabs = /* @__PURE__ */ defineFeTransparentComponent<FeTabsProps>('FeTabs', ElTabs, 'tabs')
export const FeTag = /* @__PURE__ */ defineFeTransparentComponent<FeTagProps>('FeTag', ElTag, 'tag')
export const FeText = /* @__PURE__ */ defineFeTransparentComponent<FeTextProps>('FeText', ElText, 'text')
export const FeTimePicker = /* @__PURE__ */ createTransparentWrapper('FeTimePicker', ElTimePicker, 'time-picker')
export const FeTimeSelect = /* @__PURE__ */ createTransparentWrapper('FeTimeSelect', ElTimeSelect, 'time-select')
export const FeTimeline = /* @__PURE__ */ createTransparentWrapper('FeTimeline', ElTimeline, 'timeline')
export const FeTimelineItem = /* @__PURE__ */ createTransparentWrapper('FeTimelineItem', ElTimelineItem, 'timeline-item')
export const FeTooltip = /* @__PURE__ */ defineFeTransparentComponent<FeTooltipProps>('FeTooltip', ElTooltip, 'tooltip')
export const FeTour = /* @__PURE__ */ createTransparentWrapper('FeTour', ElTour, 'tour')
export const FeTourStep = /* @__PURE__ */ createTransparentWrapper('FeTourStep', ElTourStep, 'tour-step')
export const FeTransfer = /* @__PURE__ */ createTransparentWrapper('FeTransfer', ElTransfer, 'transfer')
export const FeTree = /* @__PURE__ */ createTransparentWrapper('FeTree', ElTree, 'tree')
export const FeTreeSelect = /* @__PURE__ */ createTransparentWrapper('FeTreeSelect', ElTreeSelect, 'tree-select')
export const FeTreeV2 = /* @__PURE__ */ createTransparentWrapper('FeTreeV2', ElTreeV2, 'tree-v2')
export const FeUpload = /* @__PURE__ */ defineFeTransparentComponent<FeUploadProps>('FeUpload', ElUpload, 'upload')
export const FeWatermark = /* @__PURE__ */ createTransparentWrapper('FeWatermark', ElWatermark, 'watermark')
