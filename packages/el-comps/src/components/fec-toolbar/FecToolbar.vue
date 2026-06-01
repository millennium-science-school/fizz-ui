<script setup lang="ts">
import type { PropType } from 'vue'
import type { FecActionItem } from '../shared/actionTypes'
import { FeButton } from '@fizz/el-plus'
import { computed } from 'vue'

defineOptions({
  name: 'FecToolbar',
})

const toolbarProps = defineProps({
  actions: {
    type: Array as PropType<FecActionItem[]>,
    default: () => [],
  },
})

const emit = defineEmits(['action'])

const visibleActions = computed(() => toolbarProps.actions.filter(action => !action.hidden))

function emitAction(action: FecActionItem) {
  emit('action', action.key, action)
}
</script>

<template>
  <div class="fe-comps-toolbar">
    <div class="fe-comps-toolbar-left">
      <slot />
    </div>
    <div class="fe-comps-toolbar-right">
      <slot name="extra" />
      <FeButton
        v-for="action in visibleActions"
        :key="action.key"
        :type="action.type"
        :disabled="action.disabled"
        @click="emitAction(action)"
      >
        {{ action.label }}
      </FeButton>
    </div>
  </div>
</template>
