<template>
  <div class="rounded-2xl bg-white p-6 sm:p-8 shadow-sm">

    <!-- Header: Title + Timer -->
    <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 class="font-display text-xl font-extrabold text-button-primary">
        Level {{ userLevel }} Certification Exam
      </h2>
      <span class="rounded-full bg-gray-100 px-3 py-1.5 font-display text-sm font-medium text-gray-600">
        Time: {{ timerDisplay }}
      </span>
    </div>

    <!-- Question counter -->
    <p class="mb-4 font-display text-sm text-gray-400">
      Question {{ currentIndex + 1 }} of {{ questions.length }}
    </p>

    <!-- Question text -->
    <p class="mb-8 font-display text-lg font-medium text-gray-800">
      {{ currentQuestion?.question }}
    </p>

    <!-- Choices -->
    <div class="mb-12 flex flex-col gap-4">
      <button
        v-for="(choice, i) in currentQuestion?.choices"
        :key="i"
        class="flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition"
        :class="
          selectedAnswers[currentIndex] === i
            ? 'border-button-primary bg-button-secondary'
            : 'border-gray-200 hover:border-gray-300'
        "
        @click="selectAnswer(i)"
      >
        <!-- Radio circle -->
        <span
          class="flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition"
          :class="
            selectedAnswers[currentIndex] === i ? 'border-button-primary' : 'border-gray-300'
          "
        >
          <span
            v-if="selectedAnswers[currentIndex] === i"
            class="size-2.5 rounded-full bg-button-primary"
          />
        </span>
        <span class="font-display text-sm text-gray-700">{{ choice }}</span>
      </button>
    </div>

    <!-- Navigation button -->
    <div class="pt-8 flex justify-end">
      <BaseButton
        v-if="!isLastQuestion"
        variant="primary"
        :disabled="selectedAnswers[currentIndex] === -1"
        @click="nextQuestion"
      >
        Next Question
      </BaseButton>
      <BaseButton
        v-else
        variant="primary"
        :disabled="!allAnswered"
        @click="handleSubmit"
      >
        Submit
      </BaseButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useExamStore } from '@/stores/examStore'
import BaseButton from '@/shared/components/BaseButton.vue'

const emit = defineEmits<{ submit: [answers: number[]] }>()

const authStore = useAuthStore()
const examStore = useExamStore()

const userLevel = computed(() => authStore.currentUser?.level ?? '1')
const questions = computed(() => examStore.getQuestionsForLevel(userLevel.value))

const currentIndex = ref(0)
const selectedAnswers = ref<number[]>([])

onMounted(() => {
  selectedAnswers.value = Array(questions.value.length).fill(-1)
})

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)
const allAnswered = computed(() => selectedAnswers.value.every((a) => a !== -1))

function selectAnswer(i: number) {
  selectedAnswers.value[currentIndex.value] = i
}

function nextQuestion() {
  currentIndex.value++
}

function handleSubmit() {
  if (allAnswered.value) {
    emit('submit', [...selectedAnswers.value])
  }
}

// Timer: 30 min countdown (display only)
const timeLeft = ref(30 * 60)
const timerDisplay = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
