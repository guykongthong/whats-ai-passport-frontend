<template>
  <UserPageLayout>
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" />
    </template>

    <!-- Main content -->
    <main class="flex flex-1 justify-center bg-[#EEF2F7] px-4 py-10 sm:px-6">
      <div class="w-full max-w-2xl">
        <div class="mb-6">
          <BackLink
            to="/dashboard"
            label="Back to Dashboard"
            customClass="text-sm font-semibold text-button-primary underline underline-offset-2"
          />
        </div>

        <div class="rounded-2xl bg-white p-6 sm:p-10 shadow-sm border border-gray-100">
          <h2 class="mb-8 text-2xl font-extrabold text-button-primary">Edit Profile</h2>

          <AlertBox 
            v-if="alertMessage" 
            :variant="alertVariant" 
            :message="alertMessage" 
            class="mb-6" 
          />

          <UserProfileForm
            v-model="form"
            :errors="error"
            @submit="handleSave"
          >
            <template #actions>
              <div class="mt-4 flex gap-4">
                <BaseButton type="button" variant="secondary" class="flex-1" @click="handleCancel">
                  Cancel
                </BaseButton>
                <BaseButton type="submit" variant="primary" class="flex-1">
                  Save Changes
                </BaseButton>
              </div>
            </template>
          </UserProfileForm>
        </div>
      </div>
    </main>

  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import UserProfileForm from '@/shared/components/UserProfileForm.vue'
import Toast from '@/shared/components/Toast.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BackLink from '@/shared/components/BackLink.vue'
import AlertBox from '@/shared/components/AlertBox.vue'
import { validateRequired } from '@/shared/utils/validation'
import type { FieldErrors } from '@/types/FieldErrors'

const authStore = useAuthStore()
const router = useRouter()
const { showToast, toastMessage, triggerToast } = useToast()

const error = ref<FieldErrors>({})
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')

const form = reactive({
  nameTh: '',
  surnameTh: '',
  nameEn: '',
  surnameEn: '',
  province: '',
  email: '',
})

onMounted(() => {
  const user = authStore.currentUser
  if (user) {
    form.nameTh = user.nameTh || ''
    form.surnameTh = user.surnameTh || ''
    form.nameEn = user.name || ''
    form.surnameEn = user.surname || ''
    form.province = user.province || ''
    form.email = user.email || ''
  }
})



async function handleSave() {
  const stepErrors = validateRequired({
    nameTh: form.nameTh,
    surnameTh: form.surnameTh,
    nameEn: form.nameEn,
    surnameEn: form.surnameEn,
    province: form.province,
    email: form.email,
  })
  
  error.value = stepErrors
  
  if (Object.keys(stepErrors).length > 0) {
    alertMessage.value = 'Please fill in all required fields.'
    alertVariant.value = 'error'
    return
  }

  const user = authStore.currentUser
  if (user) {
    authStore.updateUser(user.id, {
      nameTh: form.nameTh,
      surnameTh: form.surnameTh,
      name: form.nameEn,
      surname: form.surnameEn,
      province: form.province,
      email: form.email,
    })

    await triggerToast('Your profile has been updated.')
    router.push('/dashboard')
  }
}

function handleCancel() {
  router.push('/dashboard')
}
</script>
