import { defineStore } from 'pinia'
import { ref } from 'vue'
import AdminUserService from '@/services/AdminUserService'
import type { AdminUser, ExamHistoryItem } from '@/types/admin'

export const useAdminUserStore = defineStore('adminUser', () => {
  // State
  const selectedUser = ref<AdminUser | null>(null)
  const userExamHistory = ref<ExamHistoryItem[]>([])
  const isLoading = ref<boolean>(false)

  // Actions
  /**
   * Loads user details from backend by id.
   * Avoids redundant API calls if the user is already loaded in state (Criteria #11).
   */
  async function fetchUserById(id: number): Promise<AdminUser | null> {
    if (selectedUser.value && selectedUser.value.id === id) {
      return selectedUser.value
    }

    isLoading.value = true
    try {
      const response = await AdminUserService.getUserById(id)
      selectedUser.value = response.data
      userExamHistory.value = response.data.examHistories || []
      return selectedUser.value
    } catch (error) {
      console.error(`Failed to fetch user by id (${id}):`, error)
      selectedUser.value = null
      userExamHistory.value = []
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Loads exam history records for user by id.
   * Leverages cached history if already present for the active user.
   */
  async function fetchUserHistory(id: number): Promise<ExamHistoryItem[]> {
    if (selectedUser.value && selectedUser.value.id === id) {
      return userExamHistory.value
    }

    isLoading.value = true
    try {
      const response = await AdminUserService.getUserById(id)
      selectedUser.value = response.data
      userExamHistory.value = response.data.examHistories || []
      return userExamHistory.value
    } catch (error) {
      console.error(`Failed to fetch exam history for user (${id}):`, error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates local state so changes reflect immediately across all tabs.
   */
  function updateSelectedUser(data: Partial<AdminUser>) {
    if (selectedUser.value) {
      selectedUser.value = { ...selectedUser.value, ...data }
    }
  }

  /**
   * Toggles account enabled status for a user and updates selectedUser state in cache.
   */
  async function toggleUserStatus(id: number, enabled: boolean): Promise<AdminUser | null> {
    const response = await AdminUserService.toggleUserStatus(id, enabled)
    if (selectedUser.value && selectedUser.value.id === id) {
      selectedUser.value = { ...selectedUser.value, enabled }
    }
    return response.data || selectedUser.value
  }

  /**
   * Cleans up state when leaving the view.
   */
  function clearSelectedUser() {
    selectedUser.value = null
    userExamHistory.value = []
    isLoading.value = false
  }

  return {
    // State
    selectedUser,
    userExamHistory,
    isLoading,
    // Actions
    fetchUserById,
    fetchUserHistory,
    updateSelectedUser,
    toggleUserStatus,
    clearSelectedUser,
  }
})

export default useAdminUserStore
