<template>
  <header :class="['flex flex-wrap justify-between items-center px-4 sm:px-8 min-h-[76px] py-4 shadow-sm gap-y-4', theme === 'dark' ? 'bg-transparent shadow-none' : 'bg-white']">
    <div class="flex flex-1 items-center gap-3 min-w-[fit-content]">
      <div v-if="theme === 'dark'" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white tracking-widest">LOGO</div>
      <RouterLink to="/" :class="['text-xl font-extrabold', theme === 'dark' ? 'text-white' : 'text-button-primary']">
        {{ logoText }}
      </RouterLink>
    </div>

    <nav class="flex flex-wrap order-last w-full justify-center xl:order-none xl:w-auto items-center gap-4 xl:gap-6 mt-4 xl:mt-0">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :class="[
          'text-sm font-medium px-4 py-1.5 rounded-full border transition-colors',
          theme === 'dark' 
            ? 'text-white border-white/30 hover:bg-white/10' 
            : 'text-button-primary border-transparent hover:bg-gray-100'
        ]"
        :active-class="theme === 'dark' ? 'bg-[#9eb8cd] border-transparent text-[#002D4F] font-bold' : 'bg-gray-100 font-bold'"
      >
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="flex flex-1 items-center justify-end">
      <UserProfile 
        v-if="userName"
        variant="navbar"
        :theme="theme"
        :user-name="userName"
        :user-role="userRole"
        @logout="handleLogout"
      />
      <RouterLink v-else to="/login" :class="['text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-button-primary']">
        Log in
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import UserProfile from '@/shared/components/UserProfile.vue'

interface NavLink {
  label: string
  to: string
}

interface Props {
  logoText?: string
  links: NavLink[]
  userName?: string | null
  userRole?: string
  theme?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  logoText: "WHAT'S",
  userName: null,
  userRole: 'Admin',
  theme: 'light',
})

const emit = defineEmits<{
  logout: []
}>()

function handleLogout() {
  emit('logout')
}
</script>
