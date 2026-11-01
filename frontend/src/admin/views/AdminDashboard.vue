<template>
  <AdminPageLayout title="User Management" main-padding="px-4 sm:px-8">
    <UserStatsCards :users="allUsers" />
    <UserFilterForm @filter-change="handleFilterChange" class="mt-4" />
    <UserListTable :users="filteredUsers" :current-page="authStore.currentPage" :page-size="authStore.pageSize" @page-change="authStore.setPage" />
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import UserFilterForm from '@/admin/components/UserFilterForm.vue'
import UserListTable from '@/admin/components/UserListTable.vue'
import UserStatsCards from '@/admin/components/UserStatsCards.vue'
import type { UserRow } from '@/admin/components/UserListTable.vue'
import { useAuthStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const initialPage = Number(route.query.page) ||1
authStore.setPage(initialPage)

watch(() => authStore.currentPage,  (page) => {
  router.replace({ query: { ...route.query, page: String(page)}})
})

function toUserRow(u: (typeof authStore.users)[number]): UserRow {
  return {
    id: u.id,
    name: `${u.name} ${u.surname}`,
    email: u.email,
    level: Number(u.level),
    province: u.province,
    enrolledDate: '',
  }
}

const allUsers = computed<UserRow[]>(() => authStore.users.map(toUserRow))

function handleFilterChange(newFilters: { search: string; level: string; province: string }) {
  authStore.setFilters({
    name: newFilters.search,
    level: newFilters.level || null,
    province: newFilters.province || null,
  })
}

const filteredUsers = computed<UserRow[]>(() => authStore.filteredUsers.map(toUserRow))

</script>
