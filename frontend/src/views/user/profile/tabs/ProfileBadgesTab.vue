<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-xl font-extrabold text-[#00385A]">Earned Badges</h3>
        <p class="text-xs font-medium text-slate-500 mt-0.5">
          Showcase of verified digital skill badges and milestones achieved.
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        <span class="size-1.5 rounded-full bg-emerald-600"></span>
        {{ earnedBadges.length }} Badges Unlocked
      </span>
    </div>

    <!-- Badges Grid -->
    <div v-if="earnedBadges.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="badge in earnedBadges"
        :key="badge.id"
        class="group relative flex flex-col items-center rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 p-6 text-center transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
      >
        <!-- Badge Icon -->
        <div class="flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-button-primary ring-1 ring-indigo-500/10 group-hover:scale-105 transition-transform mb-4">
          <svg class="size-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <h4 class="text-base font-extrabold text-[#00385A] leading-snug">
          Level {{ badge.id }}: {{ badge.label || badge.name }}
        </h4>
        <p class="mt-1 text-xs font-medium text-slate-500">
          Digital Competency Badge
        </p>

        <div class="mt-4 flex items-center gap-1.5 rounded-full bg-[#00385A] px-3 py-1 text-[11px] font-bold text-white shadow-2xs">
          <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>Verified Credential</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
      <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p class="text-sm font-bold text-slate-700">No badges unlocked yet</p>
      <p class="mt-1 text-xs text-slate-500">
        Pass certification exams in the eLearning portal to unlock new skill badges.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useExamStore } from '@/stores/examStore'
import { useLevelStore } from '@/stores/levelStore'
import type { Level } from '@/types/Level'

const authStore = useAuthStore()
const examStore = useExamStore()
const levelStore = useLevelStore()

const earnedBadges = computed<Level[]>(() => {
  const userId = authStore.currentUser?.id
  if (!userId) return []
  const passedRecords = examStore.records.filter((r) => r.userId === userId && r.pass)
  const passedLevelIds = new Set(passedRecords.map((r) => String(r.level)))
  return levelStore.allLevels.filter((l) => passedLevelIds.has(String(l.id)))
})
</script>
