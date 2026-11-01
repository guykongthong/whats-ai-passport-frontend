<template>
  <div class="flex flex-col gap-6">
    <!-- Header with Section Title -->
    <div>
      <h3 class="text-lg font-bold text-white">Level & Exam History</h3>
      <p class="text-xs text-white/60">
        Review the user's current qualification level and historical exam attempts with scores and earned badges.
      </p>
    </div>

    <!-- Current Level & Performance Summary Cards -->
    <div v-if="user" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Current Level Card -->
      <div class="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-white/60">Current Level</span>
        <div class="flex items-center gap-3">
          <span
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-semibold inline-block',
              getLevelClasses(user.currentLevel),
            ]"
          >
            Level {{ user.currentLevel }}: {{ getLevelName(user.currentLevel) }}
          </span>
        </div>
      </div>

      <!-- Total Attempts Card -->
      <div class="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-white/60">Total Attempts</span>
        <div class="text-2xl font-bold text-white">
          {{ examHistory.length }}
          <span class="text-xs font-normal text-white/60">attempts</span>
        </div>
      </div>

      <!-- Passed Attempts Card -->
      <div class="bg-white/10 rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-white/60">Passed Exams</span>
        <div class="text-2xl font-bold text-emerald-400">
          {{ passedAttemptsCount }}
          <span class="text-xs font-normal text-white/60">passed</span>
        </div>
      </div>
    </div>

    <!-- Historical Exam Attempts Table -->
    <div
      v-if="examHistory.length > 0"
      class="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm"
    >
      <table class="w-full text-left text-sm text-white/90">
        <thead class="bg-white/10 text-xs uppercase tracking-wider text-white/70 border-b border-white/10">
          <tr>
            <th scope="col" class="py-3.5 px-4 font-semibold">Date & Time</th>
            <th scope="col" class="py-3.5 px-4 font-semibold">Level Evaluated</th>
            <th scope="col" class="py-3.5 px-4 font-semibold">Score</th>
            <th scope="col" class="py-3.5 px-4 font-semibold">Result</th>
            <th scope="col" class="py-3.5 px-4 font-semibold">Badge Earned</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          <tr
            v-for="record in examHistory"
            :key="record.id"
            class="hover:bg-white/5 transition-colors"
          >
            <!-- 1. Attempt Date & Time -->
            <td class="py-4 px-4 whitespace-nowrap font-medium text-white">
              {{ formatDateTime(record.attemptDateTime) }}
            </td>

            <!-- 2. Level Evaluated (e.g. Level 1 -> Level 2) -->
            <td class="py-4 px-4 whitespace-nowrap">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20">
                {{ formatLevelEvaluated(record.levelNumber) }}
              </span>
            </td>

            <!-- 3. Score Obtained (e.g. 4 / 5) -->
            <td class="py-4 px-4 whitespace-nowrap font-bold text-white">
              {{ record.score }} / {{ record.totalScore }}
            </td>

            <!-- 4. Result Status Badge ("PASSED" green or "FAILED" red) -->
            <td class="py-4 px-4 whitespace-nowrap">
              <span
                v-if="record.passed"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              >
                <span class="size-1.5 rounded-full bg-emerald-400" />
                PASSED
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30"
              >
                <span class="size-1.5 rounded-full bg-rose-400" />
                FAILED
              </span>
            </td>

            <!-- 5. Badge Earned from Attempt -->
            <td class="py-4 px-4 whitespace-nowrap">
              <span
                v-if="record.passed && (record.badgeName || getLevelName(record.levelNumber))"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30"
              >
                <span>🏆</span>
                <span>{{ record.badgeName || getLevelName(record.levelNumber) }}</span>
              </span>
              <span v-else class="text-white/40 text-xs">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/5 rounded-2xl p-8 border border-white/10 text-center py-14 flex flex-col items-center justify-center gap-3"
    >
      <div class="size-12 rounded-full bg-white/10 flex items-center justify-center text-white/40">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <p class="text-base font-semibold text-white/90">No exam attempts found</p>
        <p class="text-xs text-white/50 mt-1">This user has not completed any level examinations yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminUserStore } from '@/stores/adminUser'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const adminUserStore = useAdminUserStore()

const user = computed(() => adminUserStore.selectedUser)
const examHistory = computed(() => adminUserStore.userExamHistory || [])

const passedAttemptsCount = computed(() => {
  return examHistory.value.filter((record) => record.passed).length
})

onMounted(async () => {
  const userId = Number(route.params.id)
  if (Number.isInteger(userId) && userId > 0 && examHistory.value.length === 0) {
    await adminUserStore.fetchUserHistory(userId)
  }
})

function formatLevelEvaluated(levelNumber: number): string {
  const fromLevel = Math.max(1, levelNumber - 1)
  return `Level ${fromLevel} -> Level ${levelNumber}`
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
</script>
