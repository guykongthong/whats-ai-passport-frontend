<template>
  <div 
    v-if="message || $slots.default"
    :class="[
      'p-4 rounded-xl border text-sm font-semibold flex items-center gap-3',
      variantClasses[variant]
    ]"
    role="alert"
  >
    <div class="flex-1">
      <slot>{{ message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  variant?: 'error' | 'warning' | 'info' | 'success'
}

withDefaults(defineProps<Props>(), {
  variant: 'info'
})

const variantClasses = {
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-green-50 text-green-800 border-green-200'
}
</script>
