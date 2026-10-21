<template>
  <div class="space-y-2">
    <h3 class="text-[20px] font-black mb-6 mt-8">Profile Information</h3>
    <div class="flex flex-col gap-2 text-[15px] sm:text-[17px]">
      <div>
        <span class="text-white font-bold">Name: </span>
        <span class="ml-2 font-bold">{{ user.name }} {{ user.surname }}</span>
      </div>
      <div v-if="user.nameTh || user.surnameTh">
        <span class="text-white font-bold">Name (TH): </span>
        <span class="ml-2 font-bold">{{ user.nameTh }} {{ user.surnameTh }}</span>
      </div>
      <div class="break-words sm:break-normal">
        <span class="text-white font-bold">Email: </span>
        <span class="ml-1 sm:ml-2 font-bold">{{ user.email }}</span>
      </div>
      <div>
        <span class="text-white font-bold">Province: </span>
        <span class="ml-2 font-bold">{{ user.province }}</span>
      </div>
      <div>
        <span class="text-white font-bold">Role: </span>
        <span class="ml-2 font-bold capitalize">{{ user.role }}</span>
      </div>
      <div>
        <span class="text-white font-bold">Status: </span>
        <span :class="['ml-2 font-bold', user.isActive ? 'text-green-400' : 'text-red-400']">
          {{ user.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'

const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.users.find(u => u.id === route.params.id)!)
</script>
