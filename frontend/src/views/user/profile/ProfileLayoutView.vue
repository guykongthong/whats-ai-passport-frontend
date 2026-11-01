<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center">
      <div class="mx-auto w-full max-w-4xl space-y-6">

        <!-- Back Link / Breadcrumb -->
        <div>
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-button-primary transition-colors cursor-pointer"
          >
            <span>&larr;</span>
            <span>Back to Dashboard</span>
          </RouterLink>
        </div>

        <!-- Shared Profile Header Card -->
        <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <!-- Profile Avatar / Image -->
            <div class="relative shrink-0">
              <div class="size-24 sm:size-28 overflow-hidden rounded-full border-4 border-white shadow-md ring-2 ring-slate-100 bg-slate-100 flex items-center justify-center">
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  :alt="fullName"
                  class="size-full object-cover"
                />
                <span
                  v-else
                  class="text-3xl sm:text-4xl font-extrabold text-[#00385A]"
                >
                  {{ userInitials }}
                </span>
              </div>
            </div>

            <!-- Profile Info & Level Badge -->
            <div class="flex-1 text-center sm:text-left">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-[#00385A]">
                    {{ fullName }}
                  </h1>
                  <p v-if="thaiName" class="text-xs font-semibold text-slate-400 mt-0.5">
                    {{ thaiName }}
                  </p>
                </div>

                <!-- Current Level Badge -->
                <div class="self-center sm:self-start">
                  <span
                    :class="[
                      'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black shadow-2xs',
                      getLevelClasses(userLevel),
                    ]"
                  >
                    <span class="size-2 rounded-full bg-current opacity-80"></span>
                    Level {{ userLevel }}: {{ getLevelName(userLevel) }}
                  </span>
                </div>
              </div>

              <!-- Meta Details: Email & Province -->
              <div class="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-5 text-xs font-semibold text-slate-500">
                <div class="flex items-center gap-1.5">
                  <svg class="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ email }}</span>
                </div>

                <div v-if="province" class="flex items-center gap-1.5">
                  <svg class="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ province }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Tab Bar -->
          <nav
            class="mt-8 flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Profile Sections"
          >
            <RouterLink
              v-for="tab in tabs"
              :key="tab.to"
              :to="tab.to"
              class="relative flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-sm font-bold transition-colors cursor-pointer"
              :class="[
                isTabActive(tab.to)
                  ? 'text-[#00385A]'
                  : 'text-slate-500 hover:text-slate-800'
              ]"
              role="tab"
              :aria-selected="isTabActive(tab.to)"
            >
              <component :is="tab.icon" class="size-4 shrink-0" />
              <span>{{ tab.label }}</span>
              <!-- Active Underline Indicator -->
              <span
                v-if="isTabActive(tab.to)"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00385A] rounded-full"
              />
            </RouterLink>
          </nav>
        </div>

        <!-- Child Router View for Tabs with Smooth Transition -->
        <RouterView v-slot="{ Component }">
          <Transition name="tab-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>

      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/user'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import UserIcon from '@/shared/components/icons/UserIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'
import StarIcon from '@/shared/components/icons/StarIcon.vue'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()

// Single-fetch on mount: loads profile into store and caches for child tabs
onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

const user = computed(() => userStore.userProfile || authStore.currentUser)

const userLevel = computed(() => userStore.currentUserLevel)

const fullName = computed(() => {
  if (user.value?.firstname && user.value?.lastname) {
    return `${user.value.firstname} ${user.value.lastname}`
  }
  if (user.value?.name && user.value?.surname) {
    return `${user.value.name} ${user.value.surname}`
  }
  return user.value?.username || 'User Profile'
})

const thaiName = computed(() => {
  if (user.value?.nameTh && user.value?.surnameTh) {
    return `${user.value.nameTh} ${user.value.surnameTh}`
  }
  return null
})

const email = computed(() => user.value?.email || 'N/A')
const province = computed(() => user.value?.province || '')
const profileImageUrl = computed(() => user.value?.profileImageUrl || '')

const userInitials = computed(() => {
  const name = user.value?.firstname || user.value?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const tabs = [
  { label: 'Details', to: '/profile/details', icon: UserIcon },
  { label: 'Exam History', to: '/profile/history', icon: DocumentTextIcon },
  { label: 'Badges', to: '/profile/badges', icon: StarIcon },
  { label: 'Services', to: '/profile/services', icon: CheckCircleIcon },
]

function isTabActive(tabPath: string): boolean {
  if (tabPath === '/profile/details') {
    return route.path === '/profile/details' || route.path === '/profile'
  }
  return route.path === tabPath
}
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
