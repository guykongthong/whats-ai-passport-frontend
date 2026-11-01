<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useOnlineStatus } from '@/composables/useOnlineStatus'

const router = useRouter()
const { isOnline } = useOnlineStatus()

watch(isOnline, (online) => {
  if (!online && router.currentRoute.value.name !== 'offline') {
    router.push('/offline')
  }
})
</script>

<template>
  <RouterView />
</template>
