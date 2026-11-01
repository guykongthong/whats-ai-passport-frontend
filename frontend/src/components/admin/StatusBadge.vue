<template>
  <span
    :class="[
      'inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold select-none transition-colors',
      badgeClasses,
    ]"
    role="status"
    :aria-label="enabled ? 'Active' : 'Deactivated'"
  >
    <!-- Indicator Dot (Static when Active, Static when Deactivated) -->
    <span v-if="enabled" class="size-2.5 rounded-full bg-emerald-400 shrink-0" />
    <span v-else class="size-2.5 rounded-full bg-rose-500 shrink-0" />

    <span>{{ labelText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  enabled: boolean
  activeText?: string
  deactivatedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeText: 'Active',
  deactivatedText: 'Deactivated',
})

const labelText = computed(() => (props.enabled ? props.activeText : props.deactivatedText))

const badgeClasses = computed(() => {
  if (props.enabled) {
    return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
  }
  return 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
})
</script>
