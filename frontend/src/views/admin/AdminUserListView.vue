<template>
  <AdminPageLayout title="User Management" main-padding="px-4 sm:px-8">
    <!-- Filter Toolbar -->
    <UserFilterToolbar
      theme="light"
      :initial-search="(route.query.search as string) || (route.query.name as string) || ''"
      :initial-level="(route.query.level as string) || ''"
      :initial-province="(route.query.province as string) || ''"
      @filter-change="handleFilterChange"
    />

    <!-- User Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <!-- Error Message Banner -->
      <div
        v-if="error"
        class="bg-rose-50 border-b border-rose-200 px-6 py-3.5 text-sm text-rose-700 flex items-center justify-between"
      >
        <span>{{ error }}</span>
        <button
          type="button"
          class="text-xs font-semibold underline hover:no-underline cursor-pointer"
          @click="fetchUsers"
        >
          Retry
        </button>
      </div>

      <!-- Loading State Overlay / Skeleton -->
      <div v-if="loading" class="py-16 flex flex-col items-center justify-center gap-3">
        <div class="size-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-slate-500">Loading users...</span>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-left">User</th>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-left">Email</th>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-left">Province</th>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-left">Level</th>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-left">Status</th>
              <th scope="col" class="px-4 py-3.5 sm:px-6 sm:py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <UserTableRow
              v-for="user in users"
              :key="user.id"
              :user="user"
              theme="light"
              @view-details="handleViewDetails"
              @toggle-status="handleToggleStatus"
            />
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="users.length === 0"
          class="py-12 flex flex-col items-center justify-center text-center px-4"
        >
          <div class="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p class="text-sm font-semibold text-slate-800">No users found</p>
          <p class="text-xs text-slate-500 mt-0.5">Try adjusting your search or filter criteria.</p>
        </div>
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
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import UserFilterToolbar from '@/components/admin/UserFilterToolbar.vue'
import type { UserFilters } from '@/components/admin/UserFilterToolbar.vue'
import UserTableRow from '@/components/admin/UserTableRow.vue'
import PaginationControl from '@/components/common/PaginationControl.vue'
import AdminUserService from '@/services/AdminUserService'
import type { AdminUser } from '@/types/admin'

const route = useRoute()
const router = useRouter()

const users = ref<AdminUser[]>([])
const totalCount = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref<string | null>(null)
const activeFilters = ref<UserFilters>({})

// Read page and pageSize from $route.query (defaults: page=1, pageSize=10)
const currentPage = computed(() => {
  const p = Number(route.query.page)
  return Number.isInteger(p) && p > 0 ? p : 1
})

const pageSize = computed(() => {
  const ps = Number(route.query.pageSize)
  return Number.isInteger(ps) && ps > 0 ? ps : 10
})

// Fetch data via AdminUserService.getUsers(page, pageSize)
async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const response = await AdminUserService.getUsers(
      currentPage.value,
      pageSize.value,
      {
        name: activeFilters.value.name,
        level: activeFilters.value.level,
        province: activeFilters.value.province,
      },
    )

    users.value = response.data || []

    // Extract x-total-count header from the response to calculate totalPages
    const headerVal =
      response.headers?.['x-total-count'] ??
      response.headers?.['X-Total-Count']

    if (headerVal !== undefined && headerVal !== null) {
      totalCount.value = Number(headerVal) || 0
    } else {
      totalCount.value = users.value.length
    }

    totalPages.value = totalCount.value > 0
      ? Math.ceil(totalCount.value / pageSize.value)
      : 0
  } catch (err: unknown) {
    console.error('Failed to fetch admin users:', err)
    error.value = 'Failed to load user records. Please check backend connection.'
  } finally {
    loading.value = false
  }
}

// Push route updates on page changes: router.push({ query: { ...route.query, page: newPage } })
function handlePageChange(newPage: number) {
  router.push({
    query: {
      ...route.query,
      page: String(newPage),
    },
  })
}

// Watch $route.query.page to reload data automatically on navigation or browser back/forward
watch(
  () => [route.query.page, route.query.pageSize],
  () => {
    fetchUsers()
  },
  { immediate: true },
)

function handleFilterChange(filters: UserFilters) {
  activeFilters.value = filters

  // Reset page to 1 on filter criteria change
  if (currentPage.value !== 1) {
    router.push({
      query: {
        ...route.query,
        page: '1',
      },
    })
  } else {
    fetchUsers()
  }
}

function handleViewDetails(userId: number) {
  router.push(`/admin/users/${userId}/info`)
}

async function handleToggleStatus(user: AdminUser) {
  try {
    const nextState = !user.enabled
    await AdminUserService.toggleUserStatus(user.id, nextState)
    user.enabled = nextState
  } catch (err) {
    console.error('Failed to toggle user status:', err)
  }
}
</script>
