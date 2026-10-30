<template>
  <div class="flex flex-col gap-2 w-full">
    <!-- Header: Label and Item Counter -->
    <div v-if="label" class="flex items-center justify-between">
      <label
        class="text-xs sm:text-sm font-semibold tracking-wide"
        :class="theme === 'dark' ? 'text-white' : 'text-slate-700'"
      >
        {{ label }}
        <span v-if="required" class="text-rose-400 ml-0.5">*</span>
      </label>
      <span
        class="text-xs font-medium"
        :class="theme === 'dark' ? 'text-white/60' : 'text-slate-400'"
      >
        {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <!-- Tags Badges Box (Displaying removable tags) -->
    <div
      :class="[
        'flex flex-wrap gap-2 p-3 rounded-xl border min-h-[52px] transition-all',
        theme === 'dark'
          ? 'bg-white/10 backdrop-blur-md border-white/15'
          : 'bg-slate-50 border-slate-200',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      ]"
      role="list"
      :aria-label="label ? `${label} list` : 'Tag list'"
    >
      <!-- Tag Badges -->
      <div
        v-for="(item, index) in items"
        :key="`${index}-${item}`"
        :class="[
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group max-w-full shadow-xs',
          theme === 'dark'
            ? 'bg-white/15 hover:bg-white/20 text-white border border-white/20'
            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200',
        ]"
        role="listitem"
      >
        <span class="break-words leading-relaxed select-text">{{ item }}</span>

        <!-- Remove Button -->
        <button
          v-if="!disabled"
          type="button"
          class="size-4 rounded flex items-center justify-center transition-colors cursor-pointer opacity-60 hover:opacity-100 focus:outline-hidden"
          :class="theme === 'dark' ? 'hover:bg-rose-500/30 text-rose-300 hover:text-rose-100' : 'hover:bg-rose-100 text-rose-500 hover:text-rose-700'"
          :aria-label="`Remove ${item}`"
          title="Remove item"
          @click="removeItem(index)"
        >
          <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty State inside tag box -->
      <span
        v-if="items.length === 0"
        class="text-xs italic select-none self-center py-1"
        :class="theme === 'dark' ? 'text-white/50' : 'text-slate-400'"
      >
        No items added yet.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string[]
  label?: string
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark'
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  label: '',
  placeholder: 'Type an item...',
  disabled: false,
  theme: 'dark',
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'remove', index: number, item: string): void
}>()

const items = computed(() => props.modelValue ?? [])
