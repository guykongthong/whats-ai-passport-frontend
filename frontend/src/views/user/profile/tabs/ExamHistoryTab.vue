<template>
  <div class="space-y-6">
    <!-- Tab Intro / Heading -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800">Exam History & Certification</h2>
        <p class="text-xs sm:text-sm text-slate-500">
          Review all your past examination attempts, scores, and unlocked badges.
        </p>
      </div>

      <RouterLink
        v-if="canTakeExam"
        to="/exam"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00385A] hover:bg-[#002a43] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
      >
        <span>Take Next Exam</span>
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </RouterLink>
    </div>

    <!-- Badges Showcase Section -->
    <div v-if="badges.length > 0" class="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 to-yellow-50/30 p-5">
      <div class="flex items-center gap-2 mb-3">
        <TrophyIcon class="size-5 text-amber-700" />
        <h3 class="text-sm font-bold text-amber-900">Earned Badges & Achievements</h3>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <div
          v-for="badge in badges"
          :key="badge.name"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-semibold shadow-2xs"
        >
          <img
            v-if="badge.imageUrl"
            :src="badge.imageUrl"
            :alt="badge.name"
            class="size-5 rounded-full object-cover"
          />
          <BadgeMedalIcon v-else class="size-4 text-amber-600" />
          <span>{{ badge.name }}</span>
          <span v-if="badge.unlockedAt" class="text-[10px] text-amber-600/80 font-normal">
            ({{ formatDate(badge.unlockedAt) }})
          </span>
        </div>
      </div>
    </div>

    <!-- Exam History Records List -->
    <div v-if="sortedHistory.length > 0" class="space-y-3.5">
      <div
        v-for="(record, index) in sortedHistory"
        :key="record.id ?? index"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <!-- Level Tag -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold inline-block shadow-2xs',
                getLevelClasses(record.levelNumber),
              ]"
            >
              Level {{ record.levelNumber }}: {{ getLevelName(record.levelNumber) }} Exam
            </span>

            <span class="text-xs text-slate-400">
              Attempt #{{ sortedHistory.length - index }}
            </span>
          </div>

          <!-- Result Tag -->
          <span
            :class="[
              'text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border',
              record.passed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200',
            ]"
          >
            <span
              :class="[
                'size-1.5 rounded-full',
                record.passed ? 'bg-emerald-500' : 'bg-rose-500',
              ]"
            />
            {{ record.passed ? 'PASSED' : 'FAILED' }}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
          <div>
            <span class="text-slate-400 block text-xs">Date & Time</span>
            <span class="font-semibold text-slate-700">
              {{ formatDateTime(record.attemptDateTime) }}
            </span>
          </div>

          <div>
            <span class="text-slate-400 block text-xs">Score Achieved</span>
            <div class="flex items-baseline gap-1.5 font-semibold text-slate-800">
              <span>{{ record.score }} / {{ record.totalScore }}</span>
              <span class="text-xs text-slate-500 font-normal">
                ({{ calculatePercentage(record.score, record.totalScore) }}%)
              </span>
            </div>
          </div>

          <div>
            <span class="text-slate-400 block text-xs">Progression Status</span>
            <span
              :class="[
                'font-semibold text-xs',
                record.passed ? 'text-emerald-700' : 'text-slate-600',
              ]"
            >
              {{ record.passed ? 'Level Criteria Met' : 'Retake Required' }}
            </span>
          </div>
        </div>

        <!-- Badge Awarded Notification -->
        <div
          v-if="record.badgeName"
          class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50/50 -mx-5 -mb-5 px-5 py-2.5 rounded-b-2xl"
        >
          <BadgeMedalIcon class="size-4 text-amber-600 shrink-0" />
          <span>Awarded Badge: <strong class="font-bold text-amber-900">{{ record.badgeName }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center py-14"
    >
      <div class="size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
        <svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-base font-bold text-slate-700">No Exam Attempts Recorded</h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        You haven't taken any progression examinations yet. Complete learning materials and take the exam to unlock new levels and badges.
      </p>

      <div class="mt-5">
        <RouterLink
          to="/exam"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00385A] hover:bg-[#002a43] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>Start Level Exam</span>
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'
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

function calculatePercentage(score: number, total: number): number {
  if (!total || total <= 0) return 0
  return Math.round((score / total) * 100)
}
</script>
