import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { RegisterPayload } from '@/types/User'

export interface LoginPayload {
  username: string
  password?: string
}

export interface LoginResponse {
  access_token: string
  id: number | string
  username: string
  firstname: string
  lastname: string
  profileImageUrl?: string
  currentLevel: number
  roles: string[]
  enabled: boolean
}

export interface RegisterResponse {
  id: number | string
  username: string
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl?: string
  currentLevel: number
  enabled: boolean
}

export const AuthService = {
  /**
   * POST /api/auth/login (Baseline API Contract)
   * Guest login with username and password.
   */
  login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> {
    return apiClient.post('/auth/login', payload)
  },

  /**
   * POST /api/auth/register (Baseline API Contract)
   * Register a new user account.
   */
  register(payload: RegisterPayload): Promise<AxiosResponse<RegisterResponse>> {
    return apiClient.post('/auth/register', payload)
  },
}

export default AuthService
