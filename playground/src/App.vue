<script setup lang="ts">
import { FeConfigProvider } from '@fizz/el-plus'
import { RouterView } from 'vue-router'
</script>

<template>
  <FeConfigProvider>
    <RouterView />
  </FeConfigProvider>
</template>
