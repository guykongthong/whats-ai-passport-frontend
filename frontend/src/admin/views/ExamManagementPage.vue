<template>
  <div class="min-h-screen bg-gradient-to-br from-[#00385e] to-[#4F6C83] flex flex-col relative font-display">
    <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />

    <NavBar 
      theme="dark"
      logo-text="The CA?T Passport"
      :user-name="adminDisplayName"
      :user-role="adminDisplayRole"
      :links="navLinks"
      @logout="handleLogout"
    />

    <!-- Main Container -->
    <main class="max-w-[1200px] mx-auto px-8 py-10 flex-1 w-full flex flex-col gap-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-white text-[32px] sm:text-[42px] font-extrabold" style="-webkit-text-stroke: 1.5px currentColor;">
          Question Bank
        </h1>
      </div>

      <!-- Progression SubNav -->
      <div class="flex flex-col gap-2 mt-2">
        <p class="text-white/90 font-bold text-[18px]">Exam for level progression</p>
        <div class="flex flex-wrap items-center gap-2 text-white/70 font-semibold text-[15px]">
          <template v-for="(level, idx) in levelStore.allLevels.slice(0, -1)" :key="level.id">
            <button 
              @click="activeProgression = level.id" 
              :class="['transition-colors', activeProgression === level.id ? 'text-white underline decoration-2 underline-offset-4 font-black' : 'hover:text-white']"
            >
              {{ level.name }} ➔ {{ levelStore.allLevels[idx + 1]?.name || '' }}
            </button>
            <span v-if="idx < levelStore.allLevels.length - 2">|</span>
          </template>
        </div>
      </div>

      <!-- Threshold settings next to subnav -->
      <div class="bg-white/10 rounded-2xl p-4 border border-white/20 flex flex-wrap justify-start items-center gap-4 sm:gap-6 text-white mt-1 w-full">
        <span class="font-bold text-sm">Pass Threshold:</span>
        <PassCriteriaForm v-model="passingScore" />
        <button 
          @click="saveThreshold"
          class="bg-white text-[#00385e] hover:bg-white/90 text-xs font-bold rounded-lg px-4 py-1.5"
        >
          Apply
        </button>
      </div>

      <!-- Questions List (Preview) -->
      <QuestionBankPreview :questions="filteredQuestions" @delete="deleteQuestion" @save="handleQuestionUpdate" />
      <ExamQuestionForm :levels="levelOptions" @submit="handleQuestionCreate" />
    </main>

    <Footer 
      theme="dark"
      logo-text="WHAT'S"
      :links="footerLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NavBar from '@/shared/components/NavBar.vue'
import Footer from '@/shared/components/Footer.vue'
import Toast from '@/shared/components/Toast.vue'
import PassCriteriaForm from '@/admin/components/PassCriteriaForm.vue'
import QuestionBankPreview from '@/admin/components/QuestionBankPreview.vue'
import { useAuthStore, useLevelStore, useExamStore } from '@/stores'
import { adminNavLinks, adminFooterLinks } from '@/data/navigation'
import { useToast } from '@/composables/useToast'
import ExamQuestionForm from '../components/ExamQuestionForm.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const levelStore = useLevelStore()
const examStore = useExamStore()
const router = useRouter()
const { showToast, toastMessage, triggerToast } = useToast()

const activeProgression = ref(levelStore.allLevels[0]?.id || '')
const passingScore = ref(70)

const levelOptions = computed(() => {
  return levelStore.allLevels.map(level => ({
    id: level.id,
    name: level.label ?? level.name
  }))
})

interface Question {
  id: string
  progressionId: string
  questionText: string
  options: string[]
  correctIndex: number
  description?: string
}

// Map the real examStore questions to the component interface structure
const mappedQuestions = computed<Question[]>(() => {
  return examStore.examQuestions.map((q) => {
    const match = q.id.match(/^l(\d+)-/)
    const progressionId = match?.[1] ?? ''
    return {
      id: q.id,
      progressionId,
      questionText: q.question,
      options: q.choices,
      correctIndex: q.answerIndex + 1,
      description: q.description
    }
  })
})

const adminDisplayName = computed(() => {
  if (authStore.currentUser) {
    return `${authStore.currentUser.name} ${authStore.currentUser.surname}`
  }
  return 'Admin'
})

const adminDisplayRole = computed(() => {
  if (authStore.currentUser) {
    return `${authStore.currentUser.role} ${authStore.currentUser.id.slice(0, 8)}`
  }
  return 'Admin'
})

// Sync passing score with selected progression source level
watch(activeProgression, (newProgId) => {
  const found = levelStore.allLevels.find(l => String(l.id) === String(newProgId))
  if (found) {
    passingScore.value = found.passingScore ?? 70
  }
}, { immediate: true })

const filteredQuestions = computed(() => {
  return mappedQuestions.value.filter(q => q.progressionId === activeProgression.value)
})

async function saveThreshold() {
  const updated = levelStore.setPassCriteria(activeProgression.value, passingScore.value)
  if (updated) {
    await triggerToast(`Threshold for Level ${activeProgression.value} updated to ${passingScore.value}%.`, 1200)
  }
}

async function deleteQuestion(id: string) {
  examStore.examQuestions = examStore.examQuestions.filter(q => q.id !== id)
  await triggerToast('Question deleted.', 1000)
}

async function handleQuestionUpdate(payload: {
  id: string
  questionText: string
  options: string[]
  correctIndex: number
  description?: string
}) {
  examStore.updateQuestion(payload.id, {
    question: payload.questionText,
    choices: payload.options,
    answerIndex: payload.correctIndex - 1,
    description: payload.description,
  })
  await triggerToast('Question updated.', 1000)
}

async function handleQuestionCreate(payload: {
  progressionId: string
  questionText: string
  options: string[]
  correctIndex: number
  description?: string
}) {
  examStore.addQuestion(
    payload.progressionId,
    payload.questionText,
    payload.options,
    payload.correctIndex - 1,
    payload.description ?? '',
  )
  await triggerToast('Question added.', 1000)
}

const navLinks = adminNavLinks
const footerLinks = adminFooterLinks

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

</script>
