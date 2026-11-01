<template>
  <div class="space-y-4">
    <h3 class="text-[20px] font-black mb-6">Level Examination Logs</h3>
    
    <div v-if="userExamHistory.length > 0" class="flex flex-col gap-4">
      <div 
        v-for="record in userExamHistory" 
        :key="record.id"
        class="bg-white/10 rounded-2xl p-5 border border-white/20 max-w-[500px]"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <span :class="['px-2.5 py-1 rounded-md text-xs font-semibold inline-block', getLevelClasses(record.levelNum)]">
            Level {{ record.levelNum }}: {{ getLevelName(record.levelNum) }}
          </span>
          <span :class="['text-sm font-black', record.pass ? 'text-green-400' : 'text-red-400']">
            Result: {{ record.pass ? 'Passed' : 'Failed' }}
          </span>
        </div>
        <div class="text-sm font-bold text-white/80 space-y-1">
          <div>Date & Time: {{ formatDate(record.completedAt) }}</div>
          <div>Score: {{ record.score }}/100</div>
        </div>
      </div>
    </div>
    
    <div v-else class="bg-black/10 rounded-xl p-5 border border-white/10 text-center py-10">
      <p class="text-white/60 font-bold">No exam attempts found for this user.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import type { ExamRecord } from '@/types/ExamContent'

const examRecords: ExamRecord[] = []



const route = useRoute()
const authStore = useAuthStore()

const userExamHistory = computed(() => {
  const user = authStore.users.find(u => u.id === route.params.id)
  if (!user) return []
  return examRecords
    .filter(record => record.userId === user.id)
    .map(record => {
      let levelNum = Number(user.level || 1)
      if (record.questionsAsked && record.questionsAsked[0]) {
        const firstQ = record.questionsAsked[0].questionID
        if (firstQ.startsWith('l1')) levelNum = 1
        if (firstQ.startsWith('l2')) levelNum = 2
        if (firstQ.startsWith('l3')) levelNum = 3
        if (firstQ.startsWith('l4')) levelNum = 4
      }
      return {
        ...record,
        levelNum
      }
    })
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
</script>
