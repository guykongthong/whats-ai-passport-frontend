import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { User } from '@/types/User'

export interface BadgeItem {
  name: string
  imageUrl?: string
  unlockedAt?: string
}

export interface UserExamHistoryItem {
  id?: number | string
  levelNumber: number
  score: number
  totalScore: number
  passed: boolean
  attemptDateTime: string
  badgeName?: string | null
}

export interface UserProfile extends Omit<Partial<User>, 'id'> {
  id?: string | number
  username?: string
  firstname?: string
  lastname?: string
  name?: string
  surname?: string
  nameTh?: string
  surnameTh?: string
  email?: string
  province?: string
  profileImageUrl?: string
  currentLevel?: number
  level?: string
  role?: 'admin' | 'user'
  roles?: readonly string[] | string[]
  isActive?: boolean
  enabled?: boolean
  badges?: BadgeItem[]
  examHistories?: UserExamHistoryItem[]
  availableServices?: string[]
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
    return apiClient.get('/me')
  },

  /**
   * PUT /api/me (Baseline API Contract)
   * Update the current authenticated user's profile
   */
  updateUserProfile(data: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
    return apiClient.put('/me', data)
  },

  /**
   * GET /api/me/level (Baseline API Contract)
   * Fetch the level, benefits, and services for the current user
   */
  getUserLevelDetails(): Promise<AxiosResponse<UserLevelDetails>> {
    return apiClient.get('/me/level')
  },
}
