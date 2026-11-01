<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import { isUserAdmin } from '@/shared/utils/auth'
import LoginForm from '@/auth/components/LoginForm.vue'
import Footer from '@/shared/components/Footer.vue'
import Toast from '@/shared/components/Toast.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loginError = ref('')
const { showToast, toastMessage, triggerToast } = useToast()

onMounted(() => {
  if (route.query.registered === 'true') {
    triggerToast('Registration successful! Please log in.', 4000)
  }
})

const onLoginSubmit = async (username: string, password?: string) => {
  loginError.value = ''
  const result = await authStore.login(username, password)

  if (result === 'deactivated') {
    loginError.value = 'This account has been deactivated. Please contact an administrator.'
    return
  }

  if (authStore.currentUser) {
    if (isUserAdmin(authStore.currentUser)) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } else {
    loginError.value = `"${username}" does not exist or invalid password`
  }
}

const noAccount = () => {
  router.push('/register')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <Toast :show="showToast" :message="toastMessage" />
    <main class="flex flex-1 items-center justify-center p-4">
      <LoginForm :login-error="loginError" @submit-login="onLoginSubmit" @no-account="noAccount" />
    </main>
    <Footer :links="[]" />
  </div>
</template>
