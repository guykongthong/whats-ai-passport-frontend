import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { User } from '@/types/User'

export interface UserProfile extends User {
  levelDetails?: UserLevelDetails
}

export interface UserLevelDetails {
  level?: string
  currentLevel?: number
  label?: string
  levelName?: string
  passingScore?: number
  benefits: string[]
  services?: string[]
  description?: string
}

export default {
  /**
   * GET /api/me (Baseline API Contract)
   * Fetch the current authenticated user's profile
   */
  getUserProfile(): Promise<AxiosResponse<UserProfile>> {
    return apiClient.get('/me').catch(() => apiClient.get('/v1/user/me'))
  },

  /**
   * PUT /api/me (Baseline API Contract)
   * Update the current authenticated user's profile
   */
  updateUserProfile(data: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
    return apiClient.put('/me', data).catch(() => apiClient.put('/v1/user/me', data))
  },

  /**
   * GET /api/me/level (Baseline API Contract)
   * Fetch the level, benefits, and services for the current user
   */
  getUserLevelDetails(): Promise<AxiosResponse<UserLevelDetails>> {
    return apiClient.get('/me/level').catch(() => apiClient.get('/v1/user/me/level-details'))
  },
}
