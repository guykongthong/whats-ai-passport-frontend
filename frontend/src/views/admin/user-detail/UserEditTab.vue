<template>
  <div v-if="user" class="flex flex-col gap-6 max-w-2xl">
    <div>
      <h3 class="text-lg font-bold text-white">Edit User Information</h3>
      <p class="text-xs text-white/60">Update profile and contact information for this account.</p>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-sm flex items-center justify-between"
    >
      <span>{{ errorMessage }}</span>
      <button
        type="button"
        class="text-xs font-semibold hover:underline cursor-pointer"
        @click="errorMessage = null"
      >
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
import { useAuthStore } from '@/stores'
import AdminUserService from '@/services/AdminUserService'
import UserEditForm from '@/components/common/UserEditForm.vue'
import type { UserFormData } from '@/components/common/UserEditForm.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const adminUserStore = useAdminUserStore()
const authStore = useAuthStore()
const { triggerToast } = useToast()

const user = computed(() => adminUserStore.selectedUser)
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)

async function handleSave(formData: UserFormData) {
  if (!user.value) return
  isSaving.value = true
  errorMessage.value = null

  try {
    const isDataUrl = formData.profileImageUrl?.startsWith('data:')
    // Ensure payload fits within backend DB character varying(255) constraint
    const backendProfileImageUrl = (isDataUrl && formData.profileImageUrl.length > 255)
      ? (user.value.profileImageUrl && !user.value.profileImageUrl.startsWith('data:')
          ? user.value.profileImageUrl
          : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(user.value.username)}`)
      : formData.profileImageUrl

    const updatedData = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      email: formData.email.trim(),
      province: formData.province,
      profileImageUrl: backendProfileImageUrl,
    }

    const response = await AdminUserService.updateUser(user.value.id, updatedData)
    const returnedUser = { ...(response.data || updatedData) }

    // Preserve custom image upload in client state and storage
    if (formData.profileImageUrl) {
      returnedUser.profileImageUrl = formData.profileImageUrl
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('custom_admin_avatar', formData.profileImageUrl)
        } catch {
          // ignore
        }
      }
    }

    // Update adminUserStore with the returned data from backend
    adminUserStore.updateSelectedUser(returnedUser)
    await adminUserStore.fetchUserById(user.value.id, true)
    if (returnedUser.profileImageUrl) {
      adminUserStore.updateSelectedUser({ profileImageUrl: returnedUser.profileImageUrl })
    }

    // Sync with authStore if this user is the logged-in user (admin)
    if (
      authStore.currentUser &&
      (String(authStore.currentUser.id) === String(user.value.id) ||
        authStore.currentUser.username === user.value.username)
    ) {
      authStore.updateCurrentUser({
        firstname: returnedUser.firstname || updatedData.firstname,
        lastname: returnedUser.lastname || updatedData.lastname,
        name: returnedUser.firstname || updatedData.firstname,
        surname: returnedUser.lastname || updatedData.lastname,
        email: returnedUser.email || updatedData.email,
        province: returnedUser.province || updatedData.province,
        profileImageUrl: formData.profileImageUrl || returnedUser.profileImageUrl || '',
      })
    }

    // Display success toast notification
    triggerToast('User details updated successfully.')
    // Redirect to the info tab to view the updated details
    router.push({ name: 'admin-user-detail-info', params: { id: user.value.id } })
  } catch (err: unknown) {
    console.error('Failed to update user:', err)
    errorMessage.value = 'Failed to update user details. Please try again.'
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  errorMessage.value = null
  if (user.value) {
    router.push({ name: 'admin-user-detail-info', params: { id: user.value.id } })
  }
}
</script>
