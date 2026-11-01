<template>
  <span class="flex items-center gap-1 text-sm text-gray-500">
    <!-- Star icon -->
    <StarIcon class="size-4" :class="starColor" />
    Level: {{ level }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StarIcon from '@/shared/components/icons/StarIcon.vue'

interface Props {
  level: string | number
}

const props = defineProps<Props>()

const levelNum = computed(() => Number(props.level))

const starColor = computed(() => {
  switch (levelNum.value) {
    case 1:
      return 'text-gray-500' // Slate/Gray
    case 2:
      return 'text-blue-500' // Blue
    case 3:
      return 'text-yellow-500' // Gold/Amber
    case 4:
      return 'text-[#DD898E]' // Rose / Level 4 Criteria
    default:
      return 'text-gray-400'
  }
})
</script>
