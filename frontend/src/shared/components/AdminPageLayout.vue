<template>
  <div class="min-h-screen bg-gradient-to-br from-[#00385e] to-[#4F6C83] flex flex-col relative">
    <slot name="toast" />

    <NavBar
      theme="dark"
      logo-text="The CA?T Passport"
      :user-name="adminDisplayName"
      :user-role="adminDisplayRole"
      :links="navLinks"
      @logout="handleLogout"
    />

    <main :class="['max-w-[1200px] mx-auto py-10 flex-1 w-full flex flex-col gap-6', mainPadding]">
      <PageTitle class="text-white">
        {{ title }}
      </PageTitle>

      <slot />
    </main>

    <Footer
      theme="dark"
      logo-text="WHAT'S"
      :links="footerLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/shared/components/NavBar.vue'
import Footer from '@/shared/components/Footer.vue'
import PageTitle from '@/shared/components/PageTitle.vue'
import { useAuthStore } from '@/stores'
import { adminNavLinks, adminFooterLinks } from '@/data/navigation'

withDefaults(defineProps<{
  title: string
  mainPadding?: string
}>(), {
  mainPadding: 'px-8',
})

const router = useRouter()
const authStore = useAuthStore()

const navLinks = adminNavLinks
const footerLinks = adminFooterLinks

const adminDisplayName = computed(() => {
  if (authStore.currentUser) {
    return `${authStore.currentUser.name} ${authStore.currentUser.surname}`
  }
  return 'Admin'
})

const adminDisplayRole = computed(() => {
  if (authStore.currentUser) {
    return `${authStore.currentUser.role} ${authStore.currentUser.id.slice(0, 8)}`
  }
  return 'Admin'
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
