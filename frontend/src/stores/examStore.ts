import { defineStore } from 'pinia'
import { ref } from 'vue'
import { questions } from '@/data/questions'
import { examRecords } from '@/data/examRecords'
import { useAuthStore } from '@/stores/authStore'
import { useLevelStore } from '@/stores/levelStore'
import type { AnsweredQuestion, ExamQuestion, ExamRecord } from '@/types/ExamContent'

const DEFAULT_PASS_CRITERIA = 60

export const useExamStore = defineStore('exam', () => {
  const examQuestions = ref<ExamQuestion[]>(questions)
  const records = ref<ExamRecord[]>(examRecords)

  function getQuestionsForLevel(level: string) {
    return examQuestions.value.filter((q) => q.id.startsWith(`l${level}-`))
  }

  function submitExam(userId: string, level: string, selectedIndexes: number[]): ExamRecord {
    const levelStore = useLevelStore()
    const passCriteria =
      levelStore.allLevels.find((l) => String(l.id) === String(level))?.passingScore ??
      DEFAULT_PASS_CRITERIA
    const levelQuestions = getQuestionsForLevel(level)

    const questionsAsked: AnsweredQuestion[] = levelQuestions.map((q, i) => ({
      questionID: q.id,
      question: q.question,
      choices: q.choices,
      answerIndex: q.answerIndex,
      selectedIndex: selectedIndexes[i] ?? -1,
    }))

    const correct = questionsAsked.filter((a) => a.selectedIndex === a.answerIndex).length
    const score = Math.round((correct / levelQuestions.length) * 100)
    const pass = score >= passCriteria

    const alreadyPassed = records.value.some(
      (r) => r.userId === userId && r.level === level && r.pass,
    )

    const record: ExamRecord = {
      id: crypto.randomUUID(),
      userId,
      level,
      score,
      completedAt: new Date().toISOString(),
      questionsAsked,
      passCriteria,
      pass,
    }
    records.value.push(record)

    if (pass && !alreadyPassed) {
      const authStore = useAuthStore()
      authStore.levelUp(userId, level)
    }

    return record
  }

  function addQuestion(level: string, question: string, choices: string[], answerIndex: number, description: string): ExamQuestion {

    const newQuestion: ExamQuestion = {
      id: `l${level}-${crypto.randomUUID()}`,
      question,
      choices,
      answerIndex,
      description,
    }
    examQuestions.value.push(newQuestion)
    return newQuestion
  }

  function updateQuestion(
    id: string,
    updates: { question: string; choices: string[]; answerIndex: number; description?: string },
  ): ExamQuestion | undefined {
    const existing = examQuestions.value.find((q) => q.id === id)
    if (!existing) return undefined

    existing.question = updates.question
    existing.choices = updates.choices
    existing.answerIndex = updates.answerIndex
    existing.description = updates.description

    return existing
  }

  return {
    examQuestions,
    records,
    getQuestionsForLevel,
    submitExam,
    addQuestion,
    updateQuestion,
  }
})
