<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="handleClose"
        />

        <!-- Modal Dialog Box -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-xl transform rounded-2xl bg-[#00385e] border border-white/20 p-6 sm:p-8 text-left shadow-2xl backdrop-blur-md transition-all z-10 text-white flex flex-col gap-5 my-8"
          >
            <!-- Header: Title, Level Indicator, Close Button -->
            <div class="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div>
                <h3 :id="titleId" class="text-base sm:text-lg font-bold text-white">
                  {{ isEditMode ? 'Edit Exam Question' : 'Add Exam Question' }}
                </h3>
                <p class="text-xs text-white/70 mt-0.5">
                  Level {{ levelNumber }} Exam ({{ getLevelName(levelNumber) }})
                </p>
              </div>
              <button
                type="button"
                :disabled="isSaving"
                aria-label="Close modal"
                class="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                @click="handleClose"
              >
                <XMarkIcon class="size-5" />
              </button>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-4.5" novalidate @submit.prevent="handleSubmit">
              <!-- Question Prompt Textarea -->
              <div class="flex flex-col gap-1.5">
                <label for="questionPromptInput" class="text-xs font-bold text-white/90">
                  Question Prompt <span class="text-rose-400">*</span>
                </label>
                <textarea
                  id="questionPromptInput"
                  v-model="form.questionText"
                  rows="3"
                  :disabled="isSaving"
                  :class="[
                    'w-full bg-white/10 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors resize-none disabled:opacity-50',
                    errors.questionText
                      ? 'border-rose-400 ring-1 ring-rose-400/50'
                      : 'border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/30',
                  ]"
                  placeholder="e.g. What does 'AI' stand for?"
                  @input="errors.questionText = ''"
                />
                <span v-if="errors.questionText" class="text-[11px] font-medium text-rose-300">
                  {{ errors.questionText }}
                </span>
              </div>

              <!-- Answer Choices (A, B, C, D) -->
              <div class="flex flex-col gap-2.5">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-white/90">
                    Answer Choices (Select the correct answer) <span class="text-rose-400">*</span>
                  </label>
                  <span class="text-[11px] text-white/60">Choose 1 correct choice</span>
                </div>

                <div
                  v-for="(letter, idx) in optionLetters"
                  :key="letter"
                  class="flex flex-col gap-1"
                >
                  <div
                    :class="[
                      'flex items-center gap-2.5 p-2 rounded-xl border transition-all',
                      form.correctAnswer === idx
                        ? 'bg-emerald-500/15 border-emerald-400/80 ring-1 ring-emerald-400/30'
                        : errors.choices[idx]
                          ? 'bg-rose-500/10 border-rose-400/60'
                          : 'bg-white/5 border-white/10 hover:border-white/20',
                    ]"
                  >
                    <!-- Radio Button for Correct Choice -->
                    <label
                      :for="`choice-radio-${letter}`"
                      class="flex items-center gap-2 cursor-pointer shrink-0 pl-1 select-none"
                    >
                      <input
                        :id="`choice-radio-${letter}`"
                        v-model="form.correctAnswer"
                        type="radio"
                        :value="idx"
                        name="correctChoice"
                        :disabled="isSaving"
                        class="size-4 text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                        @change="errors.correctAnswer = ''"
                      />
                      <span
                        :class="[
                          'size-6 rounded-md flex items-center justify-center text-xs font-extrabold shrink-0 select-none transition-colors',
                          form.correctAnswer === idx
                            ? 'bg-emerald-400 text-[#00385e]'
                            : 'bg-white/15 text-white/90',
                        ]"
                      >
                        {{ letter }}
                      </span>
                    </label>

                    <!-- Choice Text Input -->
                    <input
                      :id="`choice-input-${letter}`"
                      v-model="form.choices[idx]"
                      type="text"
                      :disabled="isSaving"
                      :class="[
                        'flex-1 bg-white/10 border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors disabled:opacity-50',
                        errors.choices[idx]
                          ? 'border-rose-400 ring-1 ring-rose-400/50'
                          : 'border-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/30',
                      ]"
                      :placeholder="`Enter option ${letter}...`"
                      @input="onChoiceInput(idx)"
                    />

                    <!-- Correct Badge Indicator -->
                    <div
                      v-if="form.correctAnswer === idx"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 text-[11px] font-bold shrink-0 mr-1 border border-emerald-400/30 select-none"
                    >
                      <CheckCircleMiniIcon class="size-3 text-emerald-300" />
                      <span>Correct</span>
                    </div>
                  </div>

                  <!-- Per-choice error message -->
                  <span
                    v-if="errors.choices[idx]"
                    class="text-[11px] font-medium text-rose-300 ml-9"
                  >
                    {{ errors.choices[idx] }}
                  </span>
                </div>

                <!-- General choices error message -->
                <span
                  v-if="errors.choicesGeneral && !errors.choices.some(Boolean)"
                  class="text-[11px] font-medium text-rose-300"
                >
                  {{ errors.choicesGeneral }}
                </span>

                <!-- Correct Answer Selection Error -->
                <span
                  v-if="errors.correctAnswer"
                  class="text-[11px] font-medium text-rose-300 flex items-center gap-1 mt-0.5"
                >
                  <svg class="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{{ errors.correctAnswer }}</span>
                </span>
              </div>

              <!-- Modal Actions -->
              <div class="flex items-center justify-end gap-3 pt-3.5 border-t border-white/10 mt-1">
                <button
                  type="button"
                  :disabled="isSaving"
                  class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="handleClose"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="px-5 py-2 rounded-xl text-xs font-bold bg-white text-[#00385e] hover:bg-white/90 shadow transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div
                    v-if="isSaving"
                    class="size-3.5 rounded-full border-2 border-[#00385e] border-t-transparent animate-spin"
                  />
                  <span>{{ isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Question') }}</span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, watch, onMounted, onUnmounted, useId } from 'vue'
import * as yup from 'yup'
import XMarkIcon from '@/shared/components/icons/XMarkIcon.vue'
import CheckCircleMiniIcon from '@/shared/components/icons/CheckCircleMiniIcon.vue'
import type { QuestionAdmin } from '@/types/admin'
import { getLevelName } from '@/utils/levelDisplay'

export interface QuestionFormData {
  id?: number
  levelNumber: number
  questionText: string
  choices: string[]
  correctAnswer: number
}

interface Props {
  isOpen: boolean
  initialData?: QuestionAdmin | null
  levelNumber: number
  isSaving?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  initialData: null,
  levelNumber: 1,
  isSaving: false,
})

const emit = defineEmits<{
  (e: 'save', data: QuestionFormData): void
  (e: 'close'): void
}>()

const titleId = useId ? useId() : 'question-modal-title'
const optionLetters = ['A', 'B', 'C', 'D'] as const

const isEditMode = computed<boolean>(() => {
  return Boolean(props.initialData && props.initialData.id !== undefined)
})

const form = reactive({
  questionText: '',
  choices: ['', '', '', ''],
  correctAnswer: -1,
})

const errors = reactive({
  questionText: '',
  choices: ['', '', '', ''],
  choicesGeneral: '',
  correctAnswer: '',
})

// Yup Validation Schema per Criteria #17 & #27
const questionSchema = yup.object({
  questionText: yup
    .string()
    .trim()
    .required('Question prompt is required.'),
  choices: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .required('Choice option cannot be empty.')
    )
    .min(4, 'All 4 choice options are required.')
    .max(4, 'All 4 choice options are required.')
    .test('all-filled', 'All 4 choice options must be filled in.', (choices) => {
      return (
        Array.isArray(choices) &&
        choices.length === 4 &&
        choices.every((c) => typeof c === 'string' && c.trim() !== '')
      )
    }),
  correctAnswer: yup
    .number()
    .typeError('A correct answer must be selected.')
    .required('A correct answer must be selected.')
    .min(0, 'A correct answer must be selected.')
    .max(3, 'A correct answer must be selected.'),
})

