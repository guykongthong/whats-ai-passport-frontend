<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-semibold text-button-primary">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Upload Box -->
    <div
      class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors"
      :class="[
        isDragging ? 'border-button-primary bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50',
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
      <div v-if="isUploading" class="flex flex-col items-center gap-2 py-4">
        <svg class="size-8 animate-spin text-button-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span class="text-xs font-medium text-gray-600">Uploading image to cloud storage...</span>
      </div>

      <!-- Preview Mode (when image is uploaded) -->
      <div v-else-if="modelValue" class="flex flex-col sm:flex-row items-center gap-4 w-full py-1" @click.stop>
        <div class="relative size-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <img
            :src="modelValue"
            alt="Profile preview"
            class="size-full object-cover"
          />
        </div>

        <div class="flex flex-col items-center sm:items-start gap-2 flex-1 min-w-0">
          <span class="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
            <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Uploaded to cloud storage
          </span>
          <span class="text-xs text-gray-500 truncate max-w-full font-mono">{{ modelValue }}</span>

          <div class="flex items-center gap-2 mt-1">
            <button
              type="button"
              class="rounded-lg bg-white border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              :disabled="disabled || isUploading"
              @click="triggerFileInput"
            >
              Replace
            </button>
            <button
              type="button"
              class="rounded-lg bg-white border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              :disabled="disabled || isUploading"
              @click="removeImage"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Dropzone / Empty Mode -->
      <div v-else class="flex flex-col items-center gap-2 py-4 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-blue-50 text-button-primary">
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <span class="text-sm font-semibold text-button-primary hover:underline">Click to upload</span>
          <span class="text-sm text-gray-600"> or drag and drop</span>
        </div>
        <p class="text-xs text-gray-400">PNG, JPG or WEBP (Max {{ maxSizeMb }}MB)</p>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="internalError || errorMessage" class="text-xs text-red-500 font-medium">
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
  required?: boolean
  disabled?: boolean
  errorMessage?: string
  maxSizeMb?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Profile image',
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
