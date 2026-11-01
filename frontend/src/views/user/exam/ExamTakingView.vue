<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <!-- Exam Results Modal / Overlay (#43) -->
        <ExamResultModal
          v-if="examResultModal"
          :is-open="Boolean(examResultModal)"
          :result="examResultModal"
          @retry="resetExam"
          @close="examResultModal = null"
        />

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
          <div class="size-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
            <TrophyIcon class="size-8" />
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

            <!-- Answer Progress Bar & Quick Jump Navigator (FE-USER-17) -->
            <div v-if="questions.length > 0" class="pt-2 space-y-3">
              <div class="flex items-center justify-between text-xs font-semibold">
                <span class="text-slate-600">
                  Exam Progress: <strong class="text-[#00385A]">{{ answeredCount }} / {{ questions.length }} Answered</strong>
                </span>
                <span class="text-[#00385A] font-bold">{{ progressPercent }}%</span>
              </div>

              <!-- Progress Track -->
              <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  class="h-full bg-[#00385A] transition-all duration-300 rounded-full"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>

              <!-- Question Jump Navigator -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-[11px] font-medium text-slate-400 mr-1">Questions:</span>
                <button
                  v-for="(q, idx) in questions"
                  :key="q.id"
                  type="button"
                  @click="scrollToQuestion(idx)"
                  class="size-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                  :class="[
                    isQuestionAnswered(q.id)
                      ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  ]"
                  :title="`Jump to question ${idx + 1}`"
                >
                  {{ idx + 1 }}
                </button>
              </div>
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
              :id="`question-${qIndex}`"
              class="rounded-3xl border bg-white p-6 sm:p-7 shadow-xs space-y-4 transition-all"
              :class="[
                isQuestionAnswered(question.id)
                  ? 'ring-2 ring-[#00385A]/15 border-[#00385A]/40'
                  : showUnansweredErrors
                    ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-400/30'
                    : 'border-slate-200/90'
              ]"
            >
              <!-- Question Header -->
              <div class="flex items-start justify-between gap-3">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                  :class="[
                    !isQuestionAnswered(question.id) && showUnansweredErrors
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-[#00385A]/10 text-[#00385A]'
                  ]"
                >
                  Question {{ qIndex + 1 }} of {{ questions.length }}
                </span>

                <span
                  v-if="isQuestionAnswered(question.id)"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full"
                >
                  <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Answered
                </span>
                <span
                  v-else
                  class="text-[11px] font-medium"
                  :class="showUnansweredErrors ? 'text-rose-600 font-bold' : 'text-slate-400'"
                >
                  {{ showUnansweredErrors ? 'Required' : 'Unanswered' }}
                </span>
              </div>

              <!-- Question Text -->
              <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {{ question.questionText }}
              </h3>

              <!-- Choices Options (A, B, C, D) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  v-for="(choice, cIndex) in question.choices"
                  :key="cIndex"
                  type="button"
                  @click="selectChoice(question.id, cIndex)"
                  class="flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all cursor-pointer group"
                  :class="[
                    selectedAnswers[question.id] === cIndex
                      ? 'bg-[#00385A] text-white border-[#00385A] shadow-sm ring-2 ring-[#00385A]/20'
                      : 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-800 border-slate-200/80 hover:border-slate-300'
                  ]"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span
                      class="size-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                      :class="[
                        selectedAnswers[question.id] === cIndex
                          ? 'bg-white text-[#00385A]'
                          : 'bg-slate-200 text-slate-700 group-hover:bg-[#00385A]/10 group-hover:text-[#00385A]'
                      ]"
                    >
                      {{ ['A', 'B', 'C', 'D'][cIndex] ?? cIndex + 1 }}
                    </span>
                    <span class="leading-relaxed">{{ choice }}</span>
                  </div>

                  <!-- Radio Selection Icon Indicator -->
                  <div
                    class="size-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2"
                    :class="[
                      selectedAnswers[question.id] === cIndex
                        ? 'border-white bg-white'
                        : 'border-slate-300 bg-transparent group-hover:border-[#00385A]'
                    ]"
                  >
                    <div
                      v-if="selectedAnswers[question.id] === cIndex"
                      class="size-2 rounded-full bg-[#00385A]"
                    />
                  </div>
                </button>
              </div>
            </div>
          </section>

          <!-- Validation Warning Banner -->
          <div
            v-if="validationError"
            class="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between shadow-xs animate-shake"
          >
            <div class="flex items-center gap-2.5">
              <span class="size-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">!</span>
              <span>{{ validationError }}</span>
            </div>
            <button
              type="button"
              @click="validationError = null"
              class="text-rose-500 hover:text-rose-800 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>

          <!-- Floating Sticky Action / Submission Bar (FE-USER-17 & FE-USER-18) -->
          <aside
            v-if="questions.length > 0"
            aria-label="Exam Actions"
            class="sticky bottom-6 z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <!-- Counter Indicator & Unanswered Counter Badge -->
              <div class="relative">
                <div
                  class="size-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
                  :class="isExamComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'"
                >
                  {{ answeredCount }}/{{ questions.length }}
                </div>
                <!-- Unanswered Question Counter Badge (#42) -->
                <span
                  v-if="!isExamComplete"
                  class="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-xs animate-pulse"
                  title="Unanswered questions count"
                >
                  {{ remainingCount }}
                </span>
              </div>

              <div>
                <p class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{{ isExamComplete ? 'All questions answered!' : `${remainingCount} question(s) remaining` }}</span>
                  <span
                    v-if="!isExamComplete"
                    class="inline-flex items-center px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold"
                  >
                    Incomplete
                  </span>
                </p>
                <p class="text-[11px] text-slate-500">
                  {{ isExamComplete ? 'You are ready to submit your exam.' : 'Complete every question to enable submission.' }}
                </p>
              </div>
            </div>

            <!-- Submit Button with Tooltip and Disabled State Visual Indicator (#42) -->
            <div class="flex items-center gap-3 w-full sm:w-auto relative group">
              <!-- Tooltip on Hover when Incomplete -->
              <div
                v-if="!isExamComplete"
                class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center justify-center px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-medium shadow-md whitespace-nowrap pointer-events-none z-30 transition-all"
              >
                <span>Please answer all questions before submitting ({{ answeredCount }}/{{ questions.length }} completed)</span>
                <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>

              <button
                type="button"
                @click="submitExamPrompt"
                :disabled="isSubmitting || !isExamComplete"
                :title="!isExamComplete ? `Please answer all questions before submitting (${answeredCount}/${questions.length} completed)` : undefined"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
                :class="[
                  isExamComplete && !isSubmitting
                    ? 'bg-[#00385A] hover:bg-[#002840] text-white cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 border border-slate-300/80 cursor-not-allowed shadow-none'
                ]"
              >
                <!-- Lock Icon when Incomplete / Spinner when Submitting -->
                <span
                  v-if="isSubmitting"
                  class="size-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                />
                <svg
                  v-else-if="!isExamComplete"
                  class="size-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>

                <span>Submit Exam Answers</span>

                <svg
                  v-if="isExamComplete && !isSubmitting"
                  class="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ExamResultModal from '@/components/user/ExamResultModal.vue'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'
import ExamService, {
  type ContractQuestion,
  type ExamPaperResponse,
  type ExamSubmitResponse,
  type ExamSubmissionPayload
} from '@/services/ExamService'
import type { ExamQuestion } from '@/types/ExamContent'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const userStore = useUserStore()

const isLoading = ref(false)
const passCriteria = ref(3)
const questions = ref<ContractQuestion[]>([])
const selectedAnswers = ref<Record<string | number, number>>({})
const isSubmitting = ref(false)
const validationError = ref<string | null>(null)
const showUnansweredErrors = ref(false)
const examResultModal = ref<ExamSubmitResponse | null>(null)

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)
const isTopLevel = computed<boolean>(() => currentLevelNumber.value >= 4)
const targetLevelNumber = computed<number>(() => {
  return Math.min(currentLevelNumber.value + 1, 4)
})

