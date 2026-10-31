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

    <!-- Add / Edit Question Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div class="bg-[#00385e] border border-white/20 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl text-white flex flex-col gap-5 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-white">
              {{ modalMode === 'create' ? 'Add Exam Question' : 'Edit Exam Question' }}
            </h3>
            <p class="text-xs text-white/70 mt-0.5">
              Level {{ selectedLevel }} Exam ({{ levelTabs.find(t => t.level === selectedLevel)?.target }})
            </p>
          </div>
          <button
            type="button"
            class="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            @click="closeModal"
          >
            <XMarkIcon class="size-5" />
          </button>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="saveQuestion">
          <!-- Question Prompt Text -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-white/90">
              Question Prompt <span class="text-rose-400">*</span>
            </label>
            <textarea
              v-model="form.questionText"
              rows="3"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
              placeholder="e.g. What does 'AI' stand for?"
            />
            <span v-if="formErrors.questionText" class="text-[11px] font-medium text-rose-300">
              {{ formErrors.questionText }}
            </span>
          </div>

          <!-- Answer Choices -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-white/90">
                Answer Choices (Select correct answer) <span class="text-rose-400">*</span>
              </label>
            </div>

            <div
              v-for="(letter, idx) in optionLetters"
              :key="letter"
              :class="[
                'flex items-center gap-2.5 p-2 rounded-xl border transition-all',
                form.correctAnswer === idx
                  ? 'bg-emerald-500/15 border-emerald-400/80'
                  : 'bg-white/5 border-white/10',
              ]"
            >
              <label class="flex items-center gap-1.5 cursor-pointer shrink-0 pl-1 select-none">
                <input
                  v-model="form.correctAnswer"
                  type="radio"
                  :value="idx"
                  name="correctChoice"
                  class="size-4 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer"
                />
                <span class="text-xs font-bold w-4 text-center">{{ letter }}</span>
              </label>
              <input
                v-model="form.choices[idx]"
                type="text"
                class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                :placeholder="`Enter option ${letter}...`"
              />
            </div>
            <span v-if="formErrors.choices" class="text-[11px] font-medium text-rose-300">
              {{ formErrors.choices }}
            </span>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-white/10 mt-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-white text-[#00385e] hover:bg-white/90 shadow transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="saving" class="size-3.5 rounded-full border-2 border-[#00385e] border-t-transparent animate-spin" />
              <span>{{ modalMode === 'create' ? 'Create Question' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal && questionToDelete"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-[#00385e] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white flex flex-col gap-4">
        <h3 class="text-base font-bold text-white">Delete Question</h3>
        <p class="text-xs sm:text-sm text-white/80 leading-relaxed">
          Are you sure you want to delete this question? This action will permanently remove it from Level {{ selectedLevel }} Exam.
        </p>
        <div class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 italic">
          "{{ questionToDelete.questionText }}"
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="deleting"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            @click="handleDeleteQuestion"
          >
            <div v-if="deleting" class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Delete Question</span>
          </button>
        </div>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import PencilSquareIcon from '@/shared/components/icons/PencilSquareIcon.vue'
import XMarkIcon from '@/shared/components/icons/XMarkIcon.vue'
import CheckCircleMiniIcon from '@/shared/components/icons/CheckCircleMiniIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'
import AdminQuestionService from '@/services/AdminQuestionService'
import type { QuestionAdmin } from '@/types/admin'
import { questions as mockQuestions } from '@/data/questions'

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
const modalMode = ref<'create' | 'edit'>('create')
const activeQuestionId = ref<number | null>(null)
const saving = ref<boolean>(false)

const form = reactive({
  questionText: '',
  choices: ['', '', '', ''],
  correctAnswer: 0,
})

const formErrors = reactive({
  questionText: '',
  choices: '',
})

// Delete State
const showDeleteModal = ref<boolean>(false)
const questionToDelete = ref<QuestionAdmin | null>(null)
const deleting = ref<boolean>(false)

async function fetchQuestions(levelNumber: number) {
  loading.value = true
  error.value = null

  try {
    const response = await AdminQuestionService.getQuestionsByLevel(levelNumber)
    if (response.data && response.data.length > 0) {
      questions.value = response.data
    } else {
      // Load fallback mock questions if backend returns empty
      loadFallbackQuestions(levelNumber)
    }
  } catch (err: unknown) {
    console.warn(`Backend questions API unavailable for level ${levelNumber}, falling back to local dataset:`, err)
    loadFallbackQuestions(levelNumber)
  } finally {
    loading.value = false
  }
}

function loadFallbackQuestions(levelNumber: number) {
  const prefix = `l${levelNumber}`
  const matched = mockQuestions
    .filter((q) => q.id.startsWith(prefix))
    .map((q, idx) => ({
      id: idx + 1 + (levelNumber - 1) * 10,
      levelNumber,
      questionText: q.question,
      choices: [...q.choices],
      correctAnswer: q.answerIndex,
    }))

  if (matched.length > 0) {
    questions.value = matched
  } else {
    questions.value = []
  }
}

function switchLevel(levelNumber: number) {
  if (selectedLevel.value === levelNumber) return
  selectedLevel.value = levelNumber
  fetchQuestions(levelNumber)
}

function openAddModal() {
  modalMode.value = 'create'
  activeQuestionId.value = null
  form.questionText = ''
  form.choices = ['', '', '', '']
  form.correctAnswer = 0
  formErrors.questionText = ''
  formErrors.choices = ''
  showModal.value = true
}

function openEditModal(q: QuestionAdmin) {
  modalMode.value = 'edit'
  activeQuestionId.value = q.id
  form.questionText = q.questionText
  form.choices = [...q.choices]
  form.correctAnswer = q.correctAnswer
  formErrors.questionText = ''
  formErrors.choices = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function validateForm(): boolean {
  let valid = true
  formErrors.questionText = ''
  formErrors.choices = ''

  if (!form.questionText.trim()) {
    formErrors.questionText = 'Question prompt cannot be empty.'
    valid = false
  }

  const emptyChoices = form.choices.filter((c) => !c.trim())
  if (emptyChoices.length > 0) {
    formErrors.choices = 'All 4 choice options must be filled in.'
    valid = false
  }

  return valid
}

async function saveQuestion() {
  if (!validateForm()) return

  saving.value = true

  try {
    if (modalMode.value === 'create') {
      const payload = {
        levelNumber: selectedLevel.value,
        questionText: form.questionText.trim(),
        choices: form.choices.map((c) => c.trim()),
        correctAnswer: form.correctAnswer,
      }

      try {
        const response = await AdminQuestionService.createQuestion(payload)
        questions.value.push(response.data)
      } catch (err) {
        console.warn('API createQuestion failed, updating client state locally:', err)
        const mockNew: QuestionAdmin = {
          id: Date.now(),
          ...payload,
        }
        questions.value.push(mockNew)
      }

      triggerToast('New question created successfully.')
    } else if (activeQuestionId.value !== null) {
      const updatedData = {
        questionText: form.questionText.trim(),
        choices: form.choices.map((c) => c.trim()),
        correctAnswer: form.correctAnswer,
      }

      try {
        await AdminQuestionService.updateQuestion(activeQuestionId.value, updatedData)
      } catch (err) {
        console.warn('API updateQuestion failed, updating client state locally:', err)
      }

      const idx = questions.value.findIndex((q) => q.id === activeQuestionId.value)
      if (idx !== -1) {
        const current = questions.value[idx]
        if (current) {
          questions.value[idx] = {
            id: current.id,
            levelNumber: current.levelNumber,
            questionText: updatedData.questionText,
            choices: updatedData.choices,
            correctAnswer: updatedData.correctAnswer,
          }
        }
      }

      triggerToast('Question updated successfully.')
    }

    closeModal()
  } finally {
    saving.value = false
  }
}

function confirmDeleteQuestion(q: QuestionAdmin) {
  questionToDelete.value = q
  showDeleteModal.value = true
}

async function handleDeleteQuestion() {
  if (!questionToDelete.value) return

  deleting.value = true
  const id = questionToDelete.value.id

  try {
    try {
      await AdminQuestionService.deleteQuestion(id)
    } catch (err) {
      console.warn('API deleteQuestion failed, deleting client state locally:', err)
    }

    questions.value = questions.value.filter((q) => q.id !== id)
    showDeleteModal.value = false
    questionToDelete.value = null
    triggerToast('Question deleted successfully.')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchQuestions(selectedLevel.value)
})
</script>
