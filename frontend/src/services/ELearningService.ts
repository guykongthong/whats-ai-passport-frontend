import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { ELearningVideo } from '@/types/ExamContent'

export default {
  /**
   * GET /api/v1/elearning/current-level
   * Fetch e-learning videos for the current user's level
   */
  getCurrentLevelVideos(): Promise<AxiosResponse<ELearningVideo[]>> {
    return apiClient.get('/v1/elearning/current-level')
  },
}
