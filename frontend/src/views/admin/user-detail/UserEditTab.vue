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

    <!-- Edit Form Card -->
    <form class="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-4" @submit.prevent="handleSave">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-white/70 mb-1.5">First Name</label>
          <input
            v-model="form.firstname"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-white/70 mb-1.5">Last Name</label>
          <input
            v-model="form.lastname"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-white/70 mb-1.5">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-white/70 mb-1.5">Province</label>
        <select
          v-model="form.province"
          class="w-full px-3.5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm cursor-pointer"
        >
          <option value="" class="text-slate-800 bg-white">Select Province</option>
          <option
            v-for="prov in provinces"
            :key="prov"
            :value="prov"
            class="text-slate-800 bg-white"
          >
            {{ prov }}
          </option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl border border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          @click="resetForm"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="isSaving"
          class="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
        >
          <span v-if="isSaving" class="size-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useAdminUserStore } from '@/stores/adminUser'
import AdminUserService from '@/services/AdminUserService'

const adminUserStore = useAdminUserStore()
const user = computed(() => adminUserStore.selectedUser)

const isSaving = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const provinces = [
  'Bangkok',
  'Chiang Mai',
  'Chiang Rai',
  'Chonburi',
  'Khon Kaen',
  'Nakhon Ratchasima',
  'Nonthaburi',
  'Phuket',
  'Songkhla',
]

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  province: '',
})

function syncFormWithUser() {
  if (user.value) {
    form.firstname = user.value.firstname || ''
    form.lastname = user.value.lastname || ''
    form.email = user.value.email || ''
    form.province = user.value.province || ''
  }
}

watch(
  user,
  () => {
    syncFormWithUser()
  },
  { immediate: true },
)

function resetForm() {
  syncFormWithUser()
  successMessage.value = null
  errorMessage.value = null
}

async function handleSave() {
  if (!user.value) return
  isSaving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const updatedData = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      email: form.email.trim(),
      province: form.province,
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
