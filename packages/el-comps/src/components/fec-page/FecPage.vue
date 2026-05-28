<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FecPage',
  props: {
    title: String,
    description: String,
  },
  setup(props, { slots }) {
    return () =>
      h('section', { class: 'fe-comps-page' }, [
        (props.title || props.description || slots.extra)
          ? h('header', { class: 'fe-comps-page-header' }, [
              h('div', { class: 'fe-comps-page-heading' }, [
                props.title ? h('h1', { class: 'fe-comps-page-title' }, props.title) : null,
                props.description ? h('p', { class: 'fe-comps-page-description' }, props.description) : null,
              ]),
              slots.extra ? h('div', { class: 'fe-comps-page-extra' }, slots.extra()) : null,
            ])
          : null,
        h('div', { class: 'fe-comps-page-body' }, slots.default?.()),
      ])
  },
})
</script>
