import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { User } from '@/types/User'

export interface UserProfile extends User {
  levelDetails?: UserLevelDetails
}

export interface UserLevelDetails {
  level: string
  label: string
  passingScore: number
  benefits: string[]
  description?: string
}

export default {
  /**
   * GET /api/v1/user/me
   * Fetch the current authenticated user's profile
   */
  getUserProfile(): Promise<AxiosResponse<UserProfile>> {
    return apiClient.get('/v1/user/me')
  },

  /**
   * PUT /api/v1/user/me
   * Update the current authenticated user's profile
   */
  updateUserProfile(data: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
    return apiClient.put('/v1/user/me', data)
  },

  /**
   * GET /api/v1/user/me/level-details
   * Fetch the level benefits and details for the current user
   */
  getUserLevelDetails(): Promise<AxiosResponse<UserLevelDetails>> {
    return apiClient.get('/v1/user/me/level-details')
  },
}
