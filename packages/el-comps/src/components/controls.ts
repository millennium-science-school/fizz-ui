import type { Component } from 'vue'
import {
  FeDatePicker,
  FeInput,
  FeInputNumber,
  FeSelect,
  FeSwitch,
} from '@fizz/el-plus'

export type FecBuiltinControlName = 'input' | 'number' | 'select' | 'date' | 'switch' | 'textarea'
export type FecLegacyControlName = 'ElInput' | 'ElInputNumber'

export interface FecCustomControl {
  component: Component
  props?: Record<string, unknown>
}

export type FecControl = FecBuiltinControlName | FecLegacyControlName | FecCustomControl

export interface FecResolvedControl {
  component: Component
  props: Record<string, unknown>
}

export function resolveFecControl(control: FecControl): FecResolvedControl {
  if (typeof control !== 'string') {
    return {
      component: control.component,
      props: control.props ?? {},
    }
  }

  if (control === 'number' || control === 'ElInputNumber') {
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

  if (control === 'date') {
    return {
      component: FeDatePicker,
      props: { type: 'date' },
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
