<template>
  <AdminPageLayout title="User Details" main-padding="px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <!-- Back to Users navigation -->
      <div>
        <RouterLink
          to="/admin"
          class="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Users</span>
        </RouterLink>
      </div>

      <!-- Loading State -->
      <div
        v-if="adminUserStore.isLoading && !user"
        class="py-20 flex flex-col items-center justify-center gap-3"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/70">Loading user details...</span>
      </div>

      <!-- Persistent User Header Card & Nested Child Views -->
      <div
        v-else-if="user"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-lg text-white"
      >
        <!-- Persistent Header Info -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/20 gap-4">
          <div class="flex items-center gap-4">
            <!-- Avatar image with initials fallback -->
            <img
              v-if="effectiveProfileImage && !avatarError"
              :src="effectiveProfileImage"
              :alt="fullName"
              class="size-16 sm:size-20 rounded-full object-cover border-2 border-white/30 shrink-0"
              @error="avatarError = true"
            />
            <div
              v-else
              class="size-16 sm:size-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 select-none"
            >
              {{ userInitials }}
            </div>

            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-xl sm:text-2xl font-bold truncate leading-tight">
                  {{ fullName }}
                </h2>
                <!-- Account Status Badge (Criteria #13 & #14) -->
                <StatusBadge :enabled="user.enabled" />
              </div>

              <span class="text-xs sm:text-sm text-white/70 mt-0.5">
                @{{ user.username }} &bull; {{ user.email }}
              </span>
            </div>
          </div>

          <!-- Header Actions: Current Level Badge & Deactivate/Reactivate Action Button -->
          <div class="flex items-center gap-3 shrink-0 flex-wrap">
            <span
              :class="[
                'inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm',
                levelBadgeClass,
              ]"
            >
              Level {{ user.currentLevel }}: {{ levelName }}
            </span>

            <button
              type="button"
              :class="[
                'size-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border shadow-sm shrink-0',
                user.enabled
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30 hover:scale-105'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-105',
              ]"
              :title="user.enabled ? 'Deactivate User' : 'Reactivate User'"
              :aria-label="user.enabled ? 'Deactivate User' : 'Reactivate User'"
              @click="openConfirmModal"
            >
              <svg v-if="user.enabled" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <svg v-else class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Sub-navigation Tabs: [ User Information ] | [ Exam History ] | [ Edit User ] -->
        <div class="flex items-center gap-2 sm:gap-4 border-b border-white/20 pt-4 pb-0 text-sm font-semibold overflow-x-auto">
          <RouterLink
            :to="`/admin/users/${user.id}/info`"
            class="pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            :class="
              route.path.endsWith('/info')
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/60 hover:text-white hover:border-white/40'
            "
          >
            <span>User Information</span>
          </RouterLink>

          <span class="text-white/30 hidden sm:inline select-none">|</span>

          <RouterLink
            :to="`/admin/users/${user.id}/history`"
            class="pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            :class="
              route.path.endsWith('/history')
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/60 hover:text-white hover:border-white/40'
            "
          >
            <span>Exam History</span>
          </RouterLink>

          <span class="text-white/30 hidden sm:inline select-none">|</span>

          <RouterLink
            :to="`/admin/users/${user.id}/edit`"
            class="pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            :class="
              route.path.endsWith('/edit')
                ? 'border-white text-white font-bold'
                : 'border-transparent text-white/60 hover:text-white hover:border-white/40'
            "
          >
            <span>Edit User</span>
          </RouterLink>
        </div>

        <!-- Tab Contents rendered via RouterView -->
        <div class="pt-6">
          <RouterView />
        </div>
      </div>

      <!-- User Not Found Fallback -->
      <div
        v-else
        class="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center text-white border border-white/20 flex flex-col items-center justify-center gap-3"
      >
        <p class="text-xl font-bold">User not found</p>
        <p class="text-sm text-white/70">The requested user ID could not be located in the system.</p>
        <RouterLink
          to="/admin"
          class="mt-6 inline-flex items-center px-6 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-all shadow-sm"
        >
          Return to User List
        </RouterLink>
      </div>
    </div>

    <!-- Deactivate / Reactivate Confirmation Modal (Criteria #13 & #14) -->
    <ConfirmActionModal
      v-if="user"
      :is-open="isModalOpen"
      :title="user.enabled ? 'Deactivate User Account' : 'Reactivate User Account'"
      :message="user.enabled
        ? `Are you sure you want to deactivate ${fullName}? They will not be able to log in until their account is reactivated.`
        : `Are you sure you want to reactivate ${fullName}? They will regain full access to their account.`"
      :confirm-text="user.enabled ? 'Deactivate' : 'Reactivate'"
      :confirm-color="user.enabled ? 'red' : 'emerald'"
      :is-loading="isToggling"
      @confirm="handleToggleStatus"
      @cancel="closeConfirmModal"
    />
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import { useAdminUserStore } from '@/stores/adminUser'
import { useToast } from '@/composables/useToast'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const adminUserStore = useAdminUserStore()
const { showToast, toastMessage, triggerToast } = useToast()

const user = computed(() => adminUserStore.selectedUser)
const avatarError = ref(false)

const effectiveProfileImage = computed(() => {
  if (user.value?.profileImageUrl) return user.value.profileImageUrl
  if (typeof localStorage !== 'undefined' && user.value?.id === 1) {
    return localStorage.getItem('custom_admin_avatar') || ''
  }
  return ''
})

// Modal state
const isModalOpen = ref(false)
const isToggling = ref(false)

watch(
  () => effectiveProfileImage.value,
  () => {
    avatarError.value = false
  },
)

const fullName = computed(() => {
  if (!user.value) return ''
  const first = user.value.firstname?.trim() || ''
  const last = user.value.lastname?.trim() || ''
  return `${first} ${last}`.trim() || user.value.username
})

const userInitials = computed(() => {
  if (!user.value) return ''
  const first = user.value.firstname?.trim().charAt(0) || ''
  const last = user.value.lastname?.trim().charAt(0) || ''
  const combined = (first + last).toUpperCase()
  return combined || user.value.username.slice(0, 2).toUpperCase()
})

const levelName = computed(() =>
  user.value ? getLevelName(user.value.currentLevel) : '',
)

const levelBadgeClass = computed(() =>
  user.value ? getLevelClasses(user.value.currentLevel) : '',
)

function openConfirmModal() {
  isModalOpen.value = true
}

function closeConfirmModal() {
  if (!isToggling.value) {
    isModalOpen.value = false
  }
}

async function handleToggleStatus() {
  if (!user.value || isToggling.value) return
  isToggling.value = true
  const nextStatus = !user.value.enabled

  try {
    await adminUserStore.toggleUserStatus(user.value.id, nextStatus)
    triggerToast(
      nextStatus
        ? 'User has been successfully activated.'
        : 'User has been successfully deactivated.',
    )
    isModalOpen.value = false
  } catch (err: unknown) {
    console.error('Failed to toggle user status:', err)
    triggerToast('Failed to update user status. Please try again.')
  } finally {
    isToggling.value = false
  }
}

// Fetch user details from backend via adminUserStore
async function loadUserData() {
  const userId = Number(route.params.id)
  if (Number.isInteger(userId) && userId > 0) {
    await adminUserStore.fetchUserById(userId, true)
  }
}

onMounted(() => {
  loadUserData()
})

// Refetch only when route param id changes to a different user
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      loadUserData()
    }
  },
)
</script>
