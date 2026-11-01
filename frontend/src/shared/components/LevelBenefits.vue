<template>
  <div class="flex flex-col gap-4">
    <div v-if="benefits.length === 0" class="rounded-xl border border-gray-200 bg-white p-6 text-center">
      <p class="text-sm text-gray-500">No benefits available for this level.</p>
    </div>
    
    <div v-else class="rounded-xl border border-gray-200 bg-white">
      <ul class="divide-y divide-gray-100">
        <li v-for="(benefit, index) in benefits" :key="index" class="px-6 py-4">
          <p class="text-sm text-gray-800">{{ benefit.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLevelStore } from '@/stores/levelStore'

interface Props {
  level: string | number
}

const props = defineProps<Props>()
const levelStore = useLevelStore()

const benefits = computed(() => {
  return levelStore.allBenefits.filter(b => String(b.level) === String(props.level))
})
</script>
