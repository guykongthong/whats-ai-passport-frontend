<template>
  <div class="space-y-6">
    <!-- 1. Header Area: Title & Take Next Exam Button -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Exam History & Certification
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review your certification attempts, scores, and unlocked badges.
        </p>
      </div>

      <RouterLink
        v-if="canTakeExam"
        to="/exam"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002845] hover:bg-[#001830] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
      >
        <span>Take Next Exam</span>
        <span>&rarr;</span>
      </RouterLink>
    </div>

    <!-- 2. Earned Badges & Achievements Section (Matching reference image) -->
    <div
      v-if="badges.length > 0"
      class="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-4"
    >
      <!-- Header row of Badges card -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-lg bg-sky-50 text-[#002845] flex items-center justify-center shrink-0">
            <BadgeMedalIcon class="size-4.5 text-[#002845]" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900">
              Earned Badges & Achievements
            </h3>
            <p class="text-xs text-slate-500">
              Officially verified credentials tied to your candidate profile
            </p>
          </div>
        </div>
        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto">
          {{ badges.length }} Badges Unlocked
        </span>
      </div>

      <!-- Badges 2-column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div
          v-for="badge in badges"
          :key="badge.name"
          class="rounded-xl border border-slate-200/90 bg-white p-4 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- Deep navy badge ribbon icon -->
            <div class="size-9 rounded-lg bg-[#002845] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <BadgeMedalIcon class="size-5 text-white" />
            </div>
            <div class="min-w-0">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {{ getBadgeLevelLabel(badge.name) }}
              </span>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {{ badge.name }}
              </h4>
            </div>
          </div>

          <span class="text-xs text-slate-400 font-medium shrink-0">
            {{ formatDate(badge.unlockedAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 3. Attempt History Section (Matching reference image) -->
    <div v-if="sortedHistory.length > 0" class="space-y-4 pt-1">
      <!-- Section Subheading -->
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-slate-900">
          Attempt History
        </h3>
        <span class="text-xs text-slate-500 font-medium">
          Showing {{ sortedHistory.length }} of {{ sortedHistory.length }} attempts
        </span>
      </div>

      <!-- Attempt Cards List -->
      <div class="space-y-4">
        <div
          v-for="(record, index) in sortedHistory"
          :key="record.id ?? index"
          class="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-4 hover:border-slate-300 transition-all"
        >
          <!-- Card Header: Title and Attempt Pill -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <h4 class="text-base sm:text-lg font-bold text-slate-900">
              Level {{ record.levelNumber }}: {{ getLevelName(record.levelNumber) }} Exam
            </h4>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Attempt #{{ sortedHistory.length - index }}
            </span>
          </div>

          <!-- 3-Column Metrics Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
            <!-- Column 1: Date & Time -->
            <div>
              <span class="text-xs text-slate-400 block font-medium">Date & Time</span>
              <p class="font-bold text-slate-900 mt-1">
                {{ formatDateTime(record.attemptDateTime) }}
              </p>
            </div>

            <!-- Column 2: Score Achieved -->
            <div>
              <span class="text-xs text-slate-400 block font-medium">Score Achieved</span>
              <p class="font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                <span>{{ record.score }} / {{ record.totalScore }}</span>
                <span
                  class="text-xs font-semibold"
                  :class="record.passed ? 'text-emerald-600' : 'text-rose-600'"
                >
                  ({{ calculatePercentage(record.score, record.totalScore) }}%)
                </span>
              </p>
            </div>

            <!-- Column 3: Result Status (Clean, no dot, no robotic text) -->
            <div>
              <span class="text-xs text-slate-400 block font-medium">Status</span>
              <p
                class="font-semibold text-xs sm:text-sm mt-1"
                :class="record.passed ? 'text-emerald-700' : 'text-rose-600'"
              >
                {{ record.passed ? 'Passed' : 'Not Passed' }}
              </p>
            </div>
          </div>

          <!-- Card Footer: Awarded Badge & View Certificate Link -->
          <div
            v-if="record.badgeName"
            class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600"
          >
            <div class="flex items-center gap-1.5 font-semibold text-slate-700">
              <BadgeMedalIcon class="size-4 text-amber-600 shrink-0" />
              <span>Awarded Badge: <strong class="text-slate-900 font-bold">{{ record.badgeName }}</strong></span>
            </div>

            <RouterLink
              to="/profile/badges"
              class="font-semibold text-[#002845] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Certificate</span>
              <span>&rarr;</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center py-14"
    >
      <div class="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-800">No Exam Attempts Recorded</h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        You haven't taken any progression examinations yet. Complete learning materials and take the exam to unlock new levels and badges.
      </p>

      <div class="mt-5">
        <RouterLink
          to="/exam"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002845] hover:bg-[#001830] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <span>Start Level Exam</span>
          <span>&rarr;</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLevelName } from '@/utils/levelDisplay'
import BadgeMedalIcon from '@/shared/components/icons/BadgeMedalIcon.vue'
import type { UserExamHistoryItem } from '@/services/UserService'

const userStore = useUserStore()

const examHistory = computed<UserExamHistoryItem[]>(() => userStore.examHistories)
const badges = computed(() => userStore.badges)

const canTakeExam = computed(() => userStore.currentUserLevel < 4)

const sortedHistory = computed(() => {
  return [...examHistory.value].sort((a, b) => {
    const timeA = new Date(a.attemptDateTime).getTime()
    const timeB = new Date(b.attemptDateTime).getTime()
    return timeB - timeA
  })
})

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

// Helper to label badge level simply
function getBadgeLevelLabel(badgeName: string): string {
  if (/level 1|explorer/i.test(badgeName)) return 'LEVEL 1'
  if (/level 2|achiever/i.test(badgeName)) return 'LEVEL 2'
  if (/level 3|innovator/i.test(badgeName)) return 'LEVEL 3'
  if (/level 4|master/i.test(badgeName)) return 'LEVEL 4'
  return 'CERTIFICATION'
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Nov 1, 2026'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function calculatePercentage(score: number, total: number): number {
  if (!total || total <= 0) return 0
  return Math.round((score / total) * 100)
}
</script>
