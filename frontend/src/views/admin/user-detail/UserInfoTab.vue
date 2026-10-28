<template>
  <div v-if="user" class="flex flex-col gap-6">
    <!-- Header with Quick Edit Action Button -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h3 class="text-lg font-bold text-white">User Overview</h3>
        <p class="text-xs text-white/60">Comprehensive view of personal profile and system account details.</p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white text-slate-800 hover:bg-slate-100 shadow-sm transition-colors cursor-pointer"
        @click="goToEditTab"
      >
        <svg class="size-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <span>Quick Edit</span>
      </button>
    </div>

    <!-- Profile Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. Personal Details Card -->
      <div class="bg-white/10 rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col gap-4">
        <div class="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <svg class="size-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h4 class="font-bold text-sm tracking-wide uppercase text-white/90">Personal Details</h4>
        </div>

        <div class="space-y-4 text-sm">
          <div>
            <span class="text-xs text-white/50 block font-medium">Full Name</span>
            <span class="font-semibold text-white text-base">{{ fullName }}</span>
          </div>

          <div>
            <span class="text-xs text-white/50 block font-medium">Email Address</span>
            <span class="font-semibold text-white break-all">{{ user.email }}</span>
          </div>

          <div>
            <span class="text-xs text-white/50 block font-medium">Province</span>
            <span class="font-semibold text-white">{{ user.province || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 2. System Details Card -->
      <div class="bg-white/10 rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col gap-4">
        <div class="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <svg class="size-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h4 class="font-bold text-sm tracking-wide uppercase text-white/90">System Details</h4>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-xs text-white/50 block font-medium">User ID</span>
            <span class="font-semibold text-white font-mono">#{{ user.id }}</span>
          </div>

          <div>
            <span class="text-xs text-white/50 block font-medium">Current Level</span>
            <span
              :class="[
                'inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold',
                levelBadgeClass,
              ]"
            >
              Level {{ user.currentLevel }}
            </span>
          </div>

          <div>
            <span class="text-xs text-white/50 block font-medium">Role</span>
            <span class="font-semibold text-white">{{ roleText }}</span>
          </div>

          <div>
            <span class="text-xs text-white/50 block font-medium">Account Status</span>
            <span
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5',
                user.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
              ]"
            >
              <span
                :class="['size-1.5 rounded-full', user.enabled ? 'bg-emerald-400' : 'bg-rose-400']"
              />
              {{ user.enabled ? 'Active' : 'Deactivated' }}
            </span>
          </div>

          <div class="col-span-2">
            <span class="text-xs text-white/50 block font-medium">Registration Date</span>
            <span class="font-semibold text-white">{{ registrationDateText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminUserStore } from '@/stores/adminUser'
import { getLevelClasses } from '@/utils/levelDisplay'

const router = useRouter()
const route = useRoute()
const adminUserStore = useAdminUserStore()

// Retrieve selectedUser from adminUserStore
const user = computed(() => adminUserStore.selectedUser)

const fullName = computed(() => {
  if (!user.value) return '-'
  const first = user.value.firstname?.trim() || ''
  const last = user.value.lastname?.trim() || ''
  return `${first} ${last}`.trim() || user.value.username
})

const roleText = computed(() => {
  if (!user.value || !user.value.roles || user.value.roles.length === 0) {
    return 'ROLE_USER'
  }
  return user.value.roles.join(', ')
})

const levelBadgeClass = computed(() =>
  user.value ? getLevelClasses(user.value.currentLevel) : '',
)

const registrationDateText = computed(() => {
  const u = user.value as unknown as Record<string, unknown>
  const rawDate = u?.createdAt || u?.registeredAt || u?.enrolledDate
  if (typeof rawDate === 'string' && rawDate) {
    const d = new Date(rawDate)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
    return rawDate
  }
  return 'Verified Member'
})

// Quick Edit button that redirects directly to the Edit tab
function goToEditTab() {
  const userId = user.value?.id || route.params.id
  router.push(`/admin/users/${userId}/edit`)
}
</script>
