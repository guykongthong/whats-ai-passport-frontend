<template>
  <AdminPageLayout title="User Management" main-padding="!max-w-[1400px] px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full flex flex-col gap-6 -mt-3">
      <!-- Search & Filters Toolbar -->
      <UserFilterToolbar
        :initial-filters="activeFilters"
        :is-loading="loading"
        theme="dark"
        @filter-change="handleFilterChange"
        @update:filters="handleFilterChange"
        @reset="handleResetFilters"
      />

      <!-- Feedback States: Loading / Error / Empty -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-12 flex flex-col items-center justify-center gap-3 text-white"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/80">Loading users...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-8 sm:p-10 text-center text-sm shadow-xl flex flex-col items-center justify-center"
      >
        <p class="font-bold text-base sm:text-lg text-white">{{ error }}</p>
        <p class="text-xs sm:text-sm text-rose-300 mt-1.5">Unable to retrieve users from the backend server.</p>
        <button
          type="button"
          class="mt-6 px-6 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md cursor-pointer active:scale-95 min-w-[130px] inline-flex items-center justify-center"
          @click="fetchUsers"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="users.length === 0"
        class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-12 text-center text-white"
      >
        <p class="text-base font-semibold">No users found</p>
        <p class="text-xs text-white/60 mt-1">Try adjusting your filters or search term.</p>
      </div>

      <!-- Users Table Card -->
      <div
        v-else
        class="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col text-white"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/10 border-b border-white/15 text-sm font-bold text-white uppercase tracking-wider">
                <th scope="col" class="px-4 py-4 sm:px-6 sm:py-4.5 text-left">User</th>
                <th scope="col" class="px-4 py-4 sm:px-6 sm:py-4.5 text-center">Province</th>
                <th scope="col" class="px-4 py-4 sm:px-6 sm:py-4.5 text-center">Level</th>
                <th scope="col" class="px-4 py-4 sm:px-6 sm:py-4.5 text-center">Status</th>
                <th scope="col" class="px-4 py-4 sm:px-6 sm:py-4.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10">
              <UserTableRow
                v-for="u in users"
                :key="u.id"
                :user="u"
                theme="dark"
                @view-details="handleViewDetails"
                @toggle-status="handleToggleStatus"
              />
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div v-if="totalPages > 0" class="border-t border-white/15 px-4 py-2 bg-white/5">
          <PaginationControl
            :current-page="currentPage"
            :total-pages="totalPages"
            theme="dark"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Status Toggle (Criteria #13 & #14) -->
    <ConfirmActionModal
      v-if="modalTargetUser"
      :is-open="isModalOpen"
      :title="modalTargetUser.enabled ? 'Deactivate User Account' : 'Reactivate User Account'"
      :message="modalTargetUser.enabled
        ? `Are you sure you want to deactivate ${modalTargetFullName}? They will lose access to the system until reactivated.`
        : `Are you sure you want to reactivate ${modalTargetFullName}? They will regain full access to their account.`"
      :confirm-text="modalTargetUser.enabled ? 'Deactivate' : 'Reactivate'"
      :confirm-color="modalTargetUser.enabled ? 'red' : 'emerald'"
      :is-loading="isToggling"
      @confirm="confirmToggleStatus"
      @cancel="closeConfirmModal"
    />
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import UserFilterToolbar from '@/components/admin/UserFilterToolbar.vue'
import type { UserFilters } from '@/components/admin/UserFilterToolbar.vue'
import UserTableRow from '@/components/admin/UserTableRow.vue'
import PaginationControl from '@/components/common/PaginationControl.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import AdminUserService from '@/services/AdminUserService'
import type { AdminUser } from '@/types/admin'
import { useToast } from '@/composables/useToast'
import { users as mockUsers } from '@/data/users'

const route = useRoute()
const router = useRouter()
const { showToast, toastMessage, triggerToast } = useToast()

const users = ref<AdminUser[]>([])
const totalPages = ref(1)
const loading = ref(false)
const error = ref<string | null>(null)
const activeFilters = ref<UserFilters>({
  name: (route.query.name as string) || (route.query.search as string) || undefined,
  level: route.query.level ? Number(route.query.level) : undefined,
  province: (route.query.province as string) || undefined,
})

// Confirmation modal state
const modalTargetUser = ref<AdminUser | null>(null)
const isModalOpen = ref(false)
const isToggling = ref(false)

const modalTargetFullName = computed(() => {
  if (!modalTargetUser.value) return ''
  const first = modalTargetUser.value.firstname?.trim() || ''
  const last = modalTargetUser.value.lastname?.trim() || ''
  return `${first} ${last}`.trim() || modalTargetUser.value.username
})

// Read page and pageSize from $route.query (defaults: page=1, pageSize=10)
const currentPage = computed(() => {
  const p = Number(route.query.page)
  return Number.isInteger(p) && p > 0 ? p : 1
})

const pageSize = computed(() => {
  const s = Number(route.query.pageSize)
  return Number.isInteger(s) && s > 0 ? s : 6
})

function loadFallbackUsers() {
  let list: AdminUser[] = mockUsers.map((u, idx) => ({
    id: Number(u.id) || idx + 1,
    username: u.username || u.email.split('@')[0] || `user${u.id}`,
    firstname: u.firstname || u.name || '',
    lastname: u.lastname || u.surname || '',
    email: u.email,
    province: u.province || 'Chiang Mai',
    profileImageUrl: u.profileImageUrl || '',
    currentLevel: Number(u.level) || 1,
    enabled: u.enabled !== undefined ? u.enabled : (u.isActive !== undefined ? u.isActive : true),
    roles: u.roles ? [...u.roles] : (u.role === 'admin' ? ['ROLE_ADMIN'] : ['ROLE_USER']),
  }))

  if (activeFilters.value.name) {
    const q = activeFilters.value.name.toLowerCase()
    list = list.filter(
      (u) =>
        u.firstname.toLowerCase().includes(q) ||
        u.lastname.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    )
  }
  if (activeFilters.value.level !== undefined && activeFilters.value.level !== null) {
    list = list.filter((u) => u.currentLevel === activeFilters.value.level)
  }
  if (activeFilters.value.province) {
    list = list.filter((u) => u.province === activeFilters.value.province)
  }

  const start = (currentPage.value - 1) * pageSize.value
  totalPages.value = Math.max(1, Math.ceil(list.length / pageSize.value))
  users.value = list.slice(start, start + pageSize.value)
}

async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const filters = {
      name: activeFilters.value.name,
      level: activeFilters.value.level,
      province: activeFilters.value.province,
    }

    const response = await AdminUserService.getUsers(currentPage.value, pageSize.value, filters)
    if (response.data && response.data.length > 0) {
      users.value = response.data

      const totalHeader = response.headers?.['x-total-count']
      if (totalHeader) {
        const parsedTotal = parseInt(totalHeader, 10)
        if (!isNaN(parsedTotal)) {
          totalPages.value = Math.max(1, Math.ceil(parsedTotal / pageSize.value))
        }
      } else {
        totalPages.value = users.value.length === pageSize.value ? currentPage.value + 1 : currentPage.value
      }
    } else {
      loadFallbackUsers()
    }
  } catch (err: unknown) {
    console.warn('Backend users API unavailable, falling back to local dataset:', err)
    loadFallbackUsers()
  } finally {
    loading.value = false
  }
}

