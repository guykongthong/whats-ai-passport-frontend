<template>
  <div class="space-y-6">
    <!-- Tab Intro / Heading -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800">Personal Information</h2>
        <p class="text-xs sm:text-sm text-slate-500">
          Update your personal contact and location details.
        </p>
      </div>

      <!-- Quick Status Badge -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          :class="isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'"
        >
          <span
            class="size-1.5 rounded-full"
            :class="isActive ? 'bg-emerald-500' : 'bg-slate-400'"
          />
          {{ isActive ? 'Active Account' : 'Inactive Account' }}
        </span>
      </div>
    </div>

    <!-- Success Feedback Alert -->
    <Transition name="fade">
      <div
        v-if="successMessage"
        class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs"
      >
        <div class="flex items-center gap-2.5">
          <svg
            class="size-5 text-emerald-600 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ successMessage }}</span>
        </div>
        <button
          type="button"
          class="text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          @click="successMessage = null"
        >
          Dismiss
        </button>
      </div>
    </Transition>

    <!-- Error Feedback Alert -->
    <Transition name="fade">
      <div
        v-if="errorMessage"
        class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs"
      >
        <div class="flex items-center gap-2.5">
          <svg
            class="size-5 text-rose-600 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>
        <button
          type="button"
          class="text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
          @click="errorMessage = null"
        >
          Dismiss
        </button>
      </div>
    </Transition>

    <!-- Loading Skeleton -->
    <div
      v-if="isProfileLoading && !userData"
      class="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse"
    >
      <div class="h-4 bg-slate-200 rounded w-1/4" />
      <div class="h-10 bg-slate-100 rounded-xl" />
      <div class="h-4 bg-slate-200 rounded w-1/3" />
      <div class="h-10 bg-slate-100 rounded-xl" />
    </div>

    <!-- Reusable Edit Form (FE-USER-11 Criteria #24) -->
    <UserEditForm
      v-else
      :initial-data="userData"
      :is-saving="isSaving"
      :disable-email="true"
      theme="light"
      @submit-form="handleSave"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/authStore'
import UserEditForm, { type UserFormData } from '@/components/common/UserEditForm.vue'

const userStore = useUserStore()
const authStore = useAuthStore()

const isSaving = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const isProfileLoading = computed(() => userStore.isProfileLoading)

const userData = computed(() => {
  const profile = userStore.userProfile
  const authUser = authStore.currentUser

  return {
    firstname: profile?.firstname || profile?.name || authUser?.firstname || authUser?.name || '',
    lastname: profile?.lastname || profile?.surname || authUser?.lastname || authUser?.surname || '',
    email: profile?.email || authUser?.email || '',
    province: profile?.province || authUser?.province || '',
    profileImageUrl: profile?.profileImageUrl || authUser?.profileImageUrl || '',
  }
})

const isActive = computed(() => {
  return (
    userStore.userProfile?.enabled ??
    userStore.userProfile?.isActive ??
    authStore.currentUser?.enabled ??
    authStore.currentUser?.isActive ??
    true
  )
})

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

function handleCancel() {
  successMessage.value = null
  errorMessage.value = null
}

async function handleSave(formData: UserFormData) {
  isSaving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const payload = {
      firstname: formData.firstname.trim(),
      lastname: formData.lastname.trim(),
      province: formData.province,
      profileImageUrl: formData.profileImageUrl,
    }

    await userStore.updateUserProfile(payload)
    if (userStore.userProfile) {
      Object.assign(userStore.userProfile, payload)
    }
    successMessage.value = 'Your profile details have been updated successfully.'
  } catch (err: unknown) {
    console.error('Failed to update profile:', err)
    errorMessage.value = 'Failed to update profile details. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
