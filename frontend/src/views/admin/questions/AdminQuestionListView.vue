<template>
  <AdminPageLayout title="Exam Questions" main-padding="!max-w-[1200px] px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full flex flex-col gap-6 -mt-3">
      <!-- Top Action Bar: Subheader & Add Question Action -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 gap-4">
        <div>
          <p class="text-xs sm:text-sm text-white/80">
            Manage multiple-choice exam questions, answer choices, and passing answers categorized by level.
          </p>
          <p class="text-[11px] text-white/60 mt-0.5">
            Students take these certification exams to upgrade their competency levels.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#00385e] hover:bg-white/90 shadow-md transition-all cursor-pointer shrink-0 select-none"
          @click="openAddModal"
        >
          <span class="text-base font-extrabold leading-none">+</span>
          <span>Add Question</span>
        </button>
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

        <div v-if="!loading && !error" class="text-xs text-white/70 font-medium">
          Showing <span class="font-bold text-white">{{ questions.length }}</span> questions for Level {{ selectedLevel }} Exam
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
        <p class="text-xs text-rose-300 mt-1">Unable to retrieve questions from the backend server.</p>
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

      <!-- Empty State -->
      <div
        v-else-if="questions.length === 0"
        class="bg-white/[0.08] backdrop-blur-md rounded-2xl p-12 border border-white/15 text-center flex flex-col items-center justify-center gap-4 text-white shadow-xl"
      >
        <div class="size-16 rounded-full bg-white/10 flex items-center justify-center text-white/60">
          <DocumentTextIcon class="size-8" />
        </div>
        <div>
          <h3 class="text-base sm:text-lg font-bold text-white">No questions found</h3>
          <p class="text-xs sm:text-sm text-white/60 mt-1 max-w-md">
            No certification questions have been configured for Level {{ selectedLevel }} Exam yet.
          </p>
        </div>
        <button
          type="button"
          class="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#00385e] hover:bg-white/90 shadow transition-all cursor-pointer"
          @click="openAddModal"
        >
          <span>+ Add First Question</span>
        </button>
      </div>

      <!-- Questions List Cards -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="(question, qIndex) in questions"
          :key="question.id"
          class="bg-white/[0.08] backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl text-white transition-all hover:border-white/25 flex flex-col gap-4"
        >
          <!-- Card Header: Index Pill, Level Badge & Action Buttons -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="inline-flex items-center justify-center size-7 rounded-lg bg-white/20 text-white font-extrabold text-xs">
                #{{ qIndex + 1 }}
              </span>
              <span class="text-xs font-bold text-white/80">
                Question {{ qIndex + 1 }} of {{ questions.length }}
              </span>
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-[11px] font-bold select-none',
                  selectedLevel === 1
                    ? 'bg-[#C1D7AE]/20 text-[#C1D7AE] border border-[#C1D7AE]/40'
                    : selectedLevel === 2
                      ? 'bg-[#F2D794]/20 text-[#F2D794] border border-[#F2D794]/40'
                      : 'bg-[#E5A88B]/20 text-[#E5A88B] border border-[#E5A88B]/40',
                ]"
              >
                Level {{ selectedLevel }} Exam
              </span>
            </div>

            <!-- Action Buttons: Edit & Delete -->
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer select-none"
                title="Edit this question"
                @click="openEditModal(question)"
              >
                <PencilSquareIcon class="size-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-colors cursor-pointer select-none"
                title="Delete this question"
                @click="confirmDeleteQuestion(question)"
              >
                <XMarkIcon class="size-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <!-- Question Prompt Text -->
          <div class="text-sm sm:text-base font-semibold text-white/95 leading-relaxed">
            {{ question.questionText }}
          </div>

          <!-- 4 Multiple Choice Options (with green highlight on correct answer) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            <div
              v-for="(choice, cIndex) in question.choices"
              :key="cIndex"
              :class="[
                'flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm transition-all',
                cIndex === question.correctAnswer
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400/40 font-medium'
                  : 'bg-white/[0.04] border-white/10 text-white/80',
              ]"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'size-6 rounded-md flex items-center justify-center text-xs font-extrabold shrink-0 select-none',
                    cIndex === question.correctAnswer
                      ? 'bg-emerald-400 text-[#00385e]'
                      : 'bg-white/15 text-white/90',
                  ]"
                >
                  {{ optionLetters[cIndex] }}
                </span>
                <span class="break-words">{{ choice }}</span>
              </div>

              <!-- Correct Answer Badge with Checkmark -->
              <div
                v-if="cIndex === question.correctAnswer"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 text-[11px] font-bold shrink-0 ml-2 border border-emerald-400/30 select-none"
              >
                <CheckCircleMiniIcon class="size-3.5 text-emerald-300" />
                <span>Correct</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Form Modal (FE-ADMIN-23 & FE-ADMIN-24 Integration) -->
    <QuestionFormModal
      :is-open="showModal"
      :initial-data="selectedQuestion"
      :level-number="selectedLevel"
      :is-saving="saving"
      @save="handleSaveQuestion"
      @close="closeModal"
    />

    <!-- Reusable Delete Confirmation Modal (FE-ADMIN-24 Integration) -->
    <ConfirmActionModal
      :is-open="showDeleteModal"
      title="Delete Exam Question"
      :message="deleteConfirmMessage"
      confirm-text="Delete Question"
      confirm-color="red"
      :is-loading="deleting"
      @confirm="handleDeleteQuestion"
      @cancel="closeDeleteModal"
    />
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import QuestionFormModal, { type QuestionFormData } from '@/components/admin/QuestionFormModal.vue'
import PencilSquareIcon from '@/shared/components/icons/PencilSquareIcon.vue'
import XMarkIcon from '@/shared/components/icons/XMarkIcon.vue'
import CheckCircleMiniIcon from '@/shared/components/icons/CheckCircleMiniIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'
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

