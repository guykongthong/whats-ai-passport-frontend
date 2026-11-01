<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
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
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
            :class="getLevelClasses(targetLevelNumber)"
          >
            Target Level {{ targetLevelNumber }}: {{ getLevelName(targetLevelNumber) }}
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
            class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
          >
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-900">
                Level {{ targetLevelNumber }} AI Passport Advancement Exam
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Total: {{ questions.length }} questions &bull; Pass criteria: {{ passCriteria }} / {{ questions.length }} correct
              </p>
            </div>

            <div class="border-t border-slate-100 pt-3 text-xs sm:text-sm text-slate-600 space-y-1">
              <p class="font-semibold text-slate-700">Instructions:</p>
              <ul class="list-disc list-inside space-y-0.5 text-slate-600 text-xs sm:text-sm">
                <li>Read each question carefully and select one choice per question.</li>
                <li>Your answers will be graded immediately upon submission.</li>
                <li>Passing this exam immediately upgrades your level to Level {{ targetLevelNumber }} under The CA?T Passport and unlocks new services.</li>
              </ul>
            </div>
          </section>

          <!-- Questions Container -->
          <section
            aria-label="Questions Section"
            class="space-y-4"
          >
            <!-- Loading Skeleton -->
            <div v-if="isLoading" class="space-y-4">
              <div
                v-for="n in 3"
                :key="n"
                class="rounded-xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse"
              >
                <div class="h-4 w-28 bg-slate-200 rounded" />
                <div class="h-5 w-3/4 bg-slate-200 rounded" />
                <div class="space-y-2 pt-2">
                  <div v-for="i in 4" :key="i" class="h-10 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="questions.length === 0"
              class="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs"
            >
              <p class="text-base font-bold text-slate-700">No exam questions available</p>
              <p class="text-xs text-slate-400 mt-1">Please check back later or contact your administrator.</p>
            </div>

            <!-- Question Cards -->
            <div
              v-else
              v-for="(question, qIndex) in questions"
              :key="question.id"
              :id="`question-${qIndex}`"
              class="rounded-xl border bg-white p-5 sm:p-6 shadow-xs space-y-3 transition-colors"
              :class="[
                !isQuestionAnswered(question.id) && showUnansweredErrors
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200'
              ]"
            >
              <!-- Question Header -->
              <div class="flex items-center justify-between text-xs text-slate-500">
                <span class="font-semibold text-slate-700">Question {{ qIndex + 1 }} of {{ questions.length }}</span>
                <span
                  v-if="isQuestionAnswered(question.id)"
                  class="text-emerald-700 font-semibold"
                >
                  Answered
                </span>
                <span
                  v-else-if="showUnansweredErrors"
                  class="text-rose-600 font-semibold"
                >
                  Required
                </span>
              </div>

              <!-- Question Text -->
              <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {{ question.questionText }}
              </h3>

              <!-- Choices Options (A, B, C, D) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  v-for="(choice, cIndex) in question.choices"
                  :key="cIndex"
                  type="button"
                  @click="selectChoice(question.id, cIndex)"
                  class="flex items-center gap-3 p-3 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer"
                  :class="[
                    selectedAnswers[question.id] === cIndex
                      ? 'bg-[#00385A] text-white border-[#00385A]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  ]"
                >
                  <span
                    class="size-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                    :class="[
                      selectedAnswers[question.id] === cIndex
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ ['A', 'B', 'C', 'D'][cIndex] ?? cIndex + 1 }}
                  </span>
                  <span class="leading-relaxed flex-1">{{ choice }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Validation Warning Banner -->
          <div
            v-if="validationError"
            class="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700 flex items-center justify-between"
          >
            <span>{{ validationError }}</span>
            <button
              type="button"
              @click="validationError = null"
              class="text-rose-500 hover:text-rose-800 font-bold ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <!-- Submission Card at Bottom (Normal in-flow, not floating) -->
          <div
            v-if="questions.length > 0"
            class="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p class="text-sm font-bold text-slate-800">
                {{ isExamComplete ? 'All questions answered' : `${answeredCount} of ${questions.length} questions answered` }}
              </p>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ isExamComplete ? 'You are ready to submit your exam.' : `Please complete all questions before submitting (${remainingCount} remaining).` }}
              </p>
            </div>

            <button
              type="button"
              @click="submitExamPrompt"
              :disabled="isSubmitting || !isExamComplete"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              :class="[
                isExamComplete && !isSubmitting
                  ? 'bg-[#00385A] hover:bg-[#002840] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              ]"
            >
              <span
                v-if="isSubmitting"
                class="size-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              />
              <span>{{ isSubmitting ? 'Submitting...' : 'Submit Exam' }}</span>
            </button>
          </div>
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
import { questions as mockQuestionsData } from '@/data/questions'

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

    // Record attempt and badge into exam history for offline fallback (#44)
    userStore.recordExamAttempt(
      {
        id: Date.now(),
        levelNumber: targetLevelNumber.value,
        score,
        totalScore: total,
        passed,
        attemptDateTime: examResultModal.value.attemptDateTime,
        badgeName: examResultModal.value.badgeUnlocked?.name || null,
      },
      examResultModal.value.badgeUnlocked,
    )

    if (passed) {
      await userStore.upgradeUserLevel(targetLevelNumber.value)
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
