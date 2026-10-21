<template>
  <select 
    v-model="model" 
    :class="[
      model === '1' ? 'bg-[#5A7447]/80 text-white border-white/10' : 
      model === '2' ? 'bg-[#866D2B]/80 text-white border-white/10' : 
      model === '3' ? 'bg-[#7A4228]/80 text-white border-white/10' : 
      model === '4' ? 'bg-[#73292E]/80 text-white border-white/10' : defaultBgClass
    ]"
  >
    <option v-if="showAllOption" value="" :class="optionClass">All Levels</option>
    <option value="1" :class="optionClass">Level 1: Explorer</option>
    <option value="2" :class="optionClass">Level 2: Achiever</option>
    <option value="3" :class="optionClass">Level 3: Innovator</option>
    <option value="4" :class="optionClass">Level 4: Master</option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  showAllOption?: boolean
  defaultBgClass?: string
  optionClass?: string
}>(), {
  showAllOption: false,
  defaultBgClass: '',
  optionClass: 'bg-[#00385e] text-white'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
