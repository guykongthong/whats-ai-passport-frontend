<template>
  <AdminPageLayout title="Exam Questions" main-padding="!max-w-[1200px] px-4 sm:px-8">
    <div class="w-full flex flex-col gap-6 -mt-3">
      <!-- Top Action Bar: Subheader -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 gap-4">
        <div>
          <p class="text-xs sm:text-sm text-white/80">
            Manage multiple-choice exam questions, answer choices, and passing answers categorized by level.
          </p>
          <p class="text-[11px] text-white/60 mt-0.5">
            Students take these certification exams to upgrade their competency levels.
          </p>
        </div>
      </div>

      <!-- Level Tab Switching Navigation: [ Level 1 Exam ] | [ Level 2 Exam ] | [ Level 3 Exam ] -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="inline-flex p-1 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-md gap-1">
          <button
            v-for="tab in levelTabs"
            :key="tab.level"
            type="button"
            :class="[
              'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm rounded-xl font-bold transition-all cursor-pointer select-none',
              selectedLevel === tab.level
                ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent',
            ]"
            @click="switchLevel(tab.level)"
          >
            <span
              :class="[
                'size-2 rounded-full shrink-0',
                tab.level === 1 ? 'bg-[#C1D7AE]' : tab.level === 2 ? 'bg-[#F2D794]' : 'bg-[#E5A88B]',
              ]"
            />
            <span>{{ tab.label }}</span>
            <span class="text-[11px] font-normal opacity-70">({{ tab.target }})</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-16 border border-white/20 flex flex-col items-center justify-center gap-3 text-white shadow-xl"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/80">Loading Level {{ selectedLevel }} questions...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-8 text-center text-sm shadow-xl"
      >
        <p class="font-semibold text-base">{{ error }}</p>
        <div class="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
            @click="fetchQuestions(selectedLevel)"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Content Area Placeholder -->
      <div v-else class="text-white/70 text-sm">
        Questions loaded for Level {{ selectedLevel }}: {{ questions.length }} items
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import AdminQuestionService from '@/services/AdminQuestionService'
import type { QuestionAdmin } from '@/types/admin'

interface LevelTab {
  level: number
  label: string
  target: string
}

const levelTabs: LevelTab[] = [
  { level: 1, label: 'Level 1 Exam', target: 'Explorer' },
  { level: 2, label: 'Level 2 Exam', target: 'Achiever' },
  { level: 3, label: 'Level 3 Exam', target: 'Innovator' },
]

const selectedLevel = ref<number>(1)
const questions = ref<QuestionAdmin[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

async function fetchQuestions(levelNumber: number) {
  loading.value = true
  error.value = null

  try {
    const response = await AdminQuestionService.getQuestionsByLevel(levelNumber)
    questions.value = response.data || []
  } catch (err: unknown) {
    console.error(`Failed to fetch questions for level ${levelNumber}:`, err)
    error.value = `Failed to load questions for Level ${levelNumber} Exam. Please check your network connection or login session.`
    questions.value = []
  } finally {
    loading.value = false
  }
}

function switchLevel(levelNumber: number) {
  if (selectedLevel.value === levelNumber) return
  selectedLevel.value = levelNumber
  fetchQuestions(levelNumber)
}

onMounted(() => {
  fetchQuestions(selectedLevel.value)
})
</script>
