<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <NavBar :links="[]" />

    <Toast :show="showToast" :message="toastMessage" />

    <main class="flex flex-1 items-center justify-center px-4 py-12">
      <RegisterForm @submit-register="handleRegister" />
    </main>

    <Footer :links="[]" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Footer from '@/shared/components/Footer.vue'
import NavBar from '@/shared/components/NavBar.vue'
import RegisterForm from '@/auth/components/RegisterForm.vue'
import Toast from '@/shared/components/Toast.vue'
import { useAuthStore } from '@/stores';
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const router = useRouter()
const { showToast, toastMessage, triggerToast } = useToast()

async function handleRegister(
  nameTh: string,
  surnameTh: string,
  nameEn: string,
  surnameEn: string,
  province: string,
  email: string,
) {
  authStore.register({
  nameTh,
  surnameTh,
  nameEn,
  surnameEn,
  province,
  email,})

  await triggerToast('Registration successful! Redirecting to login...', 2000)
  router.push('/login')
}
</script>
