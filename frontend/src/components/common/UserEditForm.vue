<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Profile Image Upload Field -->
    <div class="space-y-2">
      <ImageUpload
        v-model="form.profileImageUrl"
        label="Profile Image"
        :disabled="disabled || isSaving"
      />
    </div>

    <!-- Personal Names Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
          First Name <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.firstname"
          type="text"
          required
          :disabled="disabled || isSaving"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-colors"
          placeholder="Enter first name"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
          Last Name <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.lastname"
          type="text"
          required
          :disabled="disabled || isSaving"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-colors"
          placeholder="Enter last name"
        />
      </div>
    </div>

    <!-- Email Field -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
        Email Address <span class="text-rose-500">*</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        required
        :disabled="disabled || isSaving || disableEmail"
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-colors"
        placeholder="Enter email address"
      />
    </div>

    <!-- Province Field -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
        Province
      </label>
      <select
        v-model="form.province"
        :disabled="disabled || isSaving"
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-colors cursor-pointer"
      >
        <option value="" class="text-slate-900 bg-white">Select Province</option>
        <option
          v-if="form.province && !provinces.includes(form.province)"
          :value="form.province"
          class="text-slate-900 bg-white"
        >
          {{ form.province }}
        </option>
        <option
          v-for="prov in provinces"
          :key="prov"
          :value="prov"
          class="text-slate-900 bg-white"
        >
          {{ prov }}
        </option>
      </select>
    </div>

    <!-- Action Buttons (Save Changes & Cancel) -->
    <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-white/10">
      <button
        type="button"
        :disabled="disabled || isSaving"
        class="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </button>

      <button
        type="submit"
        :disabled="disabled || isSaving"
        class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
      >
        <span
          v-if="isSaving"
          class="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"
        />
        <span>{{ isSaving ? 'Saving...' : submitLabel }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import type { AdminUser } from '@/types/admin'

export interface UserFormData {
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl: string
}

interface Props {
  initialData?: AdminUser | Partial<AdminUser> | null
  isSaving?: boolean
  submitLabel?: string
  cancelLabel?: string
  disabled?: boolean
  disableEmail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  isSaving: false,
  submitLabel: 'Save Changes',
  cancelLabel: 'Cancel',
  disabled: false,
  disableEmail: false,
})

const emit = defineEmits<{
  (e: 'submit-form', formData: UserFormData): void
  (e: 'cancel'): void
}>()

const provinces = [
  'Bangkok',
  'Chiang Mai',
  'Chiang Rai',
  'Chonburi',
  'Khon Kaen',
  'Krabi',
  'Lampang',
  'Lamphun',
  'Mae Hong Son',
  'Nakhon Pathom',
  'Nakhon Ratchasima',
  'Nonthaburi',
  'Pathum Thani',
  'Phayao',
  'Phitsanulok',
  'Phuket',
  'Rayong',
  'Samut Prakan',
  'Songkhla',
  'Surat Thani',
  'Udon Thani',
]

const form = reactive<UserFormData>({
  firstname: '',
  lastname: '',
  email: '',
  province: '',
  profileImageUrl: '',
})

function populateForm(data: AdminUser | Partial<AdminUser> | null) {
  if (data) {
    form.firstname = data.firstname || ''
    form.lastname = data.lastname || ''
    form.email = data.email || ''
    form.province = data.province || ''
    form.profileImageUrl = data.profileImageUrl || ''
  } else {
    form.firstname = ''
    form.lastname = ''
    form.email = ''
    form.province = ''
    form.profileImageUrl = ''
  }
}

watch(
  () => props.initialData,
  (newData) => {
    populateForm(newData)
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit-form', {
    firstname: form.firstname.trim(),
    lastname: form.lastname.trim(),
    email: form.email.trim(),
    province: form.province,
    profileImageUrl: form.profileImageUrl,
  })
}

function handleCancel() {
  populateForm(props.initialData)
  emit('cancel')
}
</script>
