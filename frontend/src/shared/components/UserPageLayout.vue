<template>
  <div v-if="isInsideLayout" class="flex flex-1 flex-col">
    <slot name="toast">
      <Toast :show="showToast" :message="toastMessage" />
    </slot>

    <slot />
  </div>

  <div v-else class="flex min-h-screen flex-col">
    <NavBar
      :links="navLinks"
      :user-name="userName"
      :user-role="userRole"
      @logout="handleLogout"
    />

    <slot name="toast">
      <Toast :show="showToast" :message="toastMessage" />
    </slot>

    <slot />

    <Footer :links="footerLinks" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
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
const isInsideLayout = inject('insideUserLayout', false)

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
