<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <!-- Exam Results Modal / Overlay (FE-USER-17) -->
        <div
          v-if="examResultModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div
            class="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6 animate-scale-up"
          >
            <!-- Result Icon -->
            <div
              class="size-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-inner"
              :class="examResultModal.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'"
            >
              <span v-if="examResultModal.passed">🎉</span>
              <span v-else>📝</span>
            </div>

            <!-- Result Title -->
            <div class="space-y-1">
              <h2 class="text-2xl font-black tracking-tight" :class="examResultModal.passed ? 'text-emerald-700' : 'text-slate-800'">
                {{ examResultModal.passed ? 'Congratulations! Exam Passed!' : 'Exam Not Passed' }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-500">
                {{ examResultModal.passed ? `You have successfully advanced to Level ${examResultModal.newLevel}!` : 'Do not worry, you can review the eLearning materials and retry anytime.' }}
              </p>
            </div>

            <!-- Score Summary Cards -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400">Your Score</span>
                <p class="text-xl sm:text-2xl font-black text-slate-800">
                  {{ examResultModal.score }} / {{ examResultModal.totalScore }}
                </p>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="text-[11px] font-semibold text-slate-400">Passing Criteria</span>
                <p class="text-xl sm:text-2xl font-black text-slate-800">
                  {{ examResultModal.passCriteria }} Correct
                </p>
              </div>
            </div>

            <!-- Unlocked Badge Card -->
            <div
              v-if="examResultModal.badgeUnlocked"
              class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-4 text-left"
            >
              <div class="size-14 rounded-2xl bg-white p-1.5 shadow-sm border border-amber-100 shrink-0 flex items-center justify-center">
                <img
                  v-if="examResultModal.badgeUnlocked.imageUrl"
                  :src="examResultModal.badgeUnlocked.imageUrl"
                  :alt="examResultModal.badgeUnlocked.name"
                  class="size-full object-contain"
                />
                <span v-else class="text-2xl">🏅</span>
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700">Badge Unlocked!</span>
                <h4 class="text-sm font-bold text-slate-900">{{ examResultModal.badgeUnlocked.name }}</h4>
                <p class="text-[11px] text-slate-500">Added to your achievements</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                v-if="!examResultModal.passed"
                type="button"
                @click="resetExam"
                class="w-full py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Retry Exam
              </button>
              <RouterLink
                to="/elearning"
                class="w-full py-3 px-5 rounded-xl bg-[#00385A] hover:bg-[#002840] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue to eLearning</span>
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>

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
              class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4 transition-all"
              :class="{
                'ring-2 ring-[#00385A]/15 border-[#00385A]/40': isQuestionAnswered(question.id)
              }"
            >
              <!-- Question Header -->
              <div class="flex items-start justify-between gap-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#00385A]/10 text-[#00385A] text-xs font-bold">
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
                  class="text-[11px] font-medium text-slate-400"
                >
                  Unanswered
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

          <!-- Floating Sticky Action / Submission Bar (FE-USER-17) -->
          <aside
            v-if="questions.length > 0"
            aria-label="Exam Actions"
            class="sticky bottom-6 z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                :class="allAnswered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ answeredCount }}/{{ questions.length }}
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800">
                  {{ allAnswered ? 'All questions answered!' : `${questions.length - answeredCount} question(s) remaining` }}
                </p>
                <p class="text-[11px] text-slate-500">
                  {{ allAnswered ? 'You are ready to submit your exam.' : 'Complete all questions before submitting.' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                @click="submitExamPrompt"
                :disabled="isSubmitting"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00385A] hover:bg-[#002840] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Submit Exam Answers</span>
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import ExamService, {
  type ContractQuestion,
  type ExamPaperResponse,
  type ExamSubmitResponse,
  type ExamSubmissionPayload
} from '@/services/ExamService'
import type { ExamQuestion } from '@/types/ExamContent'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { questions as mockQuestionsData } from '@/data/questions'

const userStore = useUserStore()

const isLoading = ref(false)
const passCriteria = ref(3)
const questions = ref<ContractQuestion[]>([])
const selectedAnswers = ref<Record<string | number, number>>({})
const isSubmitting = ref(false)
const validationError = ref<string | null>(null)
const examResultModal = ref<ExamSubmitResponse | null>(null)

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)
const isTopLevel = computed<boolean>(() => currentLevelNumber.value >= 4)
const targetLevelNumber = computed<number>(() => {
  return Math.min(currentLevelNumber.value + 1, 4)
})

const answeredCount = computed<number>(() => {
  return Object.keys(selectedAnswers.value).length
})

const progressPercent = computed<number>(() => {
  if (questions.value.length === 0) return 0
  return Math.round((answeredCount.value / questions.value.length) * 100)
})

const allAnswered = computed<boolean>(() => {
  return questions.value.length > 0 && answeredCount.value === questions.value.length
})

function isQuestionAnswered(questionId: string | number): boolean {
  return selectedAnswers.value[questionId] !== undefined
}

function selectChoice(questionId: string | number, choiceIndex: number) {
  selectedAnswers.value[questionId] = choiceIndex
  validationError.value = null
}

function scrollToQuestion(qIndex: number) {
  const el = document.getElementById(`question-${qIndex}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function submitExamPrompt() {
  if (!allAnswered.value) {
    validationError.value = `Please answer all questions before submitting. (${questions.value.length - answeredCount.value} remaining)`
    const firstUnansweredIndex = questions.value.findIndex((q) => !isQuestionAnswered(q.id))
    if (firstUnansweredIndex !== -1) {
      scrollToQuestion(firstUnansweredIndex)
    }
    return
  }

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

      // If passed, immediately update user store level and refresh user profile
      if (examResultModal.value.passed) {
        if (userStore.userProfile) {
          userStore.userProfile.currentLevel = examResultModal.value.newLevel
        }
        await userStore.fetchUserProfile().catch(() => {})
      }
    }
  } catch (err: unknown) {
    console.info('Backend submitExam offline, calculating mock result:', err)

    // Fallback simulation when backend offline
    const total = questions.value.length
    const score = Math.min(total, Object.keys(selectedAnswers.value).length)
    const passed = score >= passCriteria.value

    examResultModal.value = {
      score,
      totalScore: total,
      passCriteria: passCriteria.value,
      passed,
      oldLevel: currentLevelNumber.value,
      newLevel: passed ? targetLevelNumber.value : currentLevelNumber.value,
      badgeUnlocked: passed ? { name: `Level ${targetLevelNumber.value} Master`, imageUrl: '' } : null,
      attemptDateTime: new Date().toISOString(),
    }

    if (passed && userStore.userProfile) {
      userStore.userProfile.currentLevel = targetLevelNumber.value
    }
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
