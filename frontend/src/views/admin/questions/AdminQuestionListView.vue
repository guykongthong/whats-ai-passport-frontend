
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import AdminQuestionService from '@/services/AdminQuestionService'
import type { QuestionAdmin } from '@/types/admin'

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

const selectedLevel = ref<number>(1)
const questions = ref<QuestionAdmin[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

async function fetchQuestions(levelNumber: number) {
  loading.value = true
  error.value = null

  try {
    const response = await AdminQuestionService.getQuestionsByLevel(levelNumber)
    questions.value = response.data || []
  } catch (err: unknown) {
    console.error(`Failed to fetch questions for level ${levelNumber}:`, err)
    error.value = `Failed to load questions for Level ${levelNumber} Exam. Please check your network connection or login session.`
    questions.value = []
  } finally {
    loading.value = false
  }
}

function switchLevel(levelNumber: number) {
  if (selectedLevel.value === levelNumber) return
  selectedLevel.value = levelNumber
  fetchQuestions(levelNumber)
}

onMounted(() => {
  fetchQuestions(selectedLevel.value)
})
</script>
