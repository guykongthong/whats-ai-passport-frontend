<template>
  <div class="min-h-screen bg-gradient-to-br from-[#00385e] to-[#4F6C83] flex flex-col relative font-display">
    <NavBar
      theme="dark"
      logo-text="The CA?T Passport"
      :links="navLinks"
      @logout="handleLogout"
    />

    <slot name="toast">
      <Toast :show="showToast" :message="toastMessage" />
    </slot>

    <slot />

    <Footer
      theme="dark"
      logo-text="WHAT'S"
      :links="footerLinks"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import Toast from '@/shared/components/Toast.vue'
import NavBar from '@/shared/components/NavBar.vue'
import Footer from '@/shared/components/Footer.vue'
import { userNavLinks, userFooterLinks } from '@/data/navigation'

const authStore = useAuthStore()
const router = useRouter()
const { showToast, toastMessage } = useToast()

const navLinks = userNavLinks
const footerLinks = userFooterLinks

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