const optionLetters = ['A', 'B', 'C', 'D']

const selectedLevel = ref<number>(1)
const questions = ref<QuestionAdmin[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

// Toast state
const showToast = ref<boolean>(false)
const toastMessage = ref<string>('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function triggerToast(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 3500)
}

// Modal State
const showModal = ref<boolean>(false)
const selectedQuestion = ref<QuestionAdmin | null>(null)
const saving = ref<boolean>(false)

// Delete State
const showDeleteModal = ref<boolean>(false)
const questionToDelete = ref<QuestionAdmin | null>(null)
const deleting = ref<boolean>(false)

const deleteConfirmMessage = computed<string>(() => {
  if (!questionToDelete.value) return ''
  const preview = questionToDelete.value.questionText.length > 70
    ? questionToDelete.value.questionText.slice(0, 70) + '...'
    : questionToDelete.value.questionText
  return `Are you sure you want to permanently delete "${preview}"? This action cannot be undone and will immediately affect subsequent Level ${selectedLevel.value} exams.`
})

async function fetchQuestions(levelNumber: number) {
  loading.value = true
  error.value = null

  try {
    const response = await AdminQuestionService.getQuestionsByLevel(levelNumber)
    questions.value = response.data || []
  } catch (err: unknown) {
    console.error(`Backend questions API unavailable for Level ${levelNumber}:`, err)
    error.value = `Failed to load questions for Level ${levelNumber}. Please try again.`
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

function openAddModal() {
  selectedQuestion.value = null
  showModal.value = true
}

function openEditModal(q: QuestionAdmin) {
  selectedQuestion.value = q
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedQuestion.value = null
}

async function handleSaveQuestion(data: QuestionFormData) {
  saving.value = true

  try {
    if (data.id !== undefined) {
      await AdminQuestionService.updateQuestion(data.id, {
        questionText: data.questionText,
        choices: data.choices,
        correctAnswer: data.correctAnswer,
      })
      triggerToast('Question updated successfully.')
    } else {
      await AdminQuestionService.createQuestion({
        levelNumber: data.levelNumber,
        questionText: data.questionText,
        choices: data.choices,
        correctAnswer: data.correctAnswer,
      })
      triggerToast('New question created successfully.')
    }
    closeModal()
    // Refresh question list immediately from backend
    await fetchQuestions(selectedLevel.value)
  } catch (err: unknown) {
    console.error('Failed to save question:', err)
    let msg = 'Failed to save question. Please try again.'
    if (axios.isAxiosError(err)) {
      msg = err.response?.data?.message || err.response?.data?.error || err.message || msg
    } else if (err instanceof Error) {
      msg = err.message
    }
    triggerToast(msg)
  } finally {
    saving.value = false
  }
}

function confirmDeleteQuestion(q: QuestionAdmin) {
  questionToDelete.value = q
  showDeleteModal.value = true
}

function closeDeleteModal() {
  if (deleting.value) return
  showDeleteModal.value = false
  questionToDelete.value = null
}

async function handleDeleteQuestion() {
  if (!questionToDelete.value) return

  deleting.value = true
  const id = questionToDelete.value.id

  try {
    await AdminQuestionService.deleteQuestion(id)
    closeDeleteModal()
    triggerToast('Question deleted successfully.')
    // Refresh question list immediately from backend
    await fetchQuestions(selectedLevel.value)
  } catch (err: unknown) {
    console.error('Failed to delete question:', err)
    let msg = 'Failed to delete question. Please try again.'
    if (axios.isAxiosError(err)) {
      msg = err.response?.data?.message || err.response?.data?.error || err.message || msg
    } else if (err instanceof Error) {
      msg = err.message
    }
    triggerToast(msg)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchQuestions(selectedLevel.value)
})
</script>
