<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecDetailSectionItem } from './props'
import FecSection from '../fec-section/FecSection.vue'

defineOptions({
  name: 'FecDetailSections',
})

defineProps({
  sections: {
    type: Array as PropType<readonly FecDetailSectionItem[]>,
    required: true,
  },
  nav: {
    type: Boolean,
    default: true,
  },
})

function sectionId(key: string) {
  return `fec-detail-section-${key}`
}
</script>

<template>
  <div class="fe-comps-detail-sections">
    <div class="fe-comps-detail-sections__main">
      <FecSection
        v-for="section in sections"
        :id="sectionId(section.key)"
        :key="section.key"
        class="fe-comps-detail-sections__section"
        :description="section.description"
        :title="section.title"
      >
        <slot :name="section.key" />
      </FecSection>
    </div>
    <aside
      v-if="nav"
      class="fe-comps-detail-sections__nav"
    >
      <a
        v-for="section in sections"
        :key="section.key"
        class="fe-comps-detail-sections__nav-link"
        :href="`#${sectionId(section.key)}`"
      >
        {{ section.title }}
      </a>
    </aside>
  </div>
</template>
