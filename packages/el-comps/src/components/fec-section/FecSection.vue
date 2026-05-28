<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecSection',
  props: {
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    return () =>
      h('section', { class: 'fe-comps-section' }, [
        (props.title || props.description || slots.extra)
          ? h('header', { class: 'fe-comps-section-header' }, [
              h('div', { class: 'fe-comps-section-heading' }, [
                props.title ? h('h2', { class: 'fe-comps-section-title' }, props.title) : null,
                props.description ? h('p', { class: 'fe-comps-section-description' }, props.description) : null,
              ]),
              slots.extra ? h('div', { class: 'fe-comps-section-extra' }, slots.extra()) : null,
            ])
          : null,
        h('div', { class: 'fe-comps-section-body' }, slots.default?.()),
      ])
  },
})
</script>
