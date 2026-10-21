<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup lang="ts">

import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'submit' | 'button' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button'
})

const variantClasses = {
  primary: 'bg-button-primary text-white hover:opacity-90',
  secondary: 'bg-button-secondary text-button-primary hover:opacity-90',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.disabled && 'opacity-50 cursor-not-allowed',
])

</script>

