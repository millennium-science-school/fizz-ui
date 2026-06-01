<script setup lang="ts">
defineOptions({
  name: 'FecSection',
})

defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="fe-comps-section">
    <header
      v-if="title || description || $slots.extra"
      class="fe-comps-section-header"
    >
      <div class="fe-comps-section-heading">
        <h2
          v-if="title"
          class="fe-comps-section-title"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="fe-comps-section-description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.extra"
        class="fe-comps-section-extra"
      >
        <slot name="extra" />
      </div>
    </header>
    <div class="fe-comps-section-body">
      <slot />
    </div>
  </section>
</template>
