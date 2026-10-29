<template>
  <AdminPageLayout title="User Management" main-padding="px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <!-- Search & Filters Toolbar -->
      <UserFilterToolbar
        :initial-filters="activeFilters"
        :is-loading="loading"
        @update:filters="handleFilterChange"
        @reset="handleResetFilters"
      />

      <!-- Feedback States: Loading / Error / Empty -->
      <div
        v-if="loading"
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-slate-500"
      >
        <div class="size-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <span class="text-sm font-medium">Loading users...</span>
      </div>

      <div
        v-else-if="error"
        class="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 text-center text-sm"
      >
        <p class="font-semibold">{{ error }}</p>
        <button
          type="button"
          class="mt-3 px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
          @click="fetchUsers"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="users.length === 0"
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500"
      >
        <p class="text-base font-semibold">No users found</p>
        <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or search term.</p>
      </div>

      <!-- Users Table Card -->
      <div
        v-else
        class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4">User</th>
                <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4">Province</th>
                <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4">Level</th>
                <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4">Status</th>
                <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <UserTableRow
                v-for="u in users"
                :key="u.id"
                :user="u"
                theme="light"
                @view-details="handleViewDetails"
                @toggle-status="handleToggleStatus"
              />
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div v-if="totalPages > 0" class="border-t border-slate-200 px-4 py-2">
          <PaginationControl
            :current-page="currentPage"
            :total-pages="totalPages"
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
  return Number.isInteger(s) && s > 0 ? s : 10
})

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
    users.value = response.data || []

    const totalHeader = response.headers?.['x-total-count']
    if (totalHeader) {
      const parsedTotal = parseInt(totalHeader, 10)
      if (!isNaN(parsedTotal)) {
        totalPages.value = Math.max(1, Math.ceil(parsedTotal / pageSize.value))
      }
    } else {
      totalPages.value = users.value.length === pageSize.value ? currentPage.value + 1 : currentPage.value
    }
  } catch (err: unknown) {
    console.error('Failed to fetch admin users:', err)
    error.value = 'Failed to load users. Please check your connection and try again.'
    users.value = []
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
