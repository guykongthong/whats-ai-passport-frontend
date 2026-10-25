import { defineStore } from 'pinia'
import { computed, readonly, ref, reactive } from 'vue'
import { users as mockUsers } from '@/data/users'
import { levels } from '@/data/levels'
import type { User } from '@/types/User'

const MAX_LEVEL = levels.length

interface RegisterFields {
  nameTh: string,
  surnameTh: string,
  nameEn: string,
  surnameEn: string,
  province: string,
  email: string,
}

interface UserFilters {
  level: string | null
  province: string | null
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
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
    level: '1'
  })

  function login(identifier: string): 'success' | 'deactivated' | 'not_found' {
    const isEmail = identifier.includes('@')

    const found = ((users.value.find((u) => {
      if (isEmail) {
        return u.email === identifier
      } else {
        return u.email.split('@')[0] === identifier.split('@')[0]
      }
    }))) ?? null

    if (found) {
      const isDeactivated =
        found.isActive === false ||
        ('enabled' in found && (found as unknown as { enabled: boolean }).enabled === false)

      if (isDeactivated) {
        currentUser.value = null
        return 'deactivated'
      }
    }

    currentUser.value = found
    return found ? 'success' : 'not_found'
  }

  function logout() {
    currentUser.value = null
  }

  function register(fields: RegisterFields) {
    const newUser: User = {
      id: crypto.randomUUID(),
      nameTh: fields.nameTh,
      surnameTh: fields.surnameTh,
      name: fields.nameEn,
      surname: fields.surnameEn,
      province: fields.province,
      email: fields.email,
      level: '1',
      role: 'user',
      isActive: true,
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

  function levelUp(userId: string, passedLevel: string) {
    const user = users.value.find((u) => u.id === userId)
    if (!user) return
    const nextLevel = Math.min(Number(passedLevel) + 1, MAX_LEVEL)
    user.level = String(nextLevel)
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
    activateUser,
    updateUser,
  }
})
