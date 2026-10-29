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
      <button type="button" class="text-xs font-semibold hover:underline cursor-pointer" @click="successMessage = null">
        Dismiss
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm flex items-center justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button type="button" class="text-xs font-semibold hover:underline cursor-pointer" @click="errorMessage = null">
        Dismiss
      </button>
    </div>

    <!-- Reusable Edit Form Card -->
    <div class="bg-white/10 rounded-2xl p-6 border border-white/10">
      <UserEditForm
        :initial-data="user"
        :is-saving="isSaving"
        @submit-form="handleSave"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminUserStore } from '@/stores/adminUser'
import AdminUserService from '@/services/AdminUserService'
import UserEditForm from '@/components/common/UserEditForm.vue'
import type { UserFormData } from '@/components/common/UserEditForm.vue'

const router = useRouter()
const adminUserStore = useAdminUserStore()
const user = computed(() => adminUserStore.selectedUser)

const isSaving = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

async function handleSave(formData: UserFormData) {
  if (!user.value) return
  isSaving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    await AdminUserService.updateUser(user.value.id, formData)
    adminUserStore.updateSelectedUser(formData)
    successMessage.value = 'User details updated successfully.'
  } catch (err: unknown) {
    console.error('Failed to update user:', err)
    errorMessage.value = 'Failed to update user details. Please try again.'
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  successMessage.value = null
  errorMessage.value = null
  if (user.value) {
    router.push({ name: 'admin-user-detail-info', params: { id: user.value.id } })
  }
}
</script>
