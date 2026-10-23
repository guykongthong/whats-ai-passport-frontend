import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { ExamQuestion, ExamRecord } from '@/types/ExamContent'

export interface ExamSubmissionPayload {
  answers: ExamAnswer[]
}

export interface ExamAnswer {
  questionId: string
  selectedIndex: number
}

export default {
  /**
   * GET /api/v1/exam/questions
   * Fetch exam questions for the current user's level
   */
  getExamQuestions(): Promise<AxiosResponse<ExamQuestion[]>> {
    return apiClient.get('/v1/exam/questions')
  },

  /**
   * POST /api/v1/exam/submit
   * Submit exam answers and receive the result
   */
  submitExam(payload: ExamSubmissionPayload): Promise<AxiosResponse<ExamRecord>> {
    return apiClient.post('/v1/exam/submit', payload)
  },
}
