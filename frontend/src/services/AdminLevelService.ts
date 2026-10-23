import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { LevelAdmin } from '@/types/admin'

export default {
  getLevels(): Promise<AxiosResponse<LevelAdmin[]>> {
    return apiClient.get('/admin/levels')
  },

  getLevel(levelNumber: number): Promise<AxiosResponse<LevelAdmin>> {
    return apiClient.get(`/admin/levels/${levelNumber}`)
  },

  updateLevel(levelNumber: number, data: object): Promise<AxiosResponse<LevelAdmin>> {
    return apiClient.put(`/admin/levels/${levelNumber}`, data)
  },
}
