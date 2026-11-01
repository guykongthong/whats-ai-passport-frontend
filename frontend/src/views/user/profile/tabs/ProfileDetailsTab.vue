<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-xl font-extrabold text-[#00385A]">Personal Information</h3>
        <p class="text-xs font-medium text-slate-500 mt-0.5">
          Update your personal details and contact information.
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
        <span class="size-1.5 rounded-full bg-indigo-600"></span>
        Level {{ userLevel }} Account
      </span>
    </div>

    <AlertBox
      v-if="alertMessage"
      :variant="alertVariant"
      :message="alertMessage"
      class="mb-6"
    />

    <UserProfileForm
      v-model="form"
      :errors="errors"
      theme="light"
      @submit="handleSave"
    >
      <template #actions>
        <div class="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <BaseButton
            type="button"
            variant="secondary"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold cursor-pointer"
            :disabled="isSubmitting"
            @click="handleReset"
          >
            Reset
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full sm:w-auto px-7 py-2.5 rounded-xl font-bold bg-[#00385A] hover:bg-[#002a43] text-white cursor-pointer shadow-xs"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </BaseButton>
        </div>
      </template>
    </UserProfileForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import UserProfileForm from '@/shared/components/UserProfileForm.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import AlertBox from '@/shared/components/AlertBox.vue'
import { validateRequired } from '@/shared/utils/validation'
import type { FieldErrors } from '@/types/FieldErrors'

const authStore = useAuthStore()
const userStore = useUserStore()
const { triggerToast } = useToast()

const isSubmitting = ref(false)
const errors = ref<FieldErrors>({})
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')

const userLevel = computed(() => userStore.currentUserLevel)

const form = reactive({
  nameTh: '',
  surnameTh: '',
  nameEn: '',
  surnameEn: '',
  province: '',
  email: '',
})

function loadCurrentData() {
  const profile = userStore.userProfile || authStore.currentUser
  if (profile) {
    form.nameTh = profile.nameTh || ''
    form.surnameTh = profile.surnameTh || ''
    form.nameEn = profile.firstname || profile.name || ''
    form.surnameEn = profile.lastname || profile.surname || ''
    form.province = profile.province || ''
    form.email = profile.email || ''
  }
}

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  loadCurrentData()
})

function handleReset() {
  errors.value = {}
  alertMessage.value = ''
  loadCurrentData()
}

async function handleSave() {
  errors.value = {}
  alertMessage.value = ''

  const validationErrors = validateRequired({
    nameTh: form.nameTh,
    surnameTh: form.surnameTh,
    nameEn: form.nameEn,
    surnameEn: form.surnameEn,
    province: form.province,
    email: form.email,
  })

  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    alertMessage.value = 'Please complete all required fields.'
    alertVariant.value = 'error'
    return
  }

  isSubmitting.value = true
  try {
    await userStore.updateUserProfile({
      firstname: form.nameEn,
      lastname: form.surnameEn,
      name: form.nameEn,
      surname: form.surnameEn,
      nameTh: form.nameTh,
      surnameTh: form.surnameTh,
      province: form.province,
      email: form.email,
    })

    alertMessage.value = 'Your profile details have been saved successfully.'
    alertVariant.value = 'success'
    await triggerToast('Profile updated successfully.')
  } catch (err: unknown) {
    console.error('Failed to update profile:', err)
    alertMessage.value = 'Failed to update profile. Please try again.'
    alertVariant.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>
