import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { ELearningVideo } from '@/types/ExamContent'

export interface VideoItem {
  id: number | string
  title: string
  description?: string
  videoUrl: string
}

export interface UserVideosResponse {
  levelNumber: number
  videos: VideoItem[]
}

export default {
  /**
   * GET /api/me/videos (Baseline API Contract)
   * Fetch e-learning videos for the user's current level.
   * Gracefully falls back to legacy /v1/elearning/current-level if needed.
   */
  getCurrentLevelVideos(): Promise<AxiosResponse<UserVideosResponse | ELearningVideo[]>> {
    return apiClient.get('/me/videos').catch(() => apiClient.get('/v1/elearning/current-level'))
  },
}
