<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-sm font-semibold text-button-primary">
      {{ label }}
      <span v-if="required"><RequiredField/></span>
    </label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :class="theme === 'dark'
        ? 'bg-white/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:bg-white/30 text-[16px] font-semibold'
        : 'rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary'"
    />
    <ErrorMessage :message="errorMessage"/>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import RequiredField from './RequiredField.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'

interface Props {
  label?: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  required?: boolean
  errorMessage?: string
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  theme: 'light',
})

const model = defineModel<string>()

const inputId = useId()
</script>
