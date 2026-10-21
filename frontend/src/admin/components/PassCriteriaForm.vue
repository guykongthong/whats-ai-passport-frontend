<template>
  <div class="flex items-center gap-2">
    <span class="text-white font-black text-[15px]">[Passing Score:</span>
    <input 
      type="number" 
      :value="modelValue"
      @input="updateValue"
      class="w-16 bg-white/20 border border-white/10 rounded-lg px-2 py-0.5 text-center text-white focus:outline-none text-[15px] font-black"
      min="0"
      max="100"
    />
    <span class="text-white font-black text-[15px] font-semibold">%]</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>
