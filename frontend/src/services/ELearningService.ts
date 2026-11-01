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

export interface CreateVideoPayload {
  level: number
  title: string
  description?: string
  videoUrl: string
}

export default {
  /**
   * GET /api/me/videos (Baseline API Contract)
   * Fetch e-learning videos for the user's current level.
   */
  getCurrentLevelVideos(): Promise<AxiosResponse<UserVideosResponse | ELearningVideo[]>> {
    return apiClient.get('/me/videos')
  },

  /**
   * Admin: List all eLearning videos from server
   */
  adminGetVideos(): Promise<AxiosResponse<VideoItem[]>> {
    return apiClient.get('/admin/elearning').catch(() => apiClient.get('/admin/videos'))
  },

  /**
   * Admin: Publish eLearning video to server database
   */
  adminCreateVideo(payload: CreateVideoPayload): Promise<AxiosResponse<VideoItem>> {
    return apiClient.post('/admin/elearning', payload).catch(() => apiClient.post('/admin/videos', payload))
  },

  /**
   * Admin: Delete eLearning video from server database
   */
  adminDeleteVideo(id: string | number): Promise<AxiosResponse<void>> {
    return apiClient.delete(`/admin/elearning/${id}`).catch(() => apiClient.delete(`/admin/videos/${id}`))
  },
}
