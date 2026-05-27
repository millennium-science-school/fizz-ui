<script lang="ts">
import type { PropType } from 'vue'
import type { FecFormModel, FecQuerySchemaItem } from './types'
import { FeButton, FeForm, FeFormItem } from '@fizz/el-plus'
import { defineComponent, h, ref } from 'vue'
import { renderSchemaFields } from './schemaFields'

export default defineComponent({
  name: 'FecQueryForm',
  props: {
    model: {
      type: Object as PropType<FecFormModel>,
      required: true,
    },
    schema: {
      type: Array as PropType<readonly FecQuerySchemaItem<Record<string, unknown>>[]>,
      required: true,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: [String, Number],
    columns: {
      type: Number as PropType<1 | 2 | 3 | 4>,
      default: 3,
    },
    submitText: {
      type: String,
      default: '查询',
    },
    resetText: {
      type: String,
      default: '重置',
    },
  },
  emits: ['update:model', 'submit', 'reset'],
  setup(props, { emit }) {
    const feFormRef = ref<InstanceType<typeof FeForm>>()

    function emitField(prop: string, value: unknown) {
      emit('update:model', {
        ...props.model,
        [prop]: value,
      })
    }

    return () =>
      h(
        FeForm,
        {
          ref: feFormRef,
          class: ['fe-comps-query-form', `fe-comps-query-form--cols-${props.columns}`],
          model: props.model,
          rules: props.rules,
          labelWidth: props.labelWidth,
          inline: true,
        },
        () => [
          ...renderSchemaFields({
            schema: props.schema,
            model: props.model,
            includeProp: true,
            onUpdateField: emitField,
          }),
          h(FeFormItem, { class: 'fe-comps-query-actions' }, () => [
            h(FeButton, {
              type: 'primary',
              onClick: async () => {
                try {
                  await (feFormRef.value as any)?.validate?.()
                  emit('submit', { ...props.model })
                }
                catch {}
              },
            }, () => props.submitText),
            h(FeButton, { onClick: () => emit('reset') }, () => props.resetText),
          ]),
        ],
      )
  },
})
</script>
