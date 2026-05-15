import type { Component } from 'vue'
import {
  FeInput,
  FeInputNumber,
} from '@fizz/el-plus'

export type FecBuiltinControlName = 'input' | 'number'
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

  return {
    component: FeInput,
    props: {},
  }
}
