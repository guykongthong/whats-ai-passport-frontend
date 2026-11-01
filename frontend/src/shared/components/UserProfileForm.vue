<template>
  <form class="flex flex-col gap-6" @submit.prevent="$emit('submit')">
    <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <BaseInput
        v-model="localForm.nameTh"
        label="ชื่อ (ภาษาไทย)"
        placeholder="กรอกชื่อของคุณ"
        :error-message="errors.nameTh"
        :theme="theme"
        required
      />
      <BaseInput
        v-model="localForm.surnameTh"
        label="นามสกุล (ภาษาไทย)"
        placeholder="กรอกนามสกุลของคุณ"
        :error-message="errors.surnameTh"
        :theme="theme"
        required
      />
      <BaseInput
        v-model="localForm.nameEn"
        label="Name (English)"
        placeholder="Enter your first name"
        :error-message="errors.nameEn"
        :theme="theme"
        required
      />
      <BaseInput
        v-model="localForm.surnameEn"
        label="Surname (English)"
        placeholder="Enter your surname"
        :error-message="errors.surnameEn"
        :theme="theme"
        required
      />
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <div class="flex flex-col gap-1">
        <label :class="['text-sm font-semibold', theme === 'dark' ? 'text-white' : 'text-button-primary']">
          Province <RequiredField/>
        </label>
        <select
          v-model="localForm.province"
          :class="[
            'w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2',
            theme === 'dark' 
              ? 'bg-transparent border-white/20 text-white placeholder:text-white/50 focus:ring-white/30'
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-button-primary',
            localForm.province === '' ? (theme === 'dark' ? 'text-white/50' : 'text-gray-400') : ''
          ]"
        >
          <option v-for="p in provinces" :key="p" :value="p" :class="theme === 'dark' ? 'bg-[#00385e] text-white' : ''">{{ p }}</option>
          <option value="" disabled :class="theme === 'dark' ? 'bg-[#00385e] text-white/50' : ''">Select your province</option>
        </select>
        <ErrorMessage :message="errors.province"/>
      </div>
      
      <BaseInput
        v-model="localForm.email"
        label="Email"
        type="email"
        placeholder="you@gmail.com"
        :error-message="errors.email"
        :theme="theme"
        required
      />
    </div>

    <div v-if="isAdmin" class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <div class="flex flex-col gap-1">
        <label :class="['text-sm font-semibold', theme === 'dark' ? 'text-white' : 'text-button-primary']">Level</label>
        <div class="relative">
          <LevelSelect 
            :modelValue="localForm.level || '1'" 
            @update:modelValue="localForm.level = $event"
            :class="[
              'w-full appearance-none border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2',
              theme === 'dark' 
                ? 'bg-transparent border-white/20 text-white placeholder:text-white/50 focus:ring-white/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-button-primary'
            ]"
          />
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none" :class="theme === 'dark' ? 'text-white/70' : 'text-gray-500'">
            <ChevronDownIcon class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <slot name="actions"></slot>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import RequiredField from '@/shared/components/RequiredField.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import LevelSelect from '@/shared/components/LevelSelect.vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'
import type { FieldErrors } from '@/types/FieldErrors'

export interface UserFormData {
  nameTh: string
  surnameTh: string
  nameEn: string
  surnameEn: string
  province: string
  email: string
  level?: string
}

const props = withDefaults(defineProps<{
  modelValue: UserFormData
  errors?: FieldErrors
  isAdmin?: boolean
  theme?: 'light' | 'dark'
}>(), {
  errors: () => ({}),
  isAdmin: false,
  theme: 'light'
})

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'update:modelValue', value: UserFormData): void
}>()

const localForm = ref({ ...props.modelValue })

watch(localForm, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

watch(() => props.modelValue, (newVal) => {
  localForm.value = { ...newVal }
}, { deep: true })

import { provinces } from '@/data/provinces'
</script>
