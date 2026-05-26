<script lang="ts">
import type { PropType } from 'vue'
import type { FecFormModel, FecFormSchemaItem } from './types'
import { FeForm } from '@fizz/el-plus'
import { defineComponent, h } from 'vue'
import { renderSchemaFields } from './schemaFields'

export default defineComponent({
  name: 'FecForm',
  props: {
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
  },
  emits: ['update:model'],
  setup(props, { emit }) {
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
          class: ['fe-comps-form', `fe-comps-form--cols-${props.columns}`],
          model: props.model,
          rules: props.rules,
          labelWidth: props.labelWidth,
        },
        () =>
          renderSchemaFields({
            schema: props.schema,
            model: props.model,
            includeProp: true,
            onUpdateField: emitField,
          }),
      )
  },
})
</script>
