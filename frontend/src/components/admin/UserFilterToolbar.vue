<template>
  <div
    :class="[
      'flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 sm:p-5 rounded-2xl shadow-lg transition-colors',
      theme === 'dark'
        ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
        : 'bg-white border border-slate-200 text-slate-800',
    ]"
    role="search"
    aria-label="User Filter Toolbar"
  >
    <!-- Search Input (Name / Surname) with Clear Button -->
    <div class="relative flex-1 min-w-[220px]">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg
          class="size-4"
          :class="theme === 'dark' ? 'text-white/60' : 'text-slate-400'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        v-model="search"
        type="text"
        placeholder="Search by name, surname, or username..."
        :class="[
          'w-full pl-10 pr-9 h-11 rounded-xl text-sm transition-all focus:outline-none focus:ring-1',
          theme === 'dark'
            ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:ring-white/30 focus:border-white/40'
            : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-slate-300 focus:border-slate-400',
        ]"
      />

      <!-- Clear search button -->
      <button
        v-if="search"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-white/50 hover:text-white transition-colors"
        aria-label="Clear search"
        title="Clear search"
        @click="clearSearch"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Level Select Dropdown -->
    <div class="relative w-full md:w-52 md:min-w-[190px]">
      <select
        v-model="level"
        :class="[
          'w-full h-11 pl-4 pr-10 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-1 cursor-pointer appearance-none',
          theme === 'dark'
            ? 'bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md focus:bg-white/15 focus:ring-white/30 focus:border-white/40'
            : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-slate-300 focus:border-slate-400',
        ]"
        aria-label="Filter by Level"
      >
        <option value="" class="text-white bg-[#002742]">All Levels</option>
        <option
          v-for="lvl in LEVEL_NUMBERS"
          :key="lvl"
          :value="String(lvl)"
          class="text-white bg-[#002742]"
        >
          Level {{ lvl }} ({{ getLevelName(lvl) }})
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
        :class="theme === 'dark' ? 'text-white/70' : 'text-slate-400'"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Province Select Dropdown -->
    <div class="relative w-full md:w-56 md:min-w-[210px]">
      <select
        v-model="province"
        :class="[
          'w-full h-11 pl-4 pr-10 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-1 cursor-pointer appearance-none',
          theme === 'dark'
            ? 'bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md focus:bg-white/15 focus:ring-white/30 focus:border-white/40'
            : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-slate-300 focus:border-slate-400',
        ]"
        aria-label="Filter by Province"
      >
        <option value="" class="text-white bg-[#002742]">All Provinces</option>
        <option
          v-for="prov in provinces"
          :key="prov"
          :value="prov"
          class="text-white bg-[#002742]"
        >
          {{ prov }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
        :class="theme === 'dark' ? 'text-white/70' : 'text-slate-400'"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Reset Filters Button -->
    <button
      type="button"
      :class="[
        'w-full md:w-auto h-11 px-5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 cursor-pointer shrink-0 select-none shadow-sm flex items-center justify-center gap-1.5',
        theme === 'dark'
          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 focus:ring-white/40 active:scale-95'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 focus:ring-indigo-500',
      ]"
      @click="resetFilters"
    >
      <svg class="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>Reset Filters</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { getLevelName, LEVEL_NUMBERS } from '@/utils/levelDisplay'

export interface UserFilters {
  name?: string
  level?: number
  province?: string
  search?: string
}

interface Props {
  theme?: 'light' | 'dark'
  initialSearch?: string
  initialLevel?: number | string
  initialProvince?: string
  initialFilters?: UserFilters
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  initialSearch: '',
  initialLevel: '',
  initialProvince: '',
})

const emit = defineEmits<{
  (e: 'filter-change', filters: UserFilters): void
  (e: 'update:filters', filters: UserFilters): void
  (e: 'reset'): void
}>()

const search = ref(props.initialFilters?.name || props.initialFilters?.search || props.initialSearch || '')
const level = ref(props.initialFilters?.level ? String(props.initialFilters.level) : (props.initialLevel ? String(props.initialLevel) : ''))
const province = ref(props.initialFilters?.province || props.initialProvince || '')

import { provinces } from '@/data/provinces'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function emitFilterChange() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  const trimmedName = search.value.trim()
  const parsedLevel = level.value ? Number(level.value) : undefined
  const selectedProv = province.value || undefined

  const payload: UserFilters = {
    name: trimmedName || undefined,
    level: parsedLevel,
    province: selectedProv,
    search: trimmedName || undefined,
  }

  emit('filter-change', payload)
  emit('update:filters', payload)
}

// Debounce search input changes by 300ms
watch(search, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    emitFilterChange()
  }, 300)
})

// Dropdowns (Level & Province) emit immediately without debounce
watch([level, province], () => {
  emitFilterChange()
})

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
})

// Sync props if parent changes them
watch(
  () => [props.initialFilters, props.initialSearch, props.initialLevel, props.initialProvince],
  () => {
    if (props.initialFilters) {
      if (props.initialFilters.name !== undefined && props.initialFilters.name !== search.value) {
        search.value = props.initialFilters.name || ''
      }
      if (props.initialFilters.level !== undefined && String(props.initialFilters.level) !== level.value) {
        level.value = props.initialFilters.level ? String(props.initialFilters.level) : ''
      }
      if (props.initialFilters.province !== undefined && props.initialFilters.province !== province.value) {
        province.value = props.initialFilters.province || ''
      }
    }
  },
  { deep: true },
)

function clearSearch() {
  search.value = ''
  emitFilterChange()
}

function resetFilters() {
  search.value = ''
  level.value = ''
  province.value = ''
  emitFilterChange()
  emit('reset')
}
</script>
