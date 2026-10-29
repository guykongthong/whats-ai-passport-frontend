<template>
  <div class="flex flex-col gap-6">
    <div>
      <h3 class="text-lg font-bold text-white">Level Examination Logs</h3>
      <p class="text-xs text-white/60">View history of exam attempts and achieved scores.</p>
    </div>

    <!-- Exam History Records List -->
    <div v-if="examHistory.length > 0" class="flex flex-col gap-3.5 max-w-2xl">
      <div
        v-for="record in examHistory"
        :key="record.id"
        class="bg-white/10 rounded-2xl p-5 border border-white/10 flex flex-col gap-3"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold inline-block',
              getLevelClasses(record.levelNumber),
            ]"
          >
            Level {{ record.levelNumber }}: {{ getLevelName(record.levelNumber) }}
          </span>

          <span
            :class="[
              'text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5',
              record.passed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
            ]"
          >
            <span :class="['size-1.5 rounded-full', record.passed ? 'bg-emerald-400' : 'bg-rose-400']" />
            {{ record.passed ? 'Passed' : 'Failed' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-white/80">
          <div>
            <span class="text-white/50 block text-xs">Date & Time</span>
            <span class="font-semibold">{{ formatDateTime(record.attemptDateTime) }}</span>
          </div>

          <div>
            <span class="text-white/50 block text-xs">Score</span>
            <span class="font-semibold">{{ record.score }} / {{ record.totalScore }}</span>
          </div>
        </div>

        <div v-if="record.badgeName" class="pt-2 border-t border-white/10 text-xs text-amber-300 flex items-center gap-1.5">
          <span>🏆 Unlocked Badge: <strong>{{ record.badgeName }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white/5 rounded-2xl p-8 border border-white/10 text-center max-w-2xl py-12"
    >
      <div class="size-12 rounded-full bg-white/10 flex items-center justify-center text-white/40 mx-auto mb-3">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-white/90">No exam attempts found</p>
      <p class="text-xs text-white/50 mt-1">This user has not completed any level examinations yet.</p>
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

const examHistory = computed(() => adminUserStore.userExamHistory)

onMounted(async () => {
  const userId = Number(route.params.id)
  if (Number.isInteger(userId) && userId > 0) {
    await adminUserStore.fetchUserHistory(userId)
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
</script>
