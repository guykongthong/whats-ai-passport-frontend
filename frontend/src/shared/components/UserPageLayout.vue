<template>
  <div class="flex min-h-screen flex-col">
    <NavBar
      :links="navLinks"
      :user-name="userName"
      :user-role="userRole"
      @logout="handleLogout"
    />

    <slot name="toast" />

    <slot />

    <Footer :links="footerLinks" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/shared/components/NavBar.vue'
import Footer from '@/shared/components/Footer.vue'
import { userNavLinks, userFooterLinks } from '@/data/navigation'

const authStore = useAuthStore()
const router = useRouter()

const navLinks = userNavLinks
const footerLinks = userFooterLinks

const userName = computed(() => {
  const u = authStore.currentUser
  return u ? `${u.name} ${u.surname}` : null
})

const userRole = computed(() => {
  return authStore.currentUser?.role === 'admin' ? 'Admin' : 'User'
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
