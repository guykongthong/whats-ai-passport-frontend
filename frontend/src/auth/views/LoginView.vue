<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import LoginForm from '@/auth/components/LoginForm.vue'
import Footer from '@/shared/components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()
const loginError = ref('')

const onLoginSubmit = (email: string) => {
  loginError.value = ''
  authStore.login(email)

  if (authStore.currentUser) {
    if (authStore.currentUser.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } else {
    loginError.value = `"${email}" does not exist`
  }
}

const noAccount = () => {
  router.push('/register')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <main class="flex flex-1 items-center justify-center p-4">
      <LoginForm :login-error="loginError" @submit-login="onLoginSubmit" @no-account="noAccount" />
    </main>
    <Footer :links="[]" />
  </div>
</template>
