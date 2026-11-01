<template>
  <select 
    v-model="model" 
    :class="[
      getLevelBadgeDark(Number(model)) || defaultBgClass
    ]"
  >
    <option v-if="showAllOption" value="" :class="optionClass">All Levels</option>
    <option
      v-for="lvl in LEVEL_NUMBERS"
      :key="lvl"
      :value="String(lvl)"
      :class="optionClass"
    >
      Level {{ lvl }}: {{ getLevelName(lvl) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLevelName, getLevelBadgeDark, LEVEL_NUMBERS } from '@/utils/levelDisplay'

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
