<template>
  <AdminPageLayout title="User Details" main-padding="px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <BaseCard v-if="user" class="p-4 sm:p-8 w-full max-w-[800px] mx-auto">
        <!-- Header Info -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/20 pb-6 mb-6 gap-4">
          <div class="flex items-center gap-5">
            <div class="flex size-20 items-center justify-center rounded-full bg-black/20 text-white shrink-0">
              <UserIcon class="size-12" />
            </div>
            <div>
              <h2 class="text-white text-2xl font-black">{{ user.name }} {{ user.surname }}</h2>
              <p class="text-white/60 text-sm font-semibold mt-1">{{ user.email }}</p>
            </div>
          </div>
          <div>
            <div :class="['px-3 py-1 rounded-md text-xs font-semibold', getLevelClasses(Number(user.level))]">
              Level {{ user.level }}: {{ getLevelName(Number(user.level)) }}
            </div>
          </div>
        </div>

        <!-- Sub Navbar -->
        <div class="flex flex-wrap gap-4 font-bold mb-8 text-[16px]">
          <button 
            @click="router.push(`/admin/users/${user.id}/info`)" 
            :class="['transition-colors pb-1', route.path.endsWith('/info') ? 'border-b-2 border-[#d0dbed] text-[#d0dbed]' : 'text-[#01172e] hover:text-[#d0dbed]/80']"
          >
            User Information
          </button>
          <span class="text-[#01172e]/40 hidden sm:inline">|</span>
          <button 
            @click="router.push(`/admin/users/${user.id}/history`)" 
            :class="['transition-colors pb-1', route.path.endsWith('/history') ? 'border-b-2 border-[#d0dbed] text-[#d0dbed]' : 'text-[#01172e] hover:text-[#d0dbed]/80']"
          >
            Exam History
          </button>
          <span class="text-[#01172e]/40 hidden sm:inline">|</span>
          <button 
            @click="router.push(`/admin/users/${user.id}/edit`)" 
            :class="['transition-colors pb-1', route.path.endsWith('/edit') ? 'border-b-2 border-[#d0dbed] text-[#d0dbed]' : 'text-[#01172e] hover:text-[#d0dbed]/80']"
          >
            Edit Information
          </button>
        </div>

        <!-- Tab Contents (RouterView) -->
        <div class="text-white max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          <RouterView />
        </div>

        <!-- Back Buttons Footer -->
        <div class="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <BackLink to="/admin" label="← Back to Users" />

          <div v-if="route.path.endsWith('/edit')" class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <BaseButton 
              variant="primary"
              :class="[
                'rounded-xl px-6 py-2.5 font-extrabold border-none w-full sm:w-auto',
                user.isActive ? 'bg-[#B3392F] hover:bg-[#B3392F] text-white' : 'bg-[#2F7035] hover:bg-[#2F7035] text-white'
              ]"
              @click="toggleActiveStatus"
            >
              {{ user.isActive ? 'Deactivate User' : 'Activate User' }}
            </BaseButton>
            <BaseButton 
              variant="secondary"
              class="bg-white text-[#00385e] hover:bg-white/90 rounded-xl px-6 py-2.5 font-extrabold w-full sm:w-auto"
              @click="saveUser"
            >
              Update User
            </BaseButton>
          </div>
        </div>
      </BaseCard>
      <div v-else class="text-center text-white py-12">
        <p class="text-xl font-bold">User not found</p>
      </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BackLink from '@/shared/components/BackLink.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import UserIcon from '@/shared/components/icons/UserIcon.vue'
import { useAuthStore } from '@/stores'
import type { User } from '@/types/User'
import { useToast } from '@/composables/useToast'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast, toastMessage, triggerToast } = useToast()

const user = ref<User | null>(null)



onMounted(() => {
  const userId = route.params.id as string
  const foundUser = authStore.users.find(u => u.id === userId)
  if (foundUser) {
    user.value = foundUser
    authStore.adminEditForm.nameTh = foundUser.nameTh || ''
    authStore.adminEditForm.surnameTh = foundUser.surnameTh || ''
    authStore.adminEditForm.nameEn = foundUser.name || ''
    authStore.adminEditForm.surnameEn = foundUser.surname || ''
    authStore.adminEditForm.email = foundUser.email
    authStore.adminEditForm.province = foundUser.province
    authStore.adminEditForm.level = foundUser.level
  }
})



async function toggleActiveStatus() {
  if (user.value) {
    if (user.value.isActive) {
      authStore.deactivateUser(user.value.id)
      await triggerToast('User has been deactivated.')
    } else {
      authStore.activateUser(user.value.id)
      await triggerToast('User has been activated.')
    }
    router.push(`/admin/users/${user.value.id}/info`)
  }
}

async function saveUser() {
  if (user.value) {
    authStore.updateUser(user.value.id, {
      nameTh: authStore.adminEditForm.nameTh,
      surnameTh: authStore.adminEditForm.surnameTh,
      name: authStore.adminEditForm.nameEn,
      surname: authStore.adminEditForm.surnameEn,
      email: authStore.adminEditForm.email,
      province: authStore.adminEditForm.province,
      level: authStore.adminEditForm.level,
    })

    await triggerToast('This user information has been updated.')
    router.push(`/admin/users/${user.value.id}/info`)
  }
}


</script>
