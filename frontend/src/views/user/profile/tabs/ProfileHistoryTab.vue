<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-xl font-extrabold text-[#00385A]">Certification Exam History</h3>
        <p class="text-xs font-medium text-slate-500 mt-0.5">
          Review your past certification exam scores and attempts.
        </p>
      </div>
      <span class="text-xs font-bold text-slate-500">
        Total attempts: {{ userStore.examHistories.length }}
      </span>
    </div>

    <!-- ExamHistory shared component -->
    <ExamHistory />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import ExamHistory from '@/shared/components/ExamHistory.vue'

const userStore = useUserStore()
</script>
