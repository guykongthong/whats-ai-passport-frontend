<template>
  <div class="w-full">
    <div v-if="paginatedRecords.length > 0" class="flex flex-col gap-4">
      <div
        v-for="record in paginatedRecords"
        :key="record.id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <!-- Left: Details -->
        <div>
          <h3 class="font-display text-lg font-bold text-button-primary">
            Level {{ record.level }} Certification Exam
          </h3>
          <div class="mt-2 flex items-center gap-2 text-sm font-medium text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
            <span>{{ formatDate(record.completedAt) }}</span>
            <span class="ml-2 px-2 py-0.5 rounded bg-gray-100 text-xs font-bold text-gray-600 whitespace-nowrap">
              Score: {{ record.score }}%
            </span>
          </div>
        </div>

        <!-- Right: Status Badge -->
        <StatusBadge :status="record.pass ? 'Passed' : 'Failed'" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <p class="font-display text-lg font-bold text-gray-500">No exam history found.</p>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center">
      <BasePagination
        :total-items="userRecords.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @page-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch} from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useExamStore } from '@/stores/examStore'
import BasePagination from '@/shared/components/BasePagination.vue'
import StatusBadge from '@/shared/components/StatusBadge.vue'
import type { ExamRecord } from '@/types/ExamContent'
 
const props = defineProps<{
  userId?: string
}>()

const authStore = useAuthStore()
const examStore = useExamStore()

const targetUserId = computed(() => props.userId || authStore.currentUser?.id)

// get all records for this user, sorted by newest first
const userRecords = computed<ExamRecord[]>(() => {
  if (!targetUserId.value) return []
  return examStore.records
    .filter((r) => r.userId === targetUserId.value)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
})

// Pagination
const pageSize = 5
const currentPage = ref(1)

watch(() => props.userId, () => {
  currentPage.value = 1
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return userRecords.value.slice(start, end)
})

function formatDate(isoDate: string) {
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  })
}
</script>
