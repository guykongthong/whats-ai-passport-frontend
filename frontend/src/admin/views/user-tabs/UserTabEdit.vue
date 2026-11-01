<template>
  <div class="space-y-6">
    <h3 class="text-[20px] font-black mb-4">Edit Profile</h3>
    <div class="max-w-[800px]">
      <UserProfileForm 
        v-model="editForm" 
        :is-admin="true" 
        theme="dark" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import UserProfileForm from '@/shared/components/UserProfileForm.vue'

const authStore = useAuthStore()
const editForm = authStore.adminEditForm
</script>
