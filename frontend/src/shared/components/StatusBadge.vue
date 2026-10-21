<template>
  <div
    class="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white"
    :class="backgroundColor"
  >
    <!-- Passed Icon -->
    <svg v-if="status === 'Passed'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
    </svg>
    <!-- Failed Icon -->
    <svg v-else-if="status === 'Failed'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
      <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
    </svg>
    
    {{ status }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const backgroundColor = computed(() => {
  switch (props.status) {
    case 'Passed':
      return 'bg-[#358b44]'
    case 'Failed':
      return 'bg-[#d83c34]'
    default:
      return 'bg-gray-500'
  }
})
</script>
