import type { FieldControlKind } from '@fizz/el-kit'
import type { Component } from 'vue'
import {
  FeDatePicker,
  FeInput,
  FeInputNumber,
  FeSelect,
  FeSwitch,
} from '@fizz/el-plus'

export type FecControl = FieldControlKind | Component

export interface FecResolvedControl {
  component: Component
  props: Record<string, unknown>
}

export function resolveFecControl(control: FecControl): FecResolvedControl {
  if (typeof control !== 'string') {
    return {
      component: control,
      props: {},
    }
  }

  if (control === 'number') {
    return {
      component: FeInputNumber,
      props: {},
    }
  }

  if (control === 'select') {
    return {
      component: FeSelect,
      props: {},
    }
  }

  if (control === 'multiSelect') {
    return {
      component: FeSelect,
      props: { multiple: true },
    }
  }

  if (control === 'date') {
    return {
      component: FeDatePicker,
      props: { type: 'date' },
    }
  }

  if (control === 'dateRange') {
    return {
      component: FeDatePicker,
      props: { type: 'daterange' },
    }
  }

  if (control === 'switch') {
    return {
      component: FeSwitch,
      props: {},
    }
  }

  if (control === 'textarea') {
    return {
      component: FeInput,
      props: { type: 'textarea' },
    }
  }

  return {
    component: FeInput,
    props: {},
  }
}
