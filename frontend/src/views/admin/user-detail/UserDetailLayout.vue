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
              v-if="user.profileImageUrl && !avatarError"
              :src="user.profileImageUrl"
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
                <!-- Account Status Badge -->
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    user.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                  ]"
                >
                  <span
                    :class="[
                      'size-1.5 rounded-full',
                      user.enabled ? 'bg-emerald-400' : 'bg-rose-400',
                    ]"
                  />
                  {{ user.enabled ? 'Active' : 'Deactivated' }}
                </span>
              </div>

              <span class="text-xs sm:text-sm text-white/70 mt-0.5">
                @{{ user.username }} &bull; {{ user.email }}
              </span>
            </div>
          </div>

          <!-- Current Level Badge -->
          <div class="shrink-0">
            <span
              :class="[
                'inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm',
                levelBadgeClass,
              ]"
            >
              Level {{ user.currentLevel }}: {{ levelName }}
            </span>
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
        class="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center text-white border border-white/20"
      >
        <p class="text-lg font-semibold">User not found</p>
        <p class="text-sm text-white/60 mt-1">The requested user ID could not be located.</p>
        <RouterLink
          to="/admin"
          class="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors"
        >
          Return to User List
        </RouterLink>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import { useAdminUserStore } from '@/stores/adminUser'
import { useToast } from '@/composables/useToast'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const adminUserStore = useAdminUserStore()
const { showToast, toastMessage } = useToast()

const user = computed(() => adminUserStore.selectedUser)
const avatarError = ref(false)

watch(
  () => user.value?.profileImageUrl,
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

// Fetch user details once via adminUserStore (cached internally to prevent redundant calls on tab switch)
async function loadUserData() {
  const userId = Number(route.params.id)
  if (Number.isInteger(userId) && userId > 0) {
    await adminUserStore.fetchUserById(userId)
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