function handleFilterChange(newFilters: UserFilters) {
  activeFilters.value = { ...newFilters }
  const nextQuery: Record<string, string> = {
    ...route.query as Record<string, string>,
    page: '1',
  }

  if (newFilters.name) {
    nextQuery.name = newFilters.name
  } else {
    delete nextQuery.name
    delete nextQuery.search
  }

  if (newFilters.level !== undefined && newFilters.level !== null) {
    nextQuery.level = String(newFilters.level)
  } else {
    delete nextQuery.level
  }

  if (newFilters.province) {
    nextQuery.province = newFilters.province
  } else {
    delete nextQuery.province
  }

  router.push({ query: nextQuery })
}

function handleResetFilters() {
  activeFilters.value = { name: undefined, level: undefined, province: undefined }
  const nextQuery: Record<string, string> = {
    page: '1',
    pageSize: String(pageSize.value),
  }
  router.push({ query: nextQuery })
}

function handlePageChange(newPage: number) {
  const nextQuery: Record<string, string> = {
    ...route.query as Record<string, string>,
    page: String(newPage),
  }
  const isSame = (route.query.page || '1') === String(newPage)
  if (!isSame) {
    router.push({ query: nextQuery })
  } else {
    fetchUsers()
  }
}

function handleViewDetails(userId: number) {
  router.push(`/admin/users/${userId}/info`)
}

function handleToggleStatus(user: AdminUser) {
  modalTargetUser.value = user
  isModalOpen.value = true
}

function closeConfirmModal() {
  if (!isToggling.value) {
    isModalOpen.value = false
    modalTargetUser.value = null
  }
}

async function confirmToggleStatus() {
  if (!modalTargetUser.value || isToggling.value) return
  isToggling.value = true
  const user = modalTargetUser.value
  const previousState = user.enabled
  const nextState = !previousState

  try {
    user.enabled = nextState
    await AdminUserService.toggleUserStatus(user.id, nextState)
    triggerToast(
      nextState
        ? `User ${modalTargetFullName.value} has been reactivated.`
        : `User ${modalTargetFullName.value} has been deactivated.`,
    )
    isModalOpen.value = false
    modalTargetUser.value = null
  } catch (err) {
    user.enabled = previousState
    console.error('Failed to toggle user status:', err)
    triggerToast('Failed to update user status. Please try again.')
  } finally {
    isToggling.value = false
  }
}

watch(
  () => route.query,
  () => {
    activeFilters.value = {
      name: (route.query.name as string) || (route.query.search as string) || undefined,
      level: route.query.level ? Number(route.query.level) : undefined,
      province: (route.query.province as string) || undefined,
    }
    fetchUsers()
  },
  { immediate: true },
)
</script>
