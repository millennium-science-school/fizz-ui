<script lang="ts">
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from './types'
import { FeButton, FeDialog } from '@fizz/el-plus'
import { defineComponent, h, ref } from 'vue'
import FecForm from './FecForm.vue'

export default defineComponent({
  name: 'FecDialogForm',
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
    const formRef = ref<{ validate?: () => Promise<boolean> }>()

    return () =>
      h(
        FeDialog,
        {
          'modelValue': props.modelValue,
          'title': props.title,
          'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),
        },
        {
          default: () =>
            h(FecForm, {
              'ref': formRef,
              'model': props.model,
              'schema': props.schema,
              'rules': props.rules,
              'labelWidth': props.labelWidth,
              'columns': props.columns,
              'onUpdate:model': (updated: FecFormModel) => emit('update:model', updated),
            }),
          footer: () => [
            h(FeButton, {
              onClick: () => {
                emit('cancel')
                emit('update:modelValue', false)
              },
            }, () => props.cancelText),
            h(FeButton, {
              type: 'primary',
              onClick: async () => {
                try {
                  await formRef.value?.validate?.()
                  emit('confirm', { ...props.model })
                  emit('update:modelValue', false)
                }
                catch {}
              },
            }, () => props.confirmText),
          ],
        },
      )
  },
})
</script>
