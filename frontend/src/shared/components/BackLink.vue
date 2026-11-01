<template>
  <RouterLink 
    v-if="to"
    :to="to" 
    :class="customClass || 'text-white/80 hover:text-white font-extrabold flex items-center gap-2 text-[15px]'"
  >
    {{ label }}
  </RouterLink>
  <button 
    v-else
    @click="$emit('click')" 
    :class="customClass || 'text-white/80 hover:text-white font-extrabold flex items-center gap-2 text-[15px]'"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  label: string
  to?: string
  customClass?: string
}>(), {
  customClass: ''
})

defineEmits<{
  click: []
}>()
</script>
