<template>
  <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-3xl p-6 relative flex flex-col gap-4 text-white">
    <!-- Editing this card -->
    <template v-if="editing">
      <AlertBox
        v-if="editError.general"
        variant="error"
        :message="editError.general"
        class="text-left"
      />

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 pr-2 sm:pr-16">
        <span class="flex size-8 items-center justify-center rounded-full bg-white/20 text-white font-extrabold text-[15px] shrink-0">
          {{ index + 1 }}.
        </span>
        <div class="flex-1 w-full">
          <textarea
            v-model="editForm.questionText"
            rows="2"
            class="w-full bg-white/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[15px] font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Enter the question text here..."
          ></textarea>
          <ErrorMessage :message="editError.questionText" />
        </div>
      </div>

      <div class="pl-11">
        <QuestionChoicesEditor
          v-model:options="editForm.options"
          v-model:correct-index="editForm.correctIndex"
          :error="editError.choices"
        />
      </div>

      <div class="pl-11 flex flex-col gap-1.5">
        <span class="text-white/60 text-[13px] font-extrabold">Description (Optional)</span>
        <textarea
          v-model="editForm.description"
          rows="2"
          class="w-full bg-white/25 border border-white/15 rounded-xl px-4 py-3 text-white text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder="Explanation for the correct answer..."
        ></textarea>
      </div>

      <div class="flex justify-end gap-3 pl-11">
        <button
          type="button"
          @click="cancelEdit"
          class="bg-white/10 text-white hover:bg-white/20 text-sm font-bold rounded-lg px-6 py-2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveEdit"
          class="bg-white text-[#00385e] hover:bg-white/90 text-sm font-bold rounded-lg px-6 py-2 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </template>

    <!-- Static preview -->
    <template v-else>
      <!-- Question Line & Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3 w-full sm:w-auto flex-1">
          <span class="flex size-8 items-center justify-center rounded-full bg-white/20 text-white font-extrabold text-[15px] shrink-0">
            {{ index + 1 }}.
          </span>
          <div class="flex-1 bg-white/20 rounded-xl px-4 py-2.5 border border-white/10">
            <p class="font-semibold text-white/90 text-[15px]">{{ question.questionText }}</p>
          </div>
        </div>
        <!-- Edit / Delete Buttons -->
        <div class="flex items-center gap-3 self-end sm:self-auto shrink-0 pr-2">
          <button
            @click="startEdit"
            class="text-white/50 hover:text-white/90 transition-colors"
            title="Edit question"
          >
            <PencilSquareIcon class="w-6 h-6" />
          </button>
          <button
            @click="emit('delete', question.id)"
            class="text-white/50 hover:text-white/90 transition-colors"
            title="Delete question"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Choices Options -->
      <div class="flex flex-col gap-2.5 pl-11">
        <div
          v-for="(option, oIdx) in question.options"
          :key="oIdx"
          class="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2 border border-white/10 w-full"
        >
          <!-- Radio-like indicator -->
          <div
            :class="[
              'size-5 rounded-full border-2 flex items-center justify-center shrink-0',
              oIdx + 1 === question.correctIndex ? 'border-white bg-white/70' : 'border-white/40'
            ]"
          >
            <div v-if="oIdx + 1 === question.correctIndex" class="size-2 rounded-full bg-[#00385e]"></div>
          </div>
          <span class="text-[14px] font-semibold text-white/80">{{ option }}</span>
        </div>
      </div>

      <!-- Description/Explanation Box -->
      <div class="pl-11 flex flex-col gap-1.5" v-if="question.description">
        <span class="text-white/60 text-[13px] font-extrabold">Description</span>
        <div class="bg-white/25 border border-white/15 rounded-xl px-4 py-3 text-white/80 text-[13px] font-semibold">
          {{ question.description }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PencilSquareIcon from '@/shared/components/icons/PencilSquareIcon.vue'
import XMarkIcon from '@/shared/components/icons/XMarkIcon.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import AlertBox from '@/shared/components/AlertBox.vue'
import QuestionChoicesEditor from './QuestionChoicesEditor.vue'
import { validateRequired, validateChoices } from '@/shared/utils/validation'
import type { FieldErrors } from '@/types/FieldErrors'

interface Question {
  id: string
  progressionId: string
  questionText: string
  options: string[]
  correctIndex: number
  description?: string
}

const props = defineProps<{
  question: Question
  index: number
}>()

const emit = defineEmits<{
  'delete': [id: string]
  'save': [question: {
    id: string
    questionText: string
    options: string[]
    correctIndex: number
    description?: string
  }]
}>()

const editing = ref(false)
const editForm = ref({
  questionText: '',
  options: [] as string[],
  correctIndex: 0,
  description: ''
})
const editError = ref<FieldErrors>({})

function startEdit() {
  editForm.value = {
    questionText: props.question.questionText,
    options: [...props.question.options],
    correctIndex: props.question.correctIndex,
    description: props.question.description ?? ''
  }
  editError.value = {}
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  editError.value = {}
}

function saveEdit() {
  const stepError = validateRequired({ questionText: editForm.value.questionText })

  const choicesError = validateChoices(editForm.value.options, editForm.value.correctIndex)
  if (choicesError) {
    stepError.choices = choicesError
  }

  if (Object.keys(stepError).length > 0) {
    stepError.general = 'Please fix the errors below.'
    editError.value = stepError
    return
  }

  emit('save', {
    id: props.question.id,
    questionText: editForm.value.questionText.trim(),
    options: editForm.value.options.map((opt) => opt.trim()),
    correctIndex: editForm.value.correctIndex,
    description: editForm.value.description.trim() || undefined
  })

  editing.value = false
  editError.value = {}
}
</script>
