<template>
  <div v-if="user" class="flex flex-col gap-6 max-w-2xl">
    <div>
      <h3 class="text-lg font-bold text-white">Edit User Information</h3>
      <p class="text-xs text-white/60">Update profile and contact information for this account.</p>
    </div>

    <!-- Success / Error Alerts -->
    <div
      v-if="successMessage"
      class="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm flex items-center justify-between"
    >
      <span>{{ successMessage }}</span>
      <button type="button" class="text-xs font-semibold hover:underline" @click="successMessage = null">Dismiss</button>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm flex items-center justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button type="button" class="text-xs font-semibold hover:underline" @click="errorMessage = null">Dismiss</button>
    </div>

    <!-- Reusable Edit Form Component -->
    <UserEditForm
      :initial-data="user"
      :is-saving="isSaving"
      theme="dark"
      @submit-form="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminUserStore } from '@/stores/adminUser'
import AdminUserService from '@/services/AdminUserService'
import UserEditForm, { type UserEditFormData } from '@/shared/components/UserEditForm.vue'

const adminUserStore = useAdminUserStore()
const user = computed(() => adminUserStore.selectedUser)

const isSaving = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

function handleCancel() {
  successMessage.value = null
  errorMessage.value = null
}

async function handleSave(formData: UserEditFormData) {
  if (!user.value) return
  isSaving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const updatedData = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      province: formData.province,
      profileImageUrl: formData.profileImageUrl,
    }

    await AdminUserService.updateUser(user.value.id, updatedData)
    adminUserStore.updateSelectedUser(updatedData)
    successMessage.value = 'User details updated successfully.'
  } catch (err: unknown) {
    console.error('Failed to update user:', err)
    errorMessage.value = 'Failed to update user details. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>
