<template>
  <div class="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
    <!-- Card Header -->
    <div class="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
      <div class="flex items-center gap-3.5">
        <div class="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Benefits & Perks
          </h2>
          <p class="text-xs font-medium text-slate-500">
            Active privileges for Level {{ currentLevel }}
          </p>
        </div>
      </div>

      <!-- Count Badge -->
      <span class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-700/10">
        {{ normalizedBenefits.length }} Perks
      </span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="flex flex-1 flex-col gap-3 py-4 animate-pulse">
      <div v-for="i in 4" :key="i" class="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
        <div class="size-5 rounded-full bg-slate-200" />
        <div class="h-4 flex-1 rounded-md bg-slate-200" />
      </div>
    </div>

    <!-- Benefits List -->
    <div v-else-if="normalizedBenefits.length > 0" class="flex-1 py-4">
      <ul class="flex flex-col gap-2.5">
        <li
          v-for="(item, idx) in normalizedBenefits"
          :key="idx"
          class="group flex items-start gap-3.5 rounded-2xl p-3 sm:p-3.5 bg-slate-50/70 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 transition-colors"
        >
          <div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {{ item }}
          </div>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div class="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">No active perks found</p>
      <p class="text-xs text-slate-400 mt-1">Pass the next upgrade exam to unlock new benefits.</p>
    </div>

    <!-- Card Footer -->
    <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full bg-indigo-500" />
        Level {{ currentLevel }} Verified
      </span>
      <span class="text-[11px] text-slate-400">Higher levels grant cumulative perks</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLevelStore } from '@/stores/levelStore'
import type { Benefit } from '@/types/Benefit'

interface Props {
  currentLevel?: number | string
  benefits?: Array<string | Benefit>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentLevel: 1,
  benefits: () => [],
  loading: false,
})

const levelStore = useLevelStore()

const normalizedBenefits = computed<string[]>(() => {
  // If explicitly passed through props and non-empty
  if (props.benefits && props.benefits.length > 0) {
    return props.benefits.map((b) => (typeof b === 'string' ? b : b.description))
  }

  // Fallback to store
  const fromStore = levelStore.getBenefitsForLevel(String(props.currentLevel))
  return fromStore.map((b) => b.description)
})
</script>
