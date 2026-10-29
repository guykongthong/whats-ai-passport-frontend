<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8">
      <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <!-- Top Back Link -->
        <div>
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#00385A] transition-colors"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </RouterLink>
        </div>

        <!-- Shared Profile Header Card -->
        <section
          aria-label="User Profile Header"
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002d4f] via-[#00385e] to-[#1a4a6e] p-6 sm:p-8 text-white shadow-lg"
        >
          <!-- Decorative Blurs -->
          <div class="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-indigo-400/15 blur-2xl" />
          <div class="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-blue-400/10 blur-2xl" />

          <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <img
                v-if="profileImageUrl"
                :src="profileImageUrl"
                alt="Profile photo"
                class="size-20 sm:size-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
              />
              <div
                v-else
                class="size-20 sm:size-24 rounded-2xl bg-white/20 ring-4 ring-white/20 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-md"
              >
                {{ userInitials }}
              </div>

              <!-- Level badge indicator overlay -->
              <span
                class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-sm"
                :class="getLevelClasses(currentLevel)"
              >
                Lvl {{ currentLevel }}
              </span>
            </div>

            <!-- Profile Info -->
            <div class="flex-1 text-center sm:text-left space-y-2">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {{ displayName }}
                </h1>
                <span
                  class="self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-bold"
                  :class="getLevelClasses(currentLevel)"
                >
                  {{ getLevelName(currentLevel) }}
                </span>
              </div>

              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-200">
                <span v-if="email" class="inline-flex items-center gap-1.5">
                  <svg class="size-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ email }}</span>
                </span>

                <span v-if="province" class="inline-flex items-center gap-1.5">
                  <svg class="size-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ province }}</span>
                </span>
              </div>

              <!-- Quick stats pills -->
              <div class="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div class="px-3 py-1 rounded-xl bg-white/10 text-xs font-medium text-slate-200 backdrop-blur-xs border border-white/10">
                  Badges: <strong class="text-white">{{ badgesCount }}</strong>
                </div>
                <div class="px-3 py-1 rounded-xl bg-white/10 text-xs font-medium text-slate-200 backdrop-blur-xs border border-white/10">
                  Exams Taken: <strong class="text-white">{{ examHistoriesCount }}</strong>
                </div>
                <div class="px-3 py-1 rounded-xl bg-white/10 text-xs font-medium text-slate-200 backdrop-blur-xs border border-white/10">
                  Services: <strong class="text-white">{{ servicesCount }}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Nested Sub-routes Navigation Tabs -->
        <nav
          aria-label="Profile Sections"
          class="flex items-center gap-2 overflow-x-auto rounded-2xl bg-white/80 p-1.5 shadow-xs border border-slate-200/80 backdrop-blur-xs"
        >
          <RouterLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
            :class="[
              isTabActive(tab.to)
                ? 'bg-[#00385A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
            ]"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </RouterLink>
        </nav>

        <!-- Sub-route Content Container -->
        <section
          aria-label="Tab Content"
          class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
        >
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </section>
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/authStore'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()

onMounted(async () => {
  await userStore.fetchUserProfile()
})

const profile = computed(() => userStore.userProfile)
const authUser = computed(() => authStore.currentUser)

const displayName = computed(() => {
  const p = profile.value
  const u = authUser.value
  const first = p?.firstname || p?.name || u?.firstname || u?.name || ''
  const last = p?.lastname || p?.surname || u?.lastname || u?.surname || ''
  const full = `${first} ${last}`.trim()
  return full || u?.username || 'User Profile'
})

const email = computed(() => profile.value?.email || authUser.value?.email || '')
const province = computed(() => profile.value?.province || authUser.value?.province || '')
const profileImageUrl = computed(() => profile.value?.profileImageUrl || authUser.value?.profileImageUrl || '')

const userInitials = computed(() => {
  const p = profile.value
  const u = authUser.value
  const first = (p?.firstname || p?.name || u?.firstname || u?.name || 'U').charAt(0)
  const last = (p?.lastname || p?.surname || u?.lastname || u?.surname || '').charAt(0)
  return `${first}${last}`.toUpperCase()
})

const currentLevel = computed(() => userStore.currentUserLevel)
const badgesCount = computed(() => userStore.badges.length)
const examHistoriesCount = computed(() => userStore.examHistories.length)
const servicesCount = computed(() => userStore.availableServices.length)

const tabs = [
  { label: 'My Details', to: '/profile/details', icon: '👤' },
  { label: 'Exam History', to: '/profile/history', icon: '📝' },
  { label: 'Badges & Certification', to: '/profile/badges', icon: '🏆' },
  { label: 'Available Services', to: '/profile/services', icon: '⚡' },
]

function isTabActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
