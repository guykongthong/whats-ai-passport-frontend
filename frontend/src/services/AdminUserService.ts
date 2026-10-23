import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { AdminUser } from '@/types/admin'

export default {
  getUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: object,
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

  toggleUserStatus(id: number, enabled: boolean): Promise<AxiosResponse<AdminUser>> {
    return apiClient.patch(`/admin/users/${id}/status`, { enabled })
  },
}
