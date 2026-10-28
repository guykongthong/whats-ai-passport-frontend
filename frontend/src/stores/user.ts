import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { useLevelStore } from './levelStore'
import UserService, { type UserLevelDetails } from '@/services/UserService'
import { getLevelName } from '@/utils/levelDisplay'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const levelStore = useLevelStore()

  // Reactive state: currentLevelDetails
  const currentLevelDetails = ref<UserLevelDetails | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Reactive state / getter: currentUserLevel
  const currentUserLevel = computed<number>(() => {
    if (currentLevelDetails.value?.level) {
      const parsed = Number(currentLevelDetails.value.level)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
    const authLvl = Number(authStore.currentUser?.level || 1)
    return isNaN(authLvl) || authLvl < 1 ? 1 : authLvl
  })

  // Helper to generate fallback UserLevelDetails from levelStore
  function getFallbackLevelDetails(level: number): UserLevelDetails {
    const foundLevel = levelStore.allLevels.find((l) => String(l.id) === String(level))
    const benefits = levelStore.getBenefitsForLevel(String(level)).map((b) => b.description)
    return {
      level: String(level),
      label: foundLevel?.label || getLevelName(level),
      passingScore: foundLevel?.passingScore ?? 70,
      benefits,
      description: foundLevel?.description || `Benefits and privileges for Level ${level}.`,
    }
  }

  // Fetch level details from backend with store fallback
  async function fetchLevelDetails(forceLevel?: number): Promise<UserLevelDetails> {
    loading.value = true
    error.value = null

    const targetLevel = forceLevel ?? currentUserLevel.value

    try {
      const response = await UserService.getUserLevelDetails()
      if (response?.data) {
        currentLevelDetails.value = response.data
        return response.data
      }
    } catch (err: unknown) {
      console.info('Backend getUserLevelDetails offline or unavailable, fallback to local store:', err)
    } finally {
      loading.value = false
    }

    const fallback = getFallbackLevelDetails(targetLevel)
    currentLevelDetails.value = fallback
    return fallback
  }

  /**
   * Action: upgradeUserLevel(newLevel: number)
   * - Updates Pinia state `currentUserLevel` and `authStore.currentUser.level`
   * - Re-fetches `getUserLevelDetails()` in the background
   * - Updates `localStorage` user cache
   */
  async function upgradeUserLevel(newLevel: number) {
    const nextLevelStr = String(newLevel)

    // 1. Immediately update Pinia state and localStorage via authStore
    authStore.upgradeUserLevel(newLevel)

    // 2. Immediately update level details reactively
    currentLevelDetails.value = getFallbackLevelDetails(newLevel)

    // 3. Re-fetch getUserLevelDetails() in the background
    try {
      const res = await UserService.getUserLevelDetails()
      if (res?.data && String(res.data.level) === nextLevelStr) {
        currentLevelDetails.value = res.data
      }
    } catch {
      // Keep optimistic fallback details if backend is unavailable
    }
  }

  return {
    currentUserLevel,
    currentLevelDetails,
    loading,
    error,
    fetchLevelDetails,
    upgradeUserLevel,
  }
})
