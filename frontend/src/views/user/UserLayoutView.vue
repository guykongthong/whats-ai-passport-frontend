<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
    <!-- Global Toast Notifications -->
    <slot name="toast">
      <Toast :show="showToast" :message="toastMessage" />
    </slot>

    <!-- Header / Responsive Navigation Bar -->
    <header class="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-colors">
      <div class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Left: Hamburger (Mobile) & App Branding -->
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Mobile Hamburger Toggle Button -->
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-button-primary/20 md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
            :aria-expanded="isDrawerOpen"
            @click="toggleDrawer"
          >
            <svg v-if="!isDrawerOpen" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- App Logo & Branding: CA?T Passport -->
          <RouterLink
            to="/dashboard"
            class="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
          >
            <div class="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-button-primary to-indigo-600 text-white shadow-sm ring-1 ring-black/5 group-hover:shadow-md transition-shadow">
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                CA<span class="text-indigo-600">?</span>T Passport
              </span>
              <span class="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
                Digital Credential & Skills
              </span>
            </div>
          </RouterLink>
        </div>

        <!-- Center: Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all"
            :class="[
              isActiveRoute(link.to)
                ? 'bg-indigo-50 text-button-primary font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            <span>{{ link.label }}</span>
          </RouterLink>
        </nav>

        <!-- Right: Top-Right Profile Header Area (FE-USER-06) -->
        <div class="flex items-center gap-2 sm:gap-3">
          <UserNavbarProfile
            v-if="currentUser"
            theme="light"
            @logout="handleLogout"
          />
          <RouterLink
            v-else
            to="/login"
            class="rounded-lg bg-button-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Sign In
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Drawer & Backdrop -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDrawerOpen"
          class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          @click="closeDrawer"
        />
      </Transition>

      <!-- Off-canvas Drawer Menu -->
      <Transition
        enter-active-class="transition-transform ease-out duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="isDrawerOpen"
          class="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <!-- Drawer Header -->
          <div class="flex h-18 items-center justify-between border-b border-slate-100 px-5">
            <div class="flex items-center gap-2.5">
              <div class="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-button-primary to-indigo-600 text-white shadow-xs">
                <svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="text-base font-extrabold tracking-tight text-slate-900">
                CA<span class="text-indigo-600">?</span>T Passport
              </span>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              aria-label="Close menu"
              @click="closeDrawer"
            >
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Navigation Links -->
          <div class="flex-1 overflow-y-auto px-4 py-5">
            <nav class="flex flex-col gap-1.5">
              <RouterLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all"
                :class="[
                  isActiveRoute(link.to)
                    ? 'bg-indigo-50 text-button-primary font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                ]"
                @click="closeDrawer"
              >
                <!-- Nav Link Icons -->
                <svg v-if="link.icon === 'home'" class="size-5 shrink-0" :class="isActiveRoute(link.to) ? 'text-button-primary' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <svg v-else-if="link.icon === 'book'" class="size-5 shrink-0" :class="isActiveRoute(link.to) ? 'text-button-primary' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <svg v-else-if="link.icon === 'exam'" class="size-5 shrink-0" :class="isActiveRoute(link.to) ? 'text-button-primary' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                </svg>
                <svg v-else class="size-5 shrink-0" :class="isActiveRoute(link.to) ? 'text-button-primary' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ link.label }}</span>
              </RouterLink>
            </nav>
          </div>

          <!-- Drawer User Info / Logout -->
          <div v-if="currentUser" class="border-t border-slate-100 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="size-9 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  <img
                    v-if="currentUser.profileImageUrl"
                    :src="currentUser.profileImageUrl"
                    :alt="currentUser.name"
                    class="size-full object-cover"
                  />
                  <div v-else class="flex size-full items-center justify-center font-bold text-xs text-button-primary bg-indigo-50">
                    {{ (currentUser.name?.[0] || 'U').toUpperCase() }}
                  </div>
                </div>
                <div class="truncate">
                  <p class="truncate text-xs font-bold text-slate-800">
                    {{ currentUser.name }} {{ currentUser.surname }}
                  </p>
                  <p class="text-[10px] font-medium text-slate-500">
                    Level {{ currentUser.level || 1 }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                title="Sign out"
                aria-label="Sign out"
                @click="handleLogout"
              >
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content Shell (Embedding RouterView for Child Pages) -->
    <main class="flex-1 w-full flex flex-col">
      <RouterView />
    </main>

    <!-- Portal Footer -->
    <Footer
      theme="light"
      logo-text="CA?T Passport"
      :links="footerLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, provide } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useToast } from '@/composables/useToast'
import Toast from '@/shared/components/Toast.vue'
import Footer from '@/shared/components/Footer.vue'
import UserNavbarProfile from '@/components/user/UserNavbarProfile.vue'
import { userFooterLinks } from '@/data/navigation'

provide('insideUserLayout', true)

interface NavItem {
  label: string
  to: string
  icon: 'home' | 'book' | 'exam' | 'profile'
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast, toastMessage } = useToast()

const isDrawerOpen = ref(false)
const currentUser = computed(() => authStore.currentUser)
const footerLinks = userFooterLinks

const navLinks: NavItem[] = [
  { label: 'Home / Dashboard', to: '/dashboard', icon: 'home' },
  { label: 'eLearning', to: '/dashboard/elearning', icon: 'book' },
  { label: 'Upgrade Exam', to: '/dashboard/exam', icon: 'exam' },
  { label: 'My Profile', to: '/profile', icon: 'profile' },
]

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}

function closeDrawer() {
  isDrawerOpen.value = false
}

function isActiveRoute(target: string): boolean {
  if (target === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/home' || route.path === '/'
  }
  if (target === '/profile') {
    return route.path === '/profile' || route.path.startsWith('/profile')
  }
  return route.path.startsWith(target)
}

function handleLogout() {
  closeDrawer()
  authStore.logout()
  router.push('/login')
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isDrawerOpen.value) {
    closeDrawer()
  }
}

watch(
  () => route.path,
  () => {
    closeDrawer()
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
