<template>
  <div class="rounded-2xl bg-white p-6 sm:p-8 shadow-sm text-center">

    <!-- Pass -->
    <template v-if="result.pass">
      <div class="mb-6 flex justify-center">
        <div class="flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon class="size-9 text-green-500" />
        </div>
      </div>
      <h2 class="font-display text-2xl font-extrabold text-green-600">You Passed!</h2>
      <p class="mt-3 font-display text-lg text-gray-500">Well done on completing the exam.</p>
    </template>

    <!-- Fail -->
    <template v-else>
      <div class="mb-6 flex justify-center">
        <div class="flex size-16 items-center justify-center rounded-full bg-red-100">
          <XCircleIcon class="size-9 text-red-400" />
        </div>
      </div>
      <h2 class="font-display text-2xl font-extrabold text-red-500">Not Passed</h2>
      <p class="mt-3 font-display text-lg text-gray-500">Keep learning and try again.</p>
    </template>

    <!-- Score -->
    <div class="pt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
      <div class="rounded-xl border border-gray-200 px-8 py-4">
        <p class="font-display text-3xl font-extrabold text-button-primary">{{ result.score }}%</p>
        <p class="font-display text-xs text-gray-400">Score</p>
      </div>
      <div class="rounded-xl border border-gray-200 px-8 py-4">
        <p class="font-display text-3xl font-extrabold text-button-primary">{{ result.passCriteria }}%</p>
        <p class="font-display text-xs text-gray-400">Required</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="pt-4 flex flex-col sm:flex-row justify-center gap-6">
      <BaseButton
        variant="secondary"
        class="w-full sm:w-auto"
        @click="router.push('/dashboard')"
      >
        Back to Profile
      </BaseButton>
      <BaseButton
        v-if="!result.pass"
        variant="primary"
        class="w-full sm:w-auto"
        @click="router.push('/dashboard/elearning')"
      >
        Review E-Learning
      </BaseButton>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon.vue'
import XCircleIcon from '@/shared/components/icons/XCircleIcon.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import type { ExamRecord } from '@/types/ExamContent'

interface Props {
  result: ExamRecord
}

defineProps<Props>()
const router = useRouter()
</script>
