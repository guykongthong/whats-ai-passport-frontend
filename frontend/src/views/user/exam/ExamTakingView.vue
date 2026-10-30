<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <!-- Top Navigation / Breadcrumb -->
        <div class="flex items-center justify-between">
          <RouterLink
            to="/elearning"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#00385A] transition-colors"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to eLearning</span>
          </RouterLink>

          <!-- Target Level Indicator -->
          <span
            v-if="!isTopLevel"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
            :class="getLevelClasses(targetLevelNumber)"
          >
            <span>Target Level {{ targetLevelNumber }}: {{ getLevelName(targetLevelNumber) }}</span>
          </span>
        </div>

        <!-- Top Level (Level 4) Notice State -->
        <div
          v-if="isTopLevel"
          class="rounded-3xl border border-amber-200 bg-amber-50/80 p-8 text-center space-y-4 shadow-xs"
        >
          <div class="size-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-2xl font-bold">
            🏆
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#00385A]">
            Maximum Level Reached
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            You are currently at Level 4 (Platinum), the highest competency tier. There are no further advancement exams available.
          </p>
          <div class="pt-2">
            <RouterLink
              to="/dashboard"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00385A] text-white hover:bg-[#002840] text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <span>Return to Dashboard</span>
            </RouterLink>
          </div>
        </div>

        <!-- Exam View Container -->
        <div v-else class="space-y-6">
          <!-- Exam Instructions & Rules Header Card -->
          <section
            aria-label="Exam Instructions"
            class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#00385A]">
                  Competency Examination
                </span>
                <h1 class="text-xl sm:text-2xl font-black text-[#00385A] tracking-tight">
                  Level {{ targetLevelNumber }} Advancement Exam
                </h1>
              </div>

              <!-- Pass Criteria & Total Questions Pills -->
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-semibold">
                  Total Questions: <span class="font-bold text-sky-900">{{ questions.length }}</span>
                </div>
                <div class="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
                  Pass Criteria: <span class="font-bold text-emerald-900">{{ passCriteria }} / {{ questions.length }} correct</span>
                </div>
              </div>
            </div>

            <!-- Instructions Bullet Points -->
            <div class="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
              <p class="font-bold text-slate-700">Instructions & Guidelines:</p>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Read each question carefully and select one choice per question.</li>
                <li>Your answers will be graded immediately upon submission.</li>
                <li>Passing this exam immediately upgrades your level to Level {{ targetLevelNumber }} and unlocks corresponding badges.</li>
              </ul>
            </div>
          </section>

          <!-- Questions Container -->
          <section
            aria-label="Questions Section"
            class="space-y-6"
          >
            <!-- Loading Skeleton -->
            <div v-if="isLoading" class="space-y-4">
              <div
                v-for="n in 3"
                :key="n"
                class="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4 animate-pulse"
              >
                <div class="h-5 w-28 bg-slate-200 rounded-lg" />
                <div class="h-6 w-3/4 bg-slate-200 rounded-lg" />
                <div class="space-y-2 pt-2">
                  <div v-for="i in 4" :key="i" class="h-12 bg-slate-100 rounded-2xl" />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="questions.length === 0"
              class="rounded-3xl border border-slate-200/90 bg-white p-12 text-center text-slate-500 shadow-xs"
            >
              <svg class="size-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-base font-bold text-slate-700">No exam questions available</p>
              <p class="text-xs text-slate-400 mt-1">Please check back later or contact your administrator.</p>
            </div>

            <!-- Question Cards -->
            <div
              v-else
              v-for="(question, qIndex) in questions"
              :key="question.id"
              class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4 transition-all"
            >
              <!-- Question Header -->
              <div class="flex items-start justify-between gap-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#00385A]/10 text-[#00385A] text-xs font-bold">
                  Question {{ qIndex + 1 }} of {{ questions.length }}
                </span>
              </div>

              <!-- Question Text -->
              <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {{ question.questionText }}
              </h3>

              <!-- Choices Options (A, B, C, D) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div
                  v-for="(choice, cIndex) in question.choices"
                  :key="cIndex"
                  class="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/60 transition-all text-xs sm:text-sm text-slate-800"
                >
                  <span
                    class="size-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-slate-200 text-slate-700"
                  >
                    {{ ['A', 'B', 'C', 'D'][cIndex] ?? cIndex + 1 }}
                  </span>
                  <span class="leading-relaxed">{{ choice }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ExamService, { type ContractQuestion, type ExamPaperResponse } from '@/services/ExamService'
import type { ExamQuestion } from '@/types/ExamContent'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { questions as mockQuestionsData } from '@/data/questions'

const userStore = useUserStore()

const isLoading = ref(false)
const passCriteria = ref(3)
const questions = ref<ContractQuestion[]>([])

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)
const isTopLevel = computed<boolean>(() => currentLevelNumber.value >= 4)
const targetLevelNumber = computed<number>(() => {
  return Math.min(currentLevelNumber.value + 1, 4)
})

async function fetchExamQuestions() {
  if (isTopLevel.value) {
    return
  }

  isLoading.value = true
  try {
    const res = await ExamService.getExamQuestions()
    if (res?.data) {
      if ('questions' in res.data && Array.isArray((res.data as ExamPaperResponse).questions)) {
        const paper = res.data as ExamPaperResponse
        questions.value = paper.questions
        if (paper.passCriteria !== undefined) {
          passCriteria.value = paper.passCriteria
        }
      } else if (Array.isArray(res.data)) {
        questions.value = (res.data as ExamQuestion[]).map((q) => ({
          id: q.id,
          questionText: q.question,
          choices: q.choices,
        }))
      }
    }
  } catch (err: unknown) {
    console.info('Backend getExamQuestions offline, fallback to mock questions:', err)
  } finally {
    isLoading.value = false
  }

  // Fallback to local mock data if questions array is still empty
  if (questions.value.length === 0) {
    const targetLvlPrefix = `l${targetLevelNumber.value}-`
    const filtered = mockQuestionsData.filter((q) => String(q.id).startsWith(targetLvlPrefix))
    const selected = filtered.length > 0 ? filtered : mockQuestionsData.slice(0, 5)

    questions.value = selected.map((q) => ({
      id: q.id,
      questionText: q.question,
      choices: q.choices,
    }))
    passCriteria.value = 3
  }
}

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  await fetchExamQuestions()
})
</script>
