<script lang="ts">
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from './types'
import { FeButton, FeDrawer } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'
import FecForm from './FecForm.vue'

export default defineComponent({
  name: 'FecDrawerForm',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: String,
    model: {
      type: Object as PropType<FecFormModel>,
      required: true,
    },
    schema: {
      type: Array as PropType<FecFormSchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: [String, Number],
    columns: {
      type: Number as PropType<1 | 2 | 3 | 4>,
      default: 1,
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
  },
  emits: ['update:modelValue', 'update:model', 'confirm', 'cancel'],
  setup(props, { emit }) {
    return () =>
      h(
        FeDrawer,
        {
          modelValue: props.modelValue,
          title: props.title,
          'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),
        },
        {
          default: () =>
            h(FecForm, {
              model: props.model,
              schema: props.schema,
              rules: props.rules,
              labelWidth: props.labelWidth,
              columns: props.columns,
              'onUpdate:model': (updated: FecFormModel) => emit('update:model', updated),
            }),
          footer: () => [
            h(FeButton, { onClick: () => { emit('cancel'); emit('update:modelValue', false) } }, () => props.cancelText),
            h(FeButton, { type: 'primary', onClick: () => { emit('confirm', { ...props.model }); emit('update:modelValue', false) } }, () => props.confirmText),
          ],
        },
      )
  },
})
</script>
