<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <NavBar :links="[]" />

    <main class="flex flex-1 items-center justify-center px-4 py-12">
      <RegisterForm
        :register-error="registerError"
        :is-submitting="isSubmitting"
        @submit-register="handleRegister"
      />
    </main>

    <Footer :links="[]" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/shared/components/Footer.vue'
import NavBar from '@/shared/components/NavBar.vue'
import RegisterForm from '@/auth/components/RegisterForm.vue'
import { useAuthStore } from '@/stores'
import type { RegisterPayload } from '@/types'

const authStore = useAuthStore()
const router = useRouter()
const registerError = ref('')
const isSubmitting = ref(false)

async function handleRegister(payload: RegisterPayload) {
  registerError.value = ''
  isSubmitting.value = true
  try {
    await authStore.register(payload)
    await router.push({ path: '/login', query: { registered: 'true' } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
    registerError.value = message
    throw err
  } finally {
    isSubmitting.value = false
  }
}
</script>
