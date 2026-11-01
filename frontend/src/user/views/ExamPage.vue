<template>
  <UserPageLayout>
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" />
    </template>

    <!-- Main content: centered -->
    <main class="flex flex-1 justify-center bg-[#EEF2F7] px-6 py-10">
      <div class="w-full max-w-xl">
        <ExamQuestions v-if="phase === 'quiz'" @submit="handleSubmit" />
        <ExamResult
          v-else-if="phase === 'result' && examResult"
          :result="examResult"
        />
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useExamStore } from '@/stores/examStore'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import ExamQuestions from '@/user/components/ExamQuestions.vue'
import ExamResult from '@/user/components/ExamResult.vue'
import type { ExamRecord } from '@/types/ExamContent'

const authStore = useAuthStore()
const examStore = useExamStore()
const userStore = useUserStore()
const { showToast, toastMessage, triggerToast } = useToast()

const phase = ref<'quiz' | 'result'>('quiz')
const examResult = ref<ExamRecord | null>(null)
const leveledUp = ref(false)

function handleSubmit(answers: number[]) {
  const userId = authStore.currentUser?.id
  const level = authStore.currentUser?.level
  if (!userId || !level) return

  const levelBefore = userStore.currentUserLevel
  const result = examStore.submitExam(userId, level, answers)
  const levelAfter = userStore.currentUserLevel

  examResult.value = result
  leveledUp.value = levelBefore !== levelAfter
  phase.value = 'result'

  if (leveledUp.value) {
    triggerToast(`Congratulations! You've been promoted to Level ${levelAfter}.`, 4000)
  }
}
</script>
