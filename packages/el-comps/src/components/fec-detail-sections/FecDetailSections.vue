<script lang="ts">
import type { PropType } from 'vue'
import type { FecDetailSectionItem } from './props'
import { defineComponent, h } from 'vue'
import FecSection from '../fec-section/FecSection.vue'

function sectionId(key: string) {
  return `fec-detail-section-${key}`
}

export default defineComponent({
  name: 'FecDetailSections',
  props: {
    sections: {
      type: Array as PropType<readonly FecDetailSectionItem[]>,
      required: true,
    },
    nav: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'fe-comps-detail-sections' }, [
        h('div', { class: 'fe-comps-detail-sections__main' }, props.sections.map(section =>
          h(FecSection, {
            key: section.key,
            class: 'fe-comps-detail-sections__section',
            description: section.description,
            id: sectionId(section.key),
            title: section.title,
          }, () => slots[section.key]?.()),
        )),
        props.nav
          ? h('aside', { class: 'fe-comps-detail-sections__nav' }, props.sections.map(section =>
              h('a', {
                key: section.key,
                class: 'fe-comps-detail-sections__nav-link',
                href: `#${sectionId(section.key)}`,
              }, section.title),
            ))
          : null,
      ])
  },
})
</script>
