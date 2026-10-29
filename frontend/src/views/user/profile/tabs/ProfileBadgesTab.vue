<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200/80 pb-4">
      <h2 class="text-lg font-bold text-slate-800">Earned Badges & Achievements</h2>
      <p class="text-xs sm:text-sm text-slate-500">
        Milestones and certifications unlocked through examination progression.
      </p>
    </div>

    <!-- Badges Grid -->
    <div v-if="badges.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="badge in badges"
        :key="badge.name"
        class="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/70 to-white p-5 shadow-xs flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div class="size-16 rounded-full bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner">
          <img
            v-if="badge.imageUrl"
            :src="badge.imageUrl"
            :alt="badge.name"
            class="size-full rounded-full object-cover"
          />
          <span v-else>🎖️</span>
        </div>
        <div>
          <h3 class="font-bold text-sm text-amber-900">{{ badge.name }}</h3>
          <p v-if="badge.unlockedAt" class="text-xs text-amber-700/80 mt-1">
            Unlocked: {{ formatDate(badge.unlockedAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center py-14"
    >
      <div class="size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
        <span class="text-2xl">🎖️</span>
      </div>
      <h3 class="text-base font-bold text-slate-700">No Badges Unlocked Yet</h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Complete your level examinations with passing scores to earn official certification badges.
      </p>
      <div class="mt-5">
        <RouterLink
          to="/exam"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00385A] hover:bg-[#002a43] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>Take Level Exam</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const badges = computed(() => userStore.badges)

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
