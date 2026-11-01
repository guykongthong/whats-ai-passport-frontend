<template>
  <div v-if="variant === 'navbar'" ref="menuRef" class="relative">
    <button
      type="button"
      :class="[
        'flex items-center gap-3 px-4 py-1.5 rounded-full border',
        theme === 'dark' ? 'border-white/30 text-white' : 'border-transparent text-button-primary'
      ]"
      @click="isMenuOpen = !isMenuOpen"
    >
      <div class="flex flex-col items-end text-right">
        <span class="text-xs font-bold leading-tight">{{ userName }}</span>
        <span class="text-[10px] opacity-80 leading-tight">{{ userRole }}</span>
      </div>
      <div :class="['flex size-8 items-center justify-center rounded-full text-sm font-semibold', theme === 'dark' ? 'bg-white/10 text-white' : 'bg-button-primary text-white']">
        <UserIcon v-if="theme === 'dark'" class="size-6 text-white/50" />
        <span v-else>{{ userInitials }}</span>
      </div>
    </button>

    <div
      v-if="isMenuOpen"
      class="absolute right-0 top-full mt-2 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-50"
    >
      <RouterLink
        v-if="userRole === 'Admin'"
        to="/admin"
        class="block w-full px-4 py-2 text-left text-sm font-medium text-button-primary hover:bg-button-secondary"
        @click="isMenuOpen = false"
      >
        Admin Dashboard
      </RouterLink>
      <RouterLink
        v-else
        to="/dashboard"
        class="block w-full px-4 py-2 text-left text-sm font-medium text-button-primary hover:bg-button-secondary"
        @click="isMenuOpen = false"
      >
        My Profile
      </RouterLink>
      <button
        type="button"
        class="w-full px-4 py-2 text-left text-sm font-medium text-button-primary hover:bg-button-secondary"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
    <!-- Left: avatar + info -->
    <div class="flex items-center gap-4">
      <!-- Avatar circle with person icon -->
      <div class="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
        <UserIcon class="size-7 text-button-primary" />
      </div>

      <div>
        <p class="text-base font-bold text-gray-900">{{ fullNameEn }}</p>
        <LevelBadge v-if="currentUser" :level="currentUser.level" class="mt-0.5" />
      </div>
    </div>

    <!-- Right: Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
      <RouterLink
        to="/dashboard/exam-history"
        class="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-button-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        <DocumentTextIcon class="size-4" />
        Exam History
      </RouterLink>
      
      <RouterLink
        to="/profile/edit"
        class="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-button-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
      >
        <PencilSquareIcon class="size-4" />
        Edit Profile
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LevelBadge from '@/shared/components/LevelBadge.vue'
import UserIcon from '@/shared/components/icons/UserIcon.vue'
import PencilSquareIcon from '@/shared/components/icons/PencilSquareIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'

const props = withDefaults(defineProps<{
  variant?: 'card' | 'navbar'
  theme?: 'light' | 'dark'
  userName?: string | null
  userRole?: string
}>(), {
  variant: 'card',
  theme: 'light',
  userName: null,
  userRole: 'User',
})

const emit = defineEmits<{
  (e: 'logout'): void
}>()

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const fullNameEn = computed(() => {
  if (!currentUser.value) return 'Guest'
  return `${currentUser.value.name} ${currentUser.value.surname}`
})

const userInitials = computed(() =>
  (props.userName ?? '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase(),
)

const isMenuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function handleLogout() {
  isMenuOpen.value = false
  emit('logout')
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
