<template>
  <nav
    v-if="totalPages > 0"
    class="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 w-full select-none"
    aria-label="Pagination Navigation"
  >
    <!-- Summary Text: e.g. "Page 1 of 5" -->
    <!-- Page Indicator Text (e.g. "Page 1 of 5") -->
    <div
      :class="[
        'text-sm sm:text-base font-medium',
        theme === 'dark' ? 'text-white/80' : 'text-slate-600',
      ]"
    >
      Page <span :class="['font-bold', theme === 'dark' ? 'text-white' : 'text-slate-800']">{{ currentPage }}</span> of
      <span :class="['font-bold', theme === 'dark' ? 'text-white' : 'text-slate-800']">{{ totalPages }}</span>
    </div>

    <!-- Navigation Buttons Group -->
    <div class="flex items-center gap-2">
      <!-- Previous Button (Hidden completely on first page: v-if="showPrev") -->
      <button
        v-if="showPrev"
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-1 cursor-pointer',
          theme === 'dark'
            ? 'text-white bg-white/10 hover:bg-white/20 border border-white/20 focus:ring-white/40'
            : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 focus:ring-slate-400',
        ]"
        aria-label="Previous Page"
        @click.prevent="goToPage(currentPage - 1)"
      >
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <!-- Numeric Page Buttons (Windowed) -->
      <div class="flex items-center gap-1.5">
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          :class="[
            'size-9 inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-1 cursor-pointer',
            page === currentPage
              ? 'bg-[#C1D7AE] text-[#00385e] shadow-sm border border-[#C1D7AE] focus:ring-[#C1D7AE]/60'
              : (theme === 'dark'
                  ? 'text-white/80 bg-white/10 hover:bg-white/20 border border-white/15 focus:ring-white/40'
                  : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 focus:ring-slate-400'),
          ]"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click.prevent="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button (Hidden completely on last page: v-if="showNext") -->
      <button
        v-if="showNext"
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-1 cursor-pointer',
          theme === 'dark'
            ? 'text-white bg-white/10 hover:bg-white/20 border border-white/20 focus:ring-white/40'
            : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 focus:ring-slate-400',
        ]"
        aria-label="Next Page"
        @click.prevent="goToPage(currentPage + 1)"
      >
        <span>Next</span>
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'page-change', newPage: number): void
}>()

// Strict visibility: Hide Previous on page 1 (currentPage <= 1)
const showPrev = computed(() => props.currentPage > 1)

// Strict visibility: Hide Next on last page (currentPage >= totalPages)
const showNext = computed(() => props.currentPage < props.totalPages)

// Display up to 5 page numbers centered on current page
const visiblePages = computed(() => {
  const total = props.totalPages
  if (total <= 0) return []

  const current = Math.min(Math.max(1, props.currentPage), total)
  const windowSize = 5

  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = current - Math.floor(windowSize / 2)
  let end = current + Math.floor(windowSize / 2)

  if (start < 1) {
    start = 1
    end = windowSize
  } else if (end > total) {
    end = total
    start = total - windowSize + 1
  }

  const pages: number[] = []
  for (let p = start; p <= end; p++) {
    pages.push(p)
  }
  return pages
})

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return
  }
  emit('page-change', page)
}
</script>
