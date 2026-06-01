<script setup lang="ts">
defineOptions({
  name: 'FecPage',
})

defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="fe-comps-page">
    <header
      v-if="title || description || $slots.extra"
      class="fe-comps-page-header"
    >
      <div class="fe-comps-page-heading">
        <h1
          v-if="title"
          class="fe-comps-page-title"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="fe-comps-page-description"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.extra"
        class="fe-comps-page-extra"
      >
        <slot name="extra" />
      </div>
    </header>
    <div class="fe-comps-page-body">
      <slot />
    </div>
  </section>
</template>