function resetErrors() {
  errors.questionText = ''
  errors.choices = ['', '', '', '']
  errors.choicesGeneral = ''
  errors.correctAnswer = ''
}

function initForm() {
  resetErrors()
  if (props.initialData) {
    form.questionText = props.initialData.questionText || ''
    form.choices = props.initialData.choices && props.initialData.choices.length === 4
      ? [...props.initialData.choices]
      : ['', '', '', '']
    form.correctAnswer = props.initialData.correctAnswer ?? 0
  } else {
    form.questionText = ''
    form.choices = ['', '', '', '']
    form.correctAnswer = -1
  }
}

function onChoiceInput(index: number) {
  errors.choices[index] = ''
  errors.choicesGeneral = ''
}

async function validateForm(): Promise<boolean> {
  resetErrors()
  try {
    await questionSchema.validate(form, { abortEarly: false })
    return true
  } catch (err: unknown) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((validationErr) => {
        const path = validationErr.path || ''
        if (path === 'questionText') {
          errors.questionText = validationErr.message
        } else if (path.startsWith('choices[')) {
          const match = path.match(/choices\[(\d+)\]/)
          if (match && match[1] !== undefined) {
            const index = Number(match[1])
            if (index >= 0 && index < 4) {
              errors.choices[index] = validationErr.message
            }
          }
        } else if (path === 'choices') {
          errors.choicesGeneral = validationErr.message
        } else if (path === 'correctAnswer') {
          errors.correctAnswer = validationErr.message
        }
      })
    }
    return false
  }
}

async function handleSubmit() {
  if (props.isSaving) return
  const isValid = await validateForm()
  if (!isValid) return

  const payload: QuestionFormData = {
    levelNumber: props.levelNumber,
    questionText: form.questionText.trim(),
    choices: form.choices.map((c) => c.trim()),
    correctAnswer: form.correctAnswer,
  }

  if (props.initialData?.id !== undefined) {
    payload.id = props.initialData.id
  }

  emit('save', payload)
}

function handleClose() {
  if (props.isSaving) return
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen && !props.isSaving) {
    handleClose()
  }
}

watch(
  [() => props.isOpen, () => props.initialData],
  ([isOpen]) => {
    if (isOpen) {
      initForm()
    }
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
