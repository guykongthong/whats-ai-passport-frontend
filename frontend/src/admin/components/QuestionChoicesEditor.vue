<template>
  <div class="flex flex-col gap-2">
    <div v-for="(choice, index) in options" :key="index" class="flex items-center gap-2">
      <span class="text-white/60 text-sm font-bold w-6 shrink-0">{{ index + 1 }}.</span>
      <input
        v-model="options[index]"
        type="text"
        class="flex-1 bg-white/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/30 font-medium"
        :placeholder="`Choice ${index + 1}`"
      />
      <input
        type="radio"
        :name="radioGroupName"
        :value="index + 1"
        v-model="correctIndex"
        class="w-5 h-5 accent-[#00385e] cursor-pointer shrink-0"
        title="Mark as correct answer"
      />
      <button
        type="button"
        @click="removeChoice(index)"
        class="text-red-400 hover:text-red-300 font-bold text-xl px-2 shrink-0"
        title="Remove choice"
      >
        &times;
      </button>
    </div>
    <div class="flex justify-between items-center mt-2">
      <button
        type="button"
        @click="addChoice"
        class="text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
      >
        + Add Choice
      </button>
      <ErrorMessage :message="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'

defineProps<{
  error?: string
}>()

const options = defineModel<string[]>('options', { required: true })
const correctIndex = defineModel<number>('correctIndex', { required: true })

const radioGroupName = `correct-answer-${useId()}`

function addChoice() {
  options.value.push('')
}

function removeChoice(index: number) {
  options.value.splice(index, 1)

  if (correctIndex.value === index + 1) {
    correctIndex.value = 0
  } else if (correctIndex.value > index + 1) {
    correctIndex.value--
  }
}
</script>
