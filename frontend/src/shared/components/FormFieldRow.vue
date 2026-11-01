<template>
  <div class="flex flex-col sm:flex-row gap-2 sm:gap-4" :class="alignTop ? 'sm:items-start' : 'sm:items-center'">
    <label class="sm:w-28 text-left sm:text-right text-white font-black text-[16px] sm:text-[18px]" :class="alignTop ? 'sm:mt-2' : ''">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  alignTop?: boolean
}>(), {
  alignTop: false
})
</script>
