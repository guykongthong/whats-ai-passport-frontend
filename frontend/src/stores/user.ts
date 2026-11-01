import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { useLevelStore } from './levelStore'
import { useExamStore } from './examStore'
import type { User } from '@/types/User'
import UserService, {
  type UserProfile,
  type UserLevelDetails,
  type BadgeItem,
  type UserExamHistoryItem,
} from '@/services/UserService'
import { getLevelName } from '@/utils/levelDisplay'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const levelStore = useLevelStore()

  // Reactive state: currentLevelDetails
  const currentLevelDetails = ref<UserLevelDetails | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Reactive state: userProfile
  const userProfile = ref<UserProfile | null>(null)
  const isProfileLoading = ref(false)
  const profileError = ref<string | null>(null)

  // Reactive state / getter: currentUserLevel
  const currentUserLevel = computed<number>(() => {
    // 1. Prioritize userProfile from /api/me
    const profileLvl =
      userProfile.value?.currentLevel ??
      (userProfile.value?.level ? Number(userProfile.value.level) : undefined)
    if (profileLvl !== undefined && !isNaN(profileLvl) && profileLvl > 0) {
      return profileLvl
    }

    // 2. Prioritize authenticated current user from authStore
    const authLvl = Number(authStore.currentUser?.level)
    if (!isNaN(authLvl) && authLvl > 0) {
      return authLvl
    }

    // 3. Fallback to currentLevelDetails
    const raw =
      currentLevelDetails.value?.currentLevel ??
      (currentLevelDetails.value?.level ? Number(currentLevelDetails.value.level) : undefined)
    if (raw !== undefined && !isNaN(raw) && raw > 0) {
      return raw
    }

    return 1
  })

  function resetUserState() {
    userProfile.value = null
    currentLevelDetails.value = null
    profileError.value = null
    error.value = null
  }

  // Computed badges with single-fetch cache & offline fallback
  const badges = computed<BadgeItem[]>(() => {
    if (userProfile.value?.badges && userProfile.value.badges.length > 0) {
      return userProfile.value.badges
    }
    const examStore = useExamStore()
    const currentUserId = authStore.currentUser?.id
    if (!currentUserId) return []
    const passed = examStore.records.filter((r) => r.userId === currentUserId && r.pass)
    const passedLevels = new Set(passed.map((r) => String(r.level)))
    return levelStore.allLevels
      .filter((l) => passedLevels.has(String(l.id)))
      .map((l) => ({
        name: `Level ${l.id} - ${l.label || l.name}`,
        imageUrl: '',
        unlockedAt: new Date().toISOString(),
      }))
  })

  // Computed exam histories with single-fetch cache & offline fallback
  const examHistories = computed<UserExamHistoryItem[]>(() => {
    if (userProfile.value?.examHistories && userProfile.value.examHistories.length > 0) {
      return userProfile.value.examHistories
    }
    const examStore = useExamStore()
    const currentUserId = authStore.currentUser?.id
    if (!currentUserId) return []
    return examStore.records
      .filter((r) => r.userId === currentUserId)
      .map((r) => ({
        id: r.id,
        levelNumber: Number(r.level) || 1,
        score: r.score,
        totalScore: 100,
        passed: r.pass,
        attemptDateTime: r.completedAt,
        badgeName: r.pass ? `Level ${r.level}` : null,
      }))
  })

  // Computed available services with single-fetch cache & offline fallback
  const availableServices = computed<string[]>(() => {
    if (userProfile.value?.availableServices && userProfile.value.availableServices.length > 0) {
      return userProfile.value.availableServices
    }
    if (currentLevelDetails.value?.services && currentLevelDetails.value.services.length > 0) {
      return currentLevelDetails.value.services
    }
    const lvl = currentUserLevel.value
    return levelStore.allServices.filter((s) => Number(s.level) <= lvl).map((s) => s.name)
  })

  // Helper to normalize backend API response (supports GET /me/level baseline contract)
  function normalizeLevelDetails(data: UserLevelDetails): UserLevelDetails {
    const rawLevel = data.currentLevel ?? (data.level ? Number(data.level) : currentUserLevel.value)
    const levelNum = Number(rawLevel) || 1
    const foundLevel = levelStore.allLevels.find((l) => String(l.id) === String(levelNum))

    return {
      level: String(levelNum),
      currentLevel: levelNum,
      label: data.levelName || data.label || foundLevel?.label || getLevelName(levelNum),
      levelName: data.levelName || data.label || foundLevel?.label || getLevelName(levelNum),
      passingScore: data.passingScore ?? foundLevel?.passingScore ?? 70,
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      services: Array.isArray(data.services) ? data.services : [],
      description: data.description || foundLevel?.description || `Benefits and privileges for Level ${levelNum}.`,
    }
  }

  // Helper to generate fallback UserLevelDetails from levelStore
  function getFallbackLevelDetails(level: number): UserLevelDetails {
    const foundLevel = levelStore.allLevels.find((l) => String(l.id) === String(level))
    const benefits = levelStore.getBenefitsForLevel(String(level)).map((b) => b.description)
    return {
      level: String(level),
      currentLevel: level,
      label: foundLevel?.label || getLevelName(level),
      levelName: foundLevel?.label || getLevelName(level),
      passingScore: foundLevel?.passingScore ?? 70,
      benefits,
      services: levelStore.allServices.filter((s) => Number(s.level) <= level).map((s) => s.name),
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
        const normalized = normalizeLevelDetails(response.data)
        if (!normalized.currentLevel || normalized.currentLevel !== targetLevel) {
          normalized.currentLevel = targetLevel
          normalized.level = String(targetLevel)
          const foundLevel = levelStore.allLevels.find((l) => String(l.id) === String(targetLevel))
          if (foundLevel) {
            normalized.label = foundLevel.label || getLevelName(targetLevel)
            normalized.levelName = foundLevel.label || getLevelName(targetLevel)
            normalized.description =
              foundLevel.description || `Benefits and privileges for Level ${targetLevel}.`
          }
        }
        currentLevelDetails.value = normalized
        return normalized
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
   * Action: fetchUserProfile(force = false)
   * Single-fetch action to share profile data across all nested sub-routes
   */
  async function fetchUserProfile(force = false): Promise<UserProfile | null> {
    if (userProfile.value && !force) {
      return userProfile.value
    }

    isProfileLoading.value = true
    profileError.value = null

    try {
      const response = await UserService.getUserProfile()
      if (response?.data) {
        userProfile.value = response.data
        if (response.data.currentLevel) {
          const lvl = Number(response.data.currentLevel)
          if (!isNaN(lvl) && lvl > 0) {
            authStore.upgradeUserLevel(lvl)
          }
        }
        return userProfile.value
      }
    } catch (err: unknown) {
      console.info('Backend getUserProfile offline or unavailable, fallback to authStore:', err)
    } finally {
      isProfileLoading.value = false
    }

    // Fallback for mock environment
    const cu = authStore.currentUser
    if (cu) {
      userProfile.value = {
        id: cu.id,
        username: cu.username || cu.email,
        firstname: cu.firstname || cu.name || '',
        lastname: cu.lastname || cu.surname || '',
        name: cu.name || '',
        surname: cu.surname || '',
        nameTh: cu.nameTh,
        surnameTh: cu.surnameTh,
        email: cu.email,
        province: cu.province,
        profileImageUrl: cu.profileImageUrl,
        currentLevel: Number(cu.level) || 1,
        role: cu.role,
        isActive: cu.isActive,
        enabled: cu.enabled ?? cu.isActive,
      }
    }
    return userProfile.value
  }

  /**
   * Action: updateUserProfile(data)
   * Updates profile on backend and updates local store state
   */
  async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    isProfileLoading.value = true
    profileError.value = null

    try {
      const res = await UserService.updateUserProfile(data)
      const updatedData = res?.data || data

      if (userProfile.value) {
        userProfile.value = { ...userProfile.value, ...updatedData }
      } else if (authStore.currentUser) {
        userProfile.value = {
          id: authStore.currentUser.id,
          username: authStore.currentUser.username || authStore.currentUser.email,
          firstname: updatedData.firstname || authStore.currentUser.firstname || authStore.currentUser.name || '',
          lastname: updatedData.lastname || authStore.currentUser.lastname || authStore.currentUser.surname || '',
          name: updatedData.firstname || authStore.currentUser.name || '',
          surname: updatedData.lastname || authStore.currentUser.surname || '',
          nameTh: updatedData.nameTh || authStore.currentUser.nameTh,
          surnameTh: updatedData.surnameTh || authStore.currentUser.surnameTh,
          email: updatedData.email || authStore.currentUser.email,
          province: updatedData.province || authStore.currentUser.province,
          profileImageUrl: updatedData.profileImageUrl || authStore.currentUser.profileImageUrl,
          currentLevel: Number(authStore.currentUser.level) || 1,
          role: authStore.currentUser.role,
          isActive: authStore.currentUser.isActive,
          enabled: authStore.currentUser.enabled ?? authStore.currentUser.isActive,
          ...updatedData,
        } as UserProfile
      }

      if (authStore.currentUser) {
        const currentUserId = String(authStore.currentUser.id)
        const patch: Partial<User> = {}
        if (updatedData.firstname !== undefined) {
          patch.name = updatedData.firstname
          patch.firstname = updatedData.firstname
        }
        if (updatedData.name !== undefined) patch.name = updatedData.name
        if (updatedData.lastname !== undefined) {
          patch.surname = updatedData.lastname
          patch.lastname = updatedData.lastname
        }
        if (updatedData.surname !== undefined) patch.surname = updatedData.surname
        if (updatedData.nameTh !== undefined) patch.nameTh = updatedData.nameTh
        if (updatedData.surnameTh !== undefined) patch.surnameTh = updatedData.surnameTh
        if (updatedData.email !== undefined) patch.email = updatedData.email
        if (updatedData.province !== undefined) patch.province = updatedData.province
        if (updatedData.profileImageUrl !== undefined) patch.profileImageUrl = updatedData.profileImageUrl

        authStore.currentUser = { ...authStore.currentUser, ...patch }
        authStore.updateUser(currentUserId, patch)
      }

      return userProfile.value
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to update profile'
      console.error('updateUserProfile error:', err)
      profileError.value = errMsg
      throw err
    } finally {
      isProfileLoading.value = false
    }
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

    if (userProfile.value) {
      userProfile.value.currentLevel = newLevel
      userProfile.value.level = nextLevelStr
    }

    // 2. Immediately update level details reactively
    currentLevelDetails.value = getFallbackLevelDetails(newLevel)

    // 3. Re-fetch getUserLevelDetails() in the background
    try {
      const res = await UserService.getUserLevelDetails()
      if (res?.data) {
        const resLvl = String(res.data.currentLevel ?? res.data.level ?? '')
        if (resLvl === nextLevelStr || resLvl === '') {
          currentLevelDetails.value = normalizeLevelDetails(res.data)
        }
      }
    } catch {
      // Keep optimistic fallback details if backend is unavailable
    }
  }

  /**
   * Action: recordExamAttempt(attempt, badgeUnlocked) (#44)
   * Records every exam attempt and unlocked badges immediately into local store state
   */
  function recordExamAttempt(
    attempt: UserExamHistoryItem,
    badgeUnlocked?: { name: string; imageUrl?: string } | null,
  ) {
    if (!userProfile.value) {
      const cu = authStore.currentUser
      userProfile.value = {
        id: cu?.id || '1',
        username: cu?.username || cu?.email || 'user',
        firstname: cu?.firstname || cu?.name || 'User',
        lastname: cu?.lastname || cu?.surname || '',
        name: cu?.name || '',
        surname: cu?.surname || '',
        email: cu?.email || '',
        province: cu?.province || '',
        currentLevel: currentUserLevel.value,
        examHistories: [],
        badges: [],
      }
    }

    if (!Array.isArray(userProfile.value.examHistories)) {
      userProfile.value.examHistories = []
    }

    // Prepend attempt to the top of the history
    userProfile.value.examHistories.unshift({ ...attempt })

    // Also sync with examStore for offline records
    const examStore = useExamStore()
    const currentUserId = String(authStore.currentUser?.id || userProfile.value.id || '1')
    examStore.records.unshift({
      id: String(attempt.id || Date.now()),
      userId: currentUserId,
      level: String(attempt.levelNumber),
      score: attempt.score,
      completedAt: attempt.attemptDateTime,
      questionsAsked: [],
      passCriteria: 3,
      pass: attempt.passed,
    })

    // If a new badge was unlocked and passed, record into badges array
    if (attempt.passed && badgeUnlocked) {
      if (!Array.isArray(userProfile.value.badges)) {
        userProfile.value.badges = []
      }
      const alreadyHasBadge = userProfile.value.badges.some((b) => b.name === badgeUnlocked.name)
      if (!alreadyHasBadge) {
        userProfile.value.badges.push({
          name: badgeUnlocked.name,
          imageUrl: badgeUnlocked.imageUrl || '',
          unlockedAt: attempt.attemptDateTime,
        })
      }
    }
  }

  /**
   * Action: clearUserData()
   * Clears cached user profile and level data upon logout to prevent cross-account leaks.
   */
  function clearUserData() {
    userProfile.value = null
    currentLevelDetails.value = null
    loading.value = false
    error.value = null
    isProfileLoading.value = false
    profileError.value = null
  }

  return {
    currentUserLevel,
    currentLevelDetails,
    userProfile,
    isProfileLoading,
    profileError,
    badges,
    examHistories,
    availableServices,
    loading,
    error,
    fetchLevelDetails,
    fetchUserProfile,
    updateUserProfile,
    upgradeUserLevel,
    recordExamAttempt,
    resetUserState,
    clearUserData,
  }
})