const answeredCount = computed<number>(() => {
  return Object.keys(selectedAnswers.value).length
})

const remainingCount = computed<number>(() => {
  return Math.max(0, questions.value.length - answeredCount.value)
})

const progressPercent = computed<number>(() => {
  if (questions.value.length === 0) return 0
  return Math.round((answeredCount.value / questions.value.length) * 100)
})

// Scope #42: isExamComplete checks if answered count equals total questions
const isExamComplete = computed<boolean>(() => {
  return questions.value.length > 0 && answeredCount.value === questions.value.length
})

function isQuestionAnswered(questionId: string | number): boolean {
  return selectedAnswers.value[questionId] !== undefined
}

function selectChoice(questionId: string | number, choiceIndex: number) {
  selectedAnswers.value[questionId] = choiceIndex
  validationError.value = null
  if (isExamComplete.value) {
    showUnansweredErrors.value = false
  }
}

function scrollToQuestion(qIndex: number) {
  const el = document.getElementById(`question-${qIndex}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function submitExamPrompt() {
  if (!isExamComplete.value) {
    showUnansweredErrors.value = true
    validationError.value = `Please answer all questions before submitting. (${questions.value.length - answeredCount.value} remaining)`
    const firstUnansweredIndex = questions.value.findIndex((q) => !isQuestionAnswered(q.id))
    if (firstUnansweredIndex !== -1) {
      scrollToQuestion(firstUnansweredIndex)
    }
    return
  }

  showUnansweredErrors.value = false
  isSubmitting.value = true
  validationError.value = null

  const payload: ExamSubmissionPayload = {
    levelNumber: targetLevelNumber.value,
    answers: questions.value.map((q) => ({
      questionId: q.id,
      selectedChoice: selectedAnswers.value[q.id] ?? 0,
    })),
  }

  try {
    const res = await ExamService.submitExam(payload)
    if (res?.data) {
      const data = res.data as ExamSubmitResponse
      examResultModal.value = {
        score: data.score ?? 0,
        totalScore: data.totalScore ?? questions.value.length,
        passCriteria: data.passCriteria ?? passCriteria.value,
        passed: Boolean(data.passed),
        oldLevel: data.oldLevel ?? currentLevelNumber.value,
        newLevel: data.newLevel ?? (data.passed ? targetLevelNumber.value : currentLevelNumber.value),
        badgeUnlocked: data.badgeUnlocked ?? null,
        attemptDateTime: data.attemptDateTime ?? new Date().toISOString(),
      }

      // Record attempt and badge into exam history (#44)
      userStore.recordExamAttempt(
        {
          id: Date.now(),
          levelNumber: targetLevelNumber.value,
          score: examResultModal.value.score,
          totalScore: examResultModal.value.totalScore,
          passed: examResultModal.value.passed,
          attemptDateTime: examResultModal.value.attemptDateTime,
          badgeName: examResultModal.value.badgeUnlocked?.name || null,
        },
        examResultModal.value.badgeUnlocked,
      )

      // If passed, immediately call userStore.upgradeUserLevel to update database and frontend state (#43)
      if (examResultModal.value.passed) {
        await userStore.upgradeUserLevel(examResultModal.value.newLevel)
        await userStore.fetchUserProfile().catch(() => {})
      }
    }
  } catch (err: unknown) {
    console.error('Backend submitExam failed:', err)
    validationError.value = 'Failed to submit exam. Please verify your connection or session and try again.'
  } finally {
    isSubmitting.value = false
  }
}

function resetExam() {
  selectedAnswers.value = {}
  examResultModal.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
    console.error('Backend getExamQuestions failed:', err)
    questions.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  await fetchExamQuestions()
})
</script>
