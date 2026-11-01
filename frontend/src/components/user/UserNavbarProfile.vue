<template>
  <div v-if="currentUser" ref="profileDropdownRef" class="relative">
    <!-- Trigger Button -->
    <button
      type="button"
      class="flex items-center gap-2.5 rounded-full p-1 sm:pr-3 transition-colors focus:outline-none focus:ring-2 focus:ring-button-primary/20"
      :class="[
        theme === 'dark'
          ? 'hover:bg-white/10 text-white'
          : 'hover:bg-gray-100 text-gray-900',
        isDropdownOpen ? (theme === 'dark' ? 'bg-white/10' : 'bg-gray-100') : '',
      ]"
      aria-label="User Profile Menu"
      :aria-expanded="isDropdownOpen"
      @click="toggleDropdown"
    >
      <!-- Circular Profile Picture / Fallback -->
      <div class="relative size-9 sm:size-10 shrink-0 overflow-hidden rounded-full border-2 border-white/80 shadow-sm bg-gray-100">
        <img
          v-if="currentUser.profileImageUrl && !imageLoadError"
          :key="currentUser.profileImageUrl"
          :src="currentUser.profileImageUrl"
          :alt="fullName"
          class="size-full object-cover"
          @error="imageLoadError = true"
        />
        <div
          v-else
          class="flex size-full items-center justify-center font-bold text-xs"
          :class="theme === 'dark' ? 'bg-button-primary text-white' : 'bg-blue-100 text-button-primary'"
        >
          <span v-if="userInitials">{{ userInitials }}</span>
          <svg v-else class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <!-- User Name & Level Badge Pill (Desktop) -->
      <div class="hidden sm:flex flex-col items-start text-left leading-tight">
        <span class="text-sm font-bold truncate max-w-[140px] md:max-w-[180px]">
          {{ fullName }}
        </span>
        <div class="mt-0.5">
          <span
            class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold"
            :class="levelBadgeClasses"
          >
            Level {{ currentLevel }}
          </span>
        </div>
      </div>

      <!-- Mobile Badge Pill -->
      <div class="sm:hidden">
        <span
          class="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          :class="levelBadgeClasses"
        >
          L{{ currentLevel }}
        </span>
      </div>

      <!-- Chevron Icon -->
      <svg
        class="size-4 shrink-0 transition-transform duration-200 opacity-60"
        :class="{ 'rotate-180': isDropdownOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isDropdownOpen"
        :class="[
          'absolute right-0 top-full mt-2 w-56 rounded-xl py-1.5 shadow-2xl z-50 transition-all',
          theme === 'dark'
            ? 'bg-[#002742]/95 backdrop-blur-md border border-white/20 text-white'
            : 'border border-gray-200 bg-white text-gray-800 shadow-xl'
        ]"
        role="menu"
      >
        <!-- Header in dropdown -->
        <div
          :class="[
            'px-4 py-2.5 border-b',
            theme === 'dark' ? 'border-white/10' : 'border-gray-100'
          ]"
        >
          <p :class="['text-xs font-medium', theme === 'dark' ? 'text-white/60' : 'text-gray-500']">Signed in as</p>
          <p :class="['text-sm font-bold truncate', theme === 'dark' ? 'text-white' : 'text-gray-900']">{{ fullName }}</p>
          <p :class="['text-xs truncate', theme === 'dark' ? 'text-white/60' : 'text-gray-500']">{{ currentUser.email }}</p>
          <div class="mt-1.5">
            <span
              class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold"
              :class="levelBadgeClasses"
            >
              Level {{ currentLevel }}
            </span>
          </div>
        </div>

        <!-- Links -->
        <div class="py-1">
          <!-- Admin Dashboard (if admin) -->
          <RouterLink
            v-if="currentUser.role === 'admin'"
            to="/admin"
            :class="[
              'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'text-cyan-300 hover:bg-white/10 hover:text-cyan-200'
                : 'text-cyan-700 hover:bg-cyan-50'
            ]"
            role="menuitem"
            @click="isDropdownOpen = false"
          >
            <svg class="size-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Dashboard
          </RouterLink>

          <!-- My Profile -->
          <RouterLink
            to="/profile"
            :class="[
              'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-button-primary'
            ]"
            role="menuitem"
            @click="isDropdownOpen = false"
          >
            <svg class="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </RouterLink>

          <!-- eLearning -->
          <RouterLink
            to="/elearning"
            :class="[
              'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-button-primary'
            ]"
            role="menuitem"
            @click="isDropdownOpen = false"
          >
            <svg class="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            eLearning
          </RouterLink>

          <!-- Take Exam -->
          <RouterLink
            to="/exam"
            :class="[
              'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
              theme === 'dark'
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-button-primary'
            ]"
            role="menuitem"
            @click="isDropdownOpen = false"
          >
            <svg class="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Take Exam
          </RouterLink>
        </div>

        <!-- Logout Action -->
        <div :class="['pt-1 border-t', theme === 'dark' ? 'border-white/10' : 'border-gray-100']">
          <button
            type="button"
            :class="[
              'flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium transition-colors cursor-pointer',
              theme === 'dark'
                ? 'text-rose-300 hover:bg-white/10 hover:text-rose-200'
                : 'text-red-600 hover:bg-red-50'
            ]"
            role="menuitem"
            @click="handleLogout"
          >
            <svg class="size-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { useUserStore } from '@/stores/user'
import { getLevelClasses } from '@/utils/levelDisplay'

interface Props {
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  theme: 'light',
})

const emit = defineEmits<{
  logout: []
}>()

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const currentUser = computed(() => userStore.userProfile || authStore.currentUser)
const isDropdownOpen = ref(false)
const imageLoadError = ref(false)
const profileDropdownRef = ref<HTMLElement | null>(null)

watch(
  () => currentUser.value?.profileImageUrl,
  (newUrl) => {
    if (newUrl) {
      imageLoadError.value = false
    }
  },
  { immediate: true }
)

const fullName = computed(() => {
  const u = currentUser.value
  if (!u) return 'Guest'
  if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`
  if (u.name && u.surname) return `${u.name} ${u.surname}`
  return u.name || u.username || 'User'
})

const userInitials = computed(() => {
  const name = fullName.value.trim()
  if (!name || name === 'Guest') return 'U'
  const parts = name.split(/\s+/)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? ''
    const second = parts[1]?.[0] ?? ''
    return `${first}${second}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

const currentLevel = computed(() => {
  return currentUser.value?.level ?? '1'
})

const levelBadgeClasses = computed(() => {
  const lvl = Number(currentLevel.value) || 1
  return getLevelClasses(lvl)
})

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleLogout() {
  isDropdownOpen.value = false
  emit('logout')
  authStore.logout()
  router.push('/login')
}

function handleClickOutside(event: MouseEvent) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>