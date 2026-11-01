import { defineStore } from 'pinia'
import { computed, readonly, ref, reactive } from 'vue'
import { users as mockUsers } from '@/data/users'
import { levels } from '@/data/levels'
import type { User, RegisterPayload } from '@/types'
import { isUserDeactivated } from '@/shared/utils/auth'
import { AuthService } from '@/services/AuthService'
import apiClient from '@/services/apiClient'

const MAX_LEVEL = levels.length


interface UserFilters {
  level: string | null
  province: string | null
  name: string
}

function getInitialUser(): User | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('currentUser')
      if (saved) {
        const parsed = JSON.parse(saved)
        const customAvatar = localStorage.getItem('custom_admin_avatar')
        if (customAvatar && !parsed.profileImageUrl) {
          parsed.profileImageUrl = customAvatar
        }
        return parsed
      }
    }
  } catch {
    // ignore
  }
  return null
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(getInitialUser())
  const users = ref<User[]>(mockUsers)

  const filters = ref<UserFilters>({ level: null, province: null, name: '' })
  const currentPage = ref(1)
  const pageSize = ref(10)

  const adminEditForm = reactive({
    nameTh: '',
    surnameTh: '',
    nameEn: '',
    surnameEn: '',
    email: '',
    province: '',
    level: '1',
  })

  function fallbackMockLogin(identifier: string): 'success' | 'deactivated' | 'not_found' {
    const isEmail = identifier.includes('@')

    const found =
      users.value.find((u) => {
        if (isEmail) {
          return u.email === identifier
        } else {
          return u.username === identifier || u.email.split('@')[0] === identifier.split('@')[0]
        }
      }) ?? null

    if (found && isUserDeactivated(found)) {
      currentUser.value = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
      }
      return 'deactivated'
    }

    currentUser.value = found
    if (found && typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(found))
    }
    return found ? 'success' : 'not_found'
  }

  async function login(
    identifier: string,
    password = '',
  ): Promise<'success' | 'deactivated' | 'not_found' | 'bad_credentials'> {
    try {
      const res = await AuthService.login({
        username: identifier.trim(),
        password: password.trim(),
      })

      if (res?.data?.access_token) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('access_token', res.data.access_token)
          localStorage.setItem('token', res.data.access_token)
        }

        const data = res.data
        const roles = Array.isArray(data.roles) ? data.roles : []
        const isAdmin = roles.includes('ROLE_ADMIN')

        const customAvatar = typeof localStorage !== 'undefined' ? localStorage.getItem('custom_admin_avatar') : null
        const profileImage = data.profileImageUrl || customAvatar || ''

        const userObj: User = {
          id: String(data.id),
          username: data.username,
          email: `${data.username}@example.com`,
          name: data.firstname,
          surname: data.lastname,
          firstname: data.firstname,
          lastname: data.lastname,
          level: String(data.currentLevel || 1),
          province: '',
          profileImageUrl: profileImage,
          role: isAdmin ? 'admin' : 'user',
          roles,
          isActive: data.enabled !== false,
          enabled: data.enabled !== false,
        }

        currentUser.value = userObj
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(userObj))
        }

        return 'success'
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (
        axiosErr?.response?.status === 403 ||
        axiosErr?.response?.data?.message?.includes('deactivated')
      ) {
        currentUser.value = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('currentUser')
          localStorage.removeItem('token')
          localStorage.removeItem('access_token')
          localStorage.removeItem('custom_admin_avatar')
        }
        return 'deactivated'
      }

      if (axiosErr?.response?.status === 401) {
        return 'bad_credentials'
      }

      console.warn('Backend authentication unavailable, trying local fallback:', err)
      return fallbackMockLogin(identifier)
    }

    return fallbackMockLogin(identifier)
  }

  function logout() {
    currentUser.value = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
      localStorage.removeItem('access_token')
      localStorage.removeItem('custom_admin_avatar')
    }
  }

  async function register(fields: RegisterPayload): Promise<User> {
    try {
      const res = await AuthService.register(fields)
      if (res?.data) {
        const data = res.data
        const newUser: User = {
          id: String(data.id),
          username: data.username,
          name: data.firstname,
          surname: data.lastname,
          firstname: data.firstname,
          lastname: data.lastname,
          province: data.province,
          email: data.email,
          profileImageUrl: data.profileImageUrl,
          level: String(data.currentLevel || 1),
          role: 'user',
          roles: ['ROLE_USER'],
          isActive: data.enabled !== false,
          enabled: data.enabled !== false,
        }
        users.value.push(newUser)
        return newUser
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (axiosErr?.response?.status === 409) {
        throw new Error(axiosErr.response.data?.message || 'Username or email already taken.')
      }
      if (axiosErr?.response?.data?.message) {
        throw new Error(axiosErr.response.data.message)
      }
      throw err
    }

    const existingUsername = users.value.find(
      (u) =>
        (u.username && u.username.toLowerCase() === fields.username.toLowerCase()) ||
        u.email.split('@')[0]?.toLowerCase() === fields.username.toLowerCase(),
    )
    if (existingUsername) {
      throw new Error('Username is already taken.')
    }

    const existingEmail = users.value.find(
      (u) => u.email.toLowerCase() === fields.email.toLowerCase(),
    )
    if (existingEmail) {
      throw new Error('Email is already registered.')
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username: fields.username,
      name: fields.firstname,
      surname: fields.lastname,
      province: fields.province,
      email: fields.email,
      profileImageUrl: fields.profileImageUrl,
      level: '1',
      role: 'user',
      isActive: true,
      enabled: true,
    }
    users.value.push(newUser)
    return newUser
  }

  function setFilters(next: Partial<UserFilters>) {
    filters.value = { ...filters.value, ...next }
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function deactivateUser(userId: string) {
    const user = users.value.find((u) => u.id === userId)
    if (user) user.isActive = false
  }

  const currentUserLevel = computed<number>(() => {
    const lvl = Number(currentUser.value?.level || 1)
    return isNaN(lvl) || lvl < 1 ? 1 : lvl
  })

  function upgradeUserLevel(newLevel: number) {
    const nextLevel = Math.min(Math.max(newLevel, 1), MAX_LEVEL)
    const nextLevelStr = String(nextLevel)

    if (currentUser.value) {
      currentUser.value.level = nextLevelStr
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        } catch {
          // ignore
        }
      }
    }

    const found = users.value.find((u) => u.id === currentUser.value?.id)
    if (found) {
      found.level = nextLevelStr
    }
  }

  function levelUp(userId: string, passedLevel: string) {
    const user = users.value.find((u) => u.id === userId)
    if (!user) return
    const nextLevel = Math.min(Number(passedLevel) + 1, MAX_LEVEL)
    user.level = String(nextLevel)

    if (currentUser.value && currentUser.value.id === userId) {
      currentUser.value.level = String(nextLevel)
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        } catch {
          // ignore
        }
      }
    }
  }

  function activateUser(userId: string) {
    const user = users.value.find((u) => u.id === userId)
    if (user) user.isActive = true
  }

  function updateUser(
    userId: string,
    patch: Partial<Pick<User, 'name' | 'surname' | 'nameTh' | 'surnameTh' | 'email' | 'province' | 'level'>>,
  ) {
    const user = users.value.find((u) => u.id === userId)
    if (!user) return
    Object.assign(user, patch)
  }

  const filteredUsers = computed(() =>
    users.value.filter((u) => {
      if (filters.value.level && u.level !== filters.value.level) return false
      if (filters.value.province && u.province !== filters.value.province) return false
      if (filters.value.name) {
        const query = filters.value.name.toLowerCase()
        const fullName = `${u.name} ${u.surname}`.toLowerCase()
        if (!fullName.includes(query)) return false
      }
      return true
    }),
  )

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredUsers.value.slice(start, start + pageSize.value)
  })

  function updateCurrentUser(patch: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...patch }
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
          if (patch.profileImageUrl) {
            localStorage.setItem('custom_admin_avatar', patch.profileImageUrl)
          }
        } catch {
          // ignore
        }
      }
    }
  }

  async function fetchMe(): Promise<User | null> {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('access_token')
        : null
    if (!token) return null

    try {
      const res = await apiClient.get('/me')
      if (res?.data) {
        const data = res.data
        const customAvatar = typeof localStorage !== 'undefined' ? localStorage.getItem('custom_admin_avatar') : null
        const profileImage = data.profileImageUrl || customAvatar || currentUser.value?.profileImageUrl || ''

        const roles = Array.isArray(currentUser.value?.roles) && currentUser.value.roles.length > 0
          ? currentUser.value.roles
          : (currentUser.value?.role === 'admin' ? ['ROLE_ADMIN'] : ['ROLE_USER'])
        const isAdmin = roles.includes('ROLE_ADMIN') || currentUser.value?.role === 'admin'

        const userObj: User = {
          id: String(data.id),
          username: currentUser.value?.username || data.email?.split('@')[0] || 'user',
          email: data.email || `${data.id}@example.com`,
          name: data.firstname,
          surname: data.lastname,
          firstname: data.firstname,
          lastname: data.lastname,
          level: String(data.currentLevel || 1),
          province: data.province || '',
          profileImageUrl: profileImage,
          role: isAdmin ? 'admin' : 'user',
          roles,
          isActive: true,
          enabled: true,
        }

        currentUser.value = userObj
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(userObj))
        }
        return userObj
      }
    } catch (err: unknown) {
      console.warn('Failed to fetch /me from backend:', err)
    }
    return currentUser.value
  }

  // Auto-fetch fresh profile from backend if token exists
  if (typeof localStorage !== 'undefined') {
    const existingToken = localStorage.getItem('token') || localStorage.getItem('access_token')
    if (existingToken) {
      fetchMe().catch(() => {})
    }
  }

  return {
    currentUser,
    currentUserLevel,
    users: readonly(users),
    filters: readonly(filters),
    currentPage: readonly(currentPage),
    pageSize: readonly(pageSize),
    filteredUsers,
    paginatedUsers,
    adminEditForm,
    login,
    logout,
    register,
    setFilters,
    setPage,
    deactivateUser,
    levelUp,
    upgradeUserLevel,
    activateUser,
    updateUser,
    updateCurrentUser,
    fetchMe,
  }
})
