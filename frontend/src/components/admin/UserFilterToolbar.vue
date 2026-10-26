<template>
  <div
    :class="[
      'flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 rounded-2xl shadow-sm transition-colors',
      theme === 'dark'
        ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
        : 'bg-white border border-slate-200 text-slate-800',
    ]"
    role="search"
    aria-label="User Filter Toolbar"
  >
    <!-- Search Input (Name / Surname) with Clear Button -->
    <div class="relative flex-1 min-w-[200px]">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg
          class="size-4"
          :class="theme === 'dark' ? 'text-white/70' : 'text-slate-400'"
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
        placeholder="Search by name or surname..."
        :class="[
          'w-full pl-10 pr-9 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2',
          theme === 'dark'
            ? 'bg-white/20 border border-white/20 text-white placeholder-white/60 focus:bg-white/30 focus:ring-white/50'
            : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500',
        ]"
      />

      <!-- Clear search button -->
      <button
        v-if="search"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
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
    <div class="w-full md:w-44">
      <select
        v-model="level"
        :class="[
          'w-full py-2.5 px-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer',
          theme === 'dark'
            ? 'bg-white/20 border border-white/20 text-white focus:bg-white/30 focus:ring-white/50'
            : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500',
        ]"
        aria-label="Filter by Level"
      >
        <option value="" class="text-slate-800 bg-white">All Levels</option>
        <option value="1" class="text-slate-800 bg-white">Level 1</option>
        <option value="2" class="text-slate-800 bg-white">Level 2</option>
        <option value="3" class="text-slate-800 bg-white">Level 3</option>
        <option value="4" class="text-slate-800 bg-white">Level 4</option>
      </select>
    </div>

    <!-- Province Select Dropdown -->
    <div class="w-full md:w-48">
      <select
        v-model="province"
        :class="[
          'w-full py-2.5 px-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer',
          theme === 'dark'
            ? 'bg-white/20 border border-white/20 text-white focus:bg-white/30 focus:ring-white/50'
            : 'bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500',
        ]"
        aria-label="Filter by Province"
      >
        <option value="" class="text-slate-800 bg-white">All Provinces</option>
        <option
          v-for="prov in provinces"
          :key="prov"
          :value="prov"
          class="text-slate-800 bg-white"
        >
          {{ prov }}
        </option>
      </select>
    </div>

    <!-- Reset Filters Button -->
    <button
      type="button"
      :class="[
        'w-full md:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 cursor-pointer shrink-0',
        theme === 'dark'
          ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 focus:ring-white/50'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 focus:ring-indigo-500',
      ]"
      @click="resetFilters"
    >
      Reset Filters
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

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
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  initialSearch: '',
  initialLevel: '',
  initialProvince: '',
})

const emit = defineEmits<{
  (e: 'filter-change', filters: UserFilters): void
}>()

const search = ref(props.initialSearch || '')
const level = ref(props.initialLevel ? String(props.initialLevel) : '')
const province = ref(props.initialProvince || '')

const provinces = [
  'Bangkok',
  'Chiang Mai',
  'Chiang Rai',
  'Chonburi',
  'Khon Kaen',
  'Nakhon Ratchasima',
  'Nonthaburi',
  'Phuket',
  'Songkhla',
]

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function emitFilterChange() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  const trimmedName = search.value.trim()
  const parsedLevel = level.value ? Number(level.value) : undefined
  const selectedProv = province.value || undefined

  emit('filter-change', {
    name: trimmedName || undefined,
    level: parsedLevel,
    province: selectedProv,
    search: trimmedName || undefined,
  })
}

// Debounce search input changes by 300ms to reduce unnecessary API requests
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
  () => props.initialSearch,
  (val) => {
    if (val !== undefined && val !== search.value) {
      search.value = val
    }
  },
)

watch(
  () => props.initialLevel,
  (val) => {
    const str = val ? String(val) : ''
    if (str !== level.value) {
      level.value = str
    }
  },
)

watch(
  () => props.initialProvince,
  (val) => {
    if (val !== undefined && val !== province.value) {
      province.value = val
    }
  },
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
}
</script>
