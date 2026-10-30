import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { AdminUser } from '@/types/admin'

export interface AdminUserFilters {
  name?: string
  level?: number
  province?: string
  [key: string]: unknown
}

export default {
  getUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: AdminUserFilters,
  ): Promise<AxiosResponse<AdminUser[]>> {
    return apiClient.get('/admin/users', {
      params: {
        page,
        pageSize,
        ...filters,
      },
    })
  },

  getUserById(id: number): Promise<AxiosResponse<AdminUser>> {
    return apiClient.get(`/admin/users/${id}`)
  },

  updateUser(id: number, data: Partial<AdminUser>): Promise<AxiosResponse<AdminUser>> {
    return apiClient.put(`/admin/users/${id}`, data)
  },

  /**
   * Toggles account status between active (true) and deactivated (false).
   * Aligned with API contract: PATCH /admin/users/{userId}/enabled
   */
  async toggleUserStatus(id: number, enabled: boolean): Promise<AxiosResponse<AdminUser>> {
    try {
      return await apiClient.patch(`/admin/users/${id}/enabled`, { enabled })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 404) {
        return await apiClient.patch(`/admin/users/${id}/status`, { enabled })
      }
      throw err
    }
  },
}
