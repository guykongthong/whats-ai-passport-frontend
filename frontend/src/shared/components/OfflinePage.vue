<template>
  <div class="flex min-h-screen flex-col">
    <Toast :show="showToast" :message="toastMessage" class="sticky top-0 backdrop-blur-sm" />

    <main class="flex flex-1 flex-col items-center justify-center bg-[#dbe2ea] px-4 pb-56 text-center">
      <h1 class="text-[6rem] leading-none text-[#003e6b] font-js-chanok mb-6">Network Error</h1>
      <p class="text-xl text-black font-js-chanchai mb-4">
        Check your Wi-Fi or mobile data connection, then try again.
      </p>
      <p class="text-xl text-black font-js-chanchai cursor-pointer hover:opacity-80 transition-opacity" @click="handleRetry">
        Re-runs the connection check <span class="underline underline-offset-4">"Retry"</span>
      </p>
    </main>

  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useOnlineStatus } from '@/composables/useOnlineStatus'
import { useToast } from '@/composables/useToast'
import Toast from '@/shared/components/Toast.vue'


const authStore = useAuthStore()
const router = useRouter()
const { isOnline } = useOnlineStatus()
const { showToast, toastMessage, triggerToast } = useToast()



function goToSafeHome() {
  if (!authStore.currentUser) {
    router.push('/login')
  } else {
    router.push(authStore.currentUser.role === 'admin' ? '/admin' : '/dashboard')
  }
}

async function reconnectAndRedirect() {
  await triggerToast('Back online — redirecting...', 1200)
  goToSafeHome()
}

function handleRetry() {
  if (isOnline.value) {
    reconnectAndRedirect()
  }
}

watch(isOnline, (online) => {
  if (online) {
    reconnectAndRedirect()
  }
})


</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
.font-js-chanok {
  font-family: 'Merriweather', 'JS Chanok', serif;
}
.font-js-chanchai {
  font-family: 'Merriweather', 'JS ChanChai', serif;
}
</style>
