<template>
  <AlertBox 
      v-if="alertMessage" 
      :variant="alertVariant" 
      :message="alertMessage" 
      class="mb-6 text-left" 
    />
  <div class="bg-white/10 rounded-2xl p-6 border border-white/20">
    <h3 class="text-white text-xl font-bold mb-4">Create New Question</h3>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

      <!-- Level Selection -->
      <div>
        <label class="block text-white/80 text-sm font-semibold mb-1">Progression Level <span class="text-red-400">*</span></label>
        <select v-model="formData.progressionId" class="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 font-medium">
          <option value="" disabled class="text-gray-800">Select a level</option>
          <option v-for="level in levels" :key="level.id" :value="level.id" class="text-gray-800">
            {{ level.id }}
          </option>
        </select>
        <ErrorMessage :message="error.progressionId"/>
      </div>

      <!-- Question Text -->
      <div>
        <label class="block text-white/80 text-sm font-semibold mb-1">Question <span class="text-red-400">*</span></label>
        <textarea 
          v-model="formData.questionText" 
          rows="3" 
          class="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/30 font-medium"
          placeholder="Enter the question text here..."
        ></textarea>
        <ErrorMessage :message="error.questionText"/>
      </div>

      <!-- Choices -->
      <div>
        <label class="block text-white/80 text-sm font-semibold mb-1">Choices <span class="text-red-400">*</span></label>
        <QuestionChoicesEditor
          v-model:options="formData.options"
          v-model:correct-index="formData.correctIndex"
          :error="error.choices"
        />
        <p class="text-white/50 text-xs mt-1">Select the radio button next to the correct answer.</p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-white/80 text-sm font-semibold mb-1">Description (Optional)</label>
        <textarea 
          v-model="formData.description" 
          rows="2" 
          class="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/30 font-medium"
          placeholder="Explanation for the correct answer..."
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end mt-2">
        <button
          type="submit"
          class="bg-white text-[#00385e] hover:bg-white/90 text-sm font-bold rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Question
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import ErrorMessage from '@/shared/components/ErrorMessage.vue';
import { validateRequired, validateChoices } from '@/shared/utils/validation';
import { ref } from 'vue'
import type { FieldErrors } from '@/types/FieldErrors';
import AlertBox from '@/shared/components/AlertBox.vue';
import QuestionChoicesEditor from './QuestionChoicesEditor.vue';

defineProps<{
  levels: { id: string; name: string }[]
}>()

const emit = defineEmits<{
  submit: [question: {
    progressionId: string
    questionText: string
    options: string[]
    correctIndex: number
    description?: string
  }]
}>()

function blankForm() {
  return {
    progressionId: '',
    questionText: '',
    options: [] as string[],
    correctIndex: 0,
    description: ''
  }
}

const formData = ref(blankForm())
const error = ref<FieldErrors>({})
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')

function handleSubmit() {
  const stepError = validateRequired({progressionId: formData.value.progressionId, questionText: formData.value.questionText})
  error.value = stepError

  const choicesError = validateChoices(formData.value.options, formData.value.correctIndex)
  if (choicesError) {
    stepError.choices = choicesError
  }

  if (Object.keys(stepError).length > 0) {
    alertMessage.value = 'Please fill out the required fields.'
    alertVariant.value = 'error'
  } else {
    alertMessage.value = 'Question created successfully!'
    alertVariant.value = 'success'

    emit('submit', {
      progressionId: formData.value.progressionId,
      questionText: formData.value.questionText.trim(),
      options: formData.value.options.map(opt => opt.trim()),
      correctIndex: formData.value.correctIndex,
      description: formData.value.description.trim() || undefined
    })

    // Reset form
    formData.value = blankForm()
  }
}
</script>
