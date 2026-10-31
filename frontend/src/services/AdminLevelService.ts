import type { AxiosResponse } from 'axios'
import apiClient from './apiClient'
import type { LevelAdmin } from '@/types/admin'

export default {
  getLevels(): Promise<AxiosResponse<LevelAdmin[]>> {
    return apiClient.get('/admin/levels')
  },

  async getLevel(levelNumber: number): Promise<AxiosResponse<LevelAdmin>> {
    const response = await this.getLevels()
    const target = Number(levelNumber)
    const found = response.data?.find((l) => l.levelNumber === target)
    if (!found) {
      throw new Error(`Level ${levelNumber} configuration not found.`)
    }
    return {
      ...response,
      data: found,
    }
  },

  updateLevel(levelNumber: number, data: Partial<LevelAdmin>): Promise<AxiosResponse<LevelAdmin>> {
    return apiClient.put(`/admin/levels/${levelNumber}`, data)
  },
}
