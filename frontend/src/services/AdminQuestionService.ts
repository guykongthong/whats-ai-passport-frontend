import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { QuestionAdmin } from '@/types/admin'

export type CreateQuestionPayload = Omit<QuestionAdmin, 'id'>

export default {
  getQuestionsByLevel(levelNumber: number): Promise<AxiosResponse<QuestionAdmin[]>> {
    return apiClient
      .get('/admin/questions', { params: { levelNumber } })
      .catch(() => apiClient.get(`/admin/questions/level/${levelNumber}`))
  },

  createQuestion(data: CreateQuestionPayload): Promise<AxiosResponse<QuestionAdmin>> {
    return apiClient.post('/admin/questions', data)
  },

  updateQuestion(id: number, data: Partial<QuestionAdmin>): Promise<AxiosResponse<QuestionAdmin>> {
    return apiClient.put(`/admin/questions/${id}`, data)
  },

  deleteQuestion(id: number): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/admin/questions/${id}`)
  },
}
