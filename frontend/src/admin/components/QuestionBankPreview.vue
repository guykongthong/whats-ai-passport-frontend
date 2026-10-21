<template>
  <div class="flex flex-col gap-6 mt-4">
    <p class="text-white/90 font-bold text-[18px]">Questions & Choice (Preview)</p>

    <div v-if="questions.length > 0" class="flex flex-col gap-6">
      <QuestionCard
        v-for="(q, qIdx) in questions"
        :key="q.id"
        :question="q"
        :index="qIdx"
        @delete="emit('delete', $event)"
        @save="emit('save', $event)"
      />
    </div>

    <div v-else class="bg-black/10 rounded-2xl p-8 border border-white/10 text-center py-14 text-white/60 font-bold">
      No questions available in this progression category.
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionCard from './QuestionCard.vue'

interface Question {
  id: string
  progressionId: string
  questionText: string
  options: string[]
  correctIndex: number
  description?: string
}

interface Props {
  questions: Question[]
}

defineProps<Props>()

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
</script>
