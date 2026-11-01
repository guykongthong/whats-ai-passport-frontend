import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { ExamQuestion, ExamRecord } from '@/types/ExamContent'

export interface ContractQuestion {
  id: number | string
  questionText: string
  choices: string[]
}

export interface ExamPaperResponse {
  levelNumber: number
  passCriteria: number
  totalQuestions: number
  questions: ContractQuestion[]
}

export interface ExamAnswerPayload {
  questionId: number | string
  selectedChoice: number
}

export interface ExamAnswer {
  questionId: string | number
  selectedIndex?: number
  selectedChoice?: number
}

export interface ExamSubmissionPayload {
  levelNumber?: number
  answers: (ExamAnswerPayload | ExamAnswer)[]
}

export interface BadgeUnlocked {
  name: string
  imageUrl: string
}

export interface ExamSubmitResponse {
  score: number
  totalScore: number
  passCriteria: number
  passed: boolean
  oldLevel: number
  newLevel: number
  badgeUnlocked: BadgeUnlocked | null
  attemptDateTime: string
}

export default {
  /**
   * GET /api/me/exam (Baseline API Contract)
   * Fetch exam questions for the next level (currentLevel + 1).
   */
  getExamQuestions(): Promise<AxiosResponse<ExamPaperResponse | ExamQuestion[]>> {
    return apiClient.get('/me/exam')
  },

  /**
   * POST /api/me/exam/submit (Baseline API Contract)
   * Submit exam answers and receive grading result.
   */
  submitExam(payload: ExamSubmissionPayload): Promise<AxiosResponse<ExamSubmitResponse | ExamRecord>> {
    return apiClient.post('/me/exam/submit', payload)
  },
}
