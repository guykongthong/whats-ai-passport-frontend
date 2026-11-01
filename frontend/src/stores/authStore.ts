import { defineStore } from 'pinia'
import { computed, readonly, ref, reactive } from 'vue'
import { users as mockUsers } from '@/data/users'
import { levels } from '@/data/levels'
import type { User, RegisterPayload } from '@/types'
import { isUserDeactivated } from '@/shared/utils/auth'
import AuthService from '@/services/AuthService'

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
      return saved ? JSON.parse(saved) : null
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

  async function login(identifier: string, password?: string): Promise<'success' | 'deactivated' | 'not_found'> {
    // 1. Try backend POST /api/auth/login (Baseline API Contract)
    try {
      const res = await AuthService.login({
        username: identifier,
        password: password || '',
      })
      if (res?.data && res.data.access_token) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('access_token', res.data.access_token)
          localStorage.setItem('token', res.data.access_token)
        }

        const role = res.data.roles?.includes('ROLE_ADMIN') ? 'admin' : 'user'
        const authenticatedUser: User = {
          id: String(res.data.id),
          username: res.data.username,
          name: res.data.firstname,
          surname: res.data.lastname,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          province: '',
          email: `${res.data.username}@example.com`,
          profileImageUrl: res.data.profileImageUrl,
          level: String(res.data.currentLevel || '1'),
          role,
          roles: res.data.roles,
          isActive: res.data.enabled,
          enabled: res.data.enabled,
        }

        if (!res.data.enabled) {
          currentUser.value = null
          return 'deactivated'
        }

        currentUser.value = authenticatedUser
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(authenticatedUser))
        }
        return 'success'
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (axiosErr?.response?.status === 403) {
        currentUser.value = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('currentUser')
        }
        return 'deactivated'
      }
      if (axiosErr?.response?.status === 401) {
        return 'not_found'
      }
      // If backend offline or network error, proceed to mock fallback below
    }

    // 2. Offline / Mock fallback
    const isEmail = identifier.includes('@')

    const found = ((users.value.find((u) => {
      if (isEmail) {
        return u.email === identifier
      } else {
        return u.username === identifier || u.email.split('@')[0] === identifier.split('@')[0]
      }
    }))) ?? null

    if (found && isUserDeactivated(found)) {
      currentUser.value = null
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('currentUser')
      }
      return 'deactivated'
    }

    currentUser.value = found
    if (found && typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(found))
    }
    return found ? 'success' : 'not_found'
  }

  function logout() {
    currentUser.value = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
      localStorage.removeItem('access_token')
    }
  }

  async function register(fields: RegisterPayload): Promise<User> {
    // 1. Try backend POST /api/auth/register (Baseline API Contract)
    try {
      const res = await AuthService.register(fields)
      if (res?.data) {
        const created: User = {
          id: String(res.data.id),
          username: res.data.username,
          name: res.data.firstname,
          surname: res.data.lastname,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          province: res.data.province,
          email: res.data.email,
          profileImageUrl: res.data.profileImageUrl,
          level: String(res.data.currentLevel || '1'),
          role: 'user',
          isActive: res.data.enabled ?? true,
          enabled: res.data.enabled ?? true,
        }
        users.value.push(created)
        return created
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (axiosErr?.response?.data?.message) {
        throw new Error(axiosErr.response.data.message)
      }
      if (axiosErr?.response?.status === 409) {
        throw new Error('Username or email already taken.')
      }
      if (axiosErr?.response?.status === 400) {
        throw new Error('Missing or invalid registration field.')
      }
      // If network error / backend offline, proceed to mock fallback below
    }

    // 2. Offline / Mock fallback
    const existingUsername = users.value.find(
      (u) =>
        (u.username && u.username.toLowerCase() === fields.username.toLowerCase()) ||
        u.email.split('@')[0]?.toLowerCase() === fields.username.toLowerCase()
    )
    if (existingUsername) {
      throw new Error('Username is already taken.')
    }

    const existingEmail = users.value.find(
      (u) => u.email.toLowerCase() === fields.email.toLowerCase()
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
  }
})
