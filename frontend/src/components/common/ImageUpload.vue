<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :class="[
        'text-sm font-bold tracking-wide',
        labelClass || (theme === 'dark' ? 'text-white' : 'text-button-primary'),
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-rose-400">*</span>
    </label>

    <!-- Upload Box: Compact Avatar Style (~130-150px) -->
    <div
      class="relative flex items-center rounded-2xl border-2 border-dashed p-4 transition-colors"
      :class="[
        theme === 'dark'
          ? (isDragging
              ? 'border-sky-400 bg-white/15'
              : 'border-white/20 hover:border-white/40 bg-black/25 hover:bg-black/30')
          : (isDragging
              ? 'border-button-primary bg-blue-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/70'),
        disabled || isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        :disabled="disabled || isUploading"
        @change="onFileSelected"
      />

      <!-- Loading Spinner -->
      <div v-if="isUploading" class="flex flex-1 items-center justify-center gap-3 py-4">
        <svg
          class="size-7 animate-spin"
          :class="theme === 'dark' ? 'text-white' : 'text-button-primary'"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span
          class="text-xs font-semibold"
          :class="theme === 'dark' ? 'text-slate-200' : 'text-slate-700'"
        >
          Uploading image to cloud storage...
        </span>
      </div>

      <!-- Preview Mode (when image is uploaded) - Avatar Style -->
      <div v-else-if="modelValue" class="flex items-center gap-4 sm:gap-5 w-full py-1" @click.stop>
        <!-- 96px Avatar Circle -->
        <div
          class="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-full border-2 shadow-md"
          :class="theme === 'dark' ? 'border-white/30 bg-black/40' : 'border-slate-200 bg-white'"
        >
          <img
            :src="modelValue"
            alt="Profile preview"
            class="size-full object-cover"
          />
        </div>

        <div class="flex flex-col items-start gap-2 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5"
              :class="
                theme === 'dark'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              "
            >
              <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Photo uploaded
            </span>
          </div>

          <!-- Buttons -->
          <div class="flex items-center gap-2.5">
            <button
              type="button"
              class="rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              :class="
                theme === 'dark'
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/25'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
              "
              :disabled="disabled || isUploading"
              @click="triggerFileInput"
            >
              Change photo
            </button>
            <button
              type="button"
              class="rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              :class="
                theme === 'dark'
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                  : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
              "
              :disabled="disabled || isUploading"
              @click="removeImage"
            >
              Remove
            </button>
          </div>

          <!-- Hint (Contrast >= 4.5:1) -->
          <p
            class="text-[11px] font-semibold"
            :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
          >
            PNG, JPG or WEBP (Max {{ maxSizeMb }}MB)
          </p>
        </div>
      </div>

      <!-- Empty / Dropzone Mode - Avatar Placeholder Style (~130-150px) -->
      <div v-else class="flex items-center gap-4 sm:gap-5 w-full py-1">
        <!-- 96px Avatar Placeholder -->
        <div
          class="flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed shadow-xs transition-colors"
          :class="
            theme === 'dark'
              ? 'border-white/30 bg-white/5 text-white/70'
              : 'border-slate-300 bg-slate-100 text-slate-400'
          "
        >
          <svg class="size-8 sm:size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <div class="flex flex-col items-start gap-1 flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span
              class="text-xs sm:text-sm font-bold hover:underline"
              :class="theme === 'dark' ? 'text-white' : 'text-button-primary'"
            >
              Click to upload
            </span>
            <span
              class="text-xs sm:text-sm font-medium"
              :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-600'"
            >
              or drag and drop
            </span>
          </div>

          <!-- Hint (Contrast >= 4.5:1) -->
          <p
            class="text-xs font-semibold tracking-wide mt-1"
            :class="theme === 'dark' ? 'text-slate-300' : 'text-slate-700'"
          >
            PNG, JPG or WEBP (Max {{ maxSizeMb }}MB)
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="internalError || errorMessage" class="text-xs text-rose-400 font-medium mt-0.5">
      {{ internalError || errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FileService } from '@/services'

interface Props {
  modelValue?: string
  label?: string
  labelClass?: string
  theme?: 'light' | 'dark'
  required?: boolean
  disabled?: boolean
  errorMessage?: string
  maxSizeMb?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Profile image',
  labelClass: '',
  theme: 'dark',
  required: false,
  disabled: false,
  errorMessage: '',
  maxSizeMb: 5,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'upload-success', url: string): void
  (e: 'upload-error', error: string): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const internalError = ref('')

function triggerFileInput() {
  if (props.disabled || isUploading.value) return
  fileInputRef.value?.click()
}

function onDragOver() {
  if (props.disabled || isUploading.value) return
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  if (props.disabled || isUploading.value) return
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    handleFileUpload(file)
  }
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileUpload(file)
  }
  // reset input so same file can be selected again
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleFileUpload(file: File) {
  internalError.value = ''

  // Validate format
  if (!file.type.startsWith('image/')) {
    internalError.value = 'Please select a valid image file (PNG, JPG, or WEBP).'
    emit('upload-error', internalError.value)
    return
  }

  // Validate size
  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    internalError.value = `Image size must be smaller than ${props.maxSizeMb}MB.`
    emit('upload-error', internalError.value)
    return
  }

  isUploading.value = true
  try {
    const res = await FileService.uploadImage(file)
    emit('update:modelValue', res.url)
    emit('upload-success', res.url)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed. Please try again.'
    internalError.value = message
    emit('upload-error', message)
  } finally {
    isUploading.value = false
  }
}

function removeImage() {
  internalError.value = ''
  emit('update:modelValue', '')
}
</script>
