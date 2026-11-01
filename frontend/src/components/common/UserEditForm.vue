<template>
  <form class="flex flex-col gap-5 sm:gap-6" @submit.prevent="onSubmit">
    <!-- Profile Image Upload Field -->
    <div class="flex flex-col gap-2">
      <ImageUpload
        v-model="profileImageUrl"
        label="Profile Image"
        label-class="text-sm font-bold text-white"
        theme="dark"
        :disabled="disabled || isSaving"
      />
    </div>

    <!-- Personal Names Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-white">
          First Name <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="firstname"
          type="text"
          :disabled="disabled || isSaving"
          :class="[
            'w-full h-11 sm:h-12 px-4 rounded-xl border bg-black/25 hover:bg-black/30 focus:bg-black/40 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 text-sm sm:text-base transition-colors backdrop-blur-md',
            firstnameError
              ? (theme === 'dark' ? 'border-rose-400 focus:ring-rose-400/50' : 'border-rose-500 focus:ring-rose-500/30')
              : (theme === 'dark' ? 'border-white/20 focus:ring-white/30 focus:border-white/40' : 'border-gray-300')
          ]"
          placeholder="Enter first name"
          @blur="validateField('firstname')"
        />
        <p v-if="firstnameError" class="text-xs text-rose-300 font-medium">
          {{ firstnameError }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-white">
          Last Name <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="lastname"
          type="text"
          :disabled="disabled || isSaving"
          :class="[
            'w-full h-11 sm:h-12 px-4 rounded-xl border bg-black/25 hover:bg-black/30 focus:bg-black/40 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 text-sm sm:text-base transition-colors backdrop-blur-md',
            lastnameError
              ? (theme === 'dark' ? 'border-rose-400 focus:ring-rose-400/50' : 'border-rose-500 focus:ring-rose-500/30')
              : (theme === 'dark' ? 'border-white/20 focus:ring-white/30 focus:border-white/40' : 'border-gray-300')
          ]"
          placeholder="Enter last name"
          @blur="validateField('lastname')"
        />
        <p v-if="lastnameError" class="text-xs text-rose-300 font-medium">
          {{ lastnameError }}
        </p>
      </div>
    </div>

    <!-- Email Field -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-white">
        Email Address <span class="text-rose-400">*</span>
      </label>
      <input
        v-model="email"
        type="email"
        :disabled="disabled || isSaving || disableEmail"
        :class="[
          'w-full h-11 sm:h-12 px-4 rounded-xl border bg-black/25 hover:bg-black/30 focus:bg-black/40 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 text-sm sm:text-base transition-colors backdrop-blur-md',
          emailError
            ? (theme === 'dark' ? 'border-rose-400 focus:ring-rose-400/50' : 'border-rose-500 focus:ring-rose-500/30')
            : (theme === 'dark' ? 'border-white/20 focus:ring-white/30 focus:border-white/40' : 'border-gray-300'),
          disabled || isSaving || disableEmail ? 'opacity-60 cursor-not-allowed' : '',
        ]"
        placeholder="Enter email address"
        @blur="validateField('email')"
      />
      <p v-if="emailError" class="text-xs text-rose-300 font-medium">
        {{ emailError }}
      </p>
    </div>

    <!-- Province Field -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-bold text-white">
        Province <span class="text-rose-400">*</span>
      </label>
      <div class="relative">
        <select
          v-model="province"
          :disabled="disabled || isSaving"
          :class="[
            'w-full h-11 sm:h-12 pl-4 pr-10 rounded-xl border bg-black/25 hover:bg-black/30 focus:bg-black/40 border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 text-sm sm:text-base transition-all cursor-pointer backdrop-blur-md appearance-none',
            provinceError
              ? (theme === 'dark' ? 'border-rose-400 focus:ring-rose-400/50' : 'border-rose-500 focus:ring-rose-500/30')
              : (theme === 'dark' ? 'border-white/20 focus:ring-white/30 focus:border-white/40' : 'border-gray-300'),
            disabled || isSaving ? 'opacity-60 cursor-not-allowed' : '',
          ]"
          @blur="validateField('province')"
        >
          <option value="" :class="theme === 'dark' ? 'text-white bg-[#002742]' : 'text-slate-900 bg-white'">
            Select Province
          </option>
          <option
            v-if="province && !provinces.includes(province)"
            :value="province"
            :class="theme === 'dark' ? 'text-white bg-[#002742]' : 'text-slate-900 bg-white'"
          >
            {{ province }}
          </option>
          <option
            v-for="prov in provinces"
            :key="prov"
            :value="prov"
            :class="theme === 'dark' ? 'text-white bg-[#002742]' : 'text-slate-900 bg-white'"
          >
            {{ prov }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
          :class="theme === 'dark' ? 'text-white/70' : 'text-gray-500'"
        >
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <p v-if="provinceError" class="text-xs text-rose-300 font-medium">
        {{ provinceError }}
      </p>
    </div>

    <!-- Action Buttons (Save Changes & Cancel) -->
    <div class="mt-2 pt-6 flex items-center justify-end gap-3 border-t border-white/10">
      <button
        type="button"
        :disabled="disabled || isSaving"
        :class="[
          'rounded-xl border font-semibold transition-colors cursor-pointer disabled:opacity-50 select-none',
          theme === 'dark'
            ? 'px-5 py-2.5 border-white/30 text-white hover:bg-white/10 text-sm'
            : 'px-4 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm'
        ]"
        @click="handleCancel"
      >
        {{ cancelLabel }}
      </button>

      <button
        type="submit"
        :disabled="isSubmitDisabled"
        :class="[
          'rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 select-none',
          theme === 'dark'
            ? (isSubmitDisabled ? 'bg-[#C1D7AE]/50 text-[#00385e]/70 cursor-not-allowed opacity-60 px-6 py-2.5 text-sm' : 'bg-[#C1D7AE] hover:bg-[#b2cb9d] text-[#00385e] cursor-pointer active:scale-95 px-6 py-2.5 text-sm shadow-md')
            : (isSubmitDisabled ? 'bg-indigo-600/50 text-white/70 cursor-not-allowed opacity-60 px-5 py-2.5 text-xs sm:text-sm' : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-indigo-500/20 px-5 py-2.5 text-xs sm:text-sm')
        ]"
      >
        <span
          v-if="isSaving"
          class="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
        <span>{{ isSaving ? 'Saving...' : submitLabel }}</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
export interface UserFormData {
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl: string
}
</script>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import ImageUpload from '@/components/common/ImageUpload.vue'
import type { AdminUser } from '@/types/admin'

interface Props {
  initialData?: AdminUser | Partial<AdminUser> | null
  isSaving?: boolean
  submitLabel?: string
  cancelLabel?: string
  disabled?: boolean
  disableEmail?: boolean
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  isSaving: false,
  submitLabel: 'Save Changes',
  cancelLabel: 'Cancel',
  disabled: false,
  disableEmail: false,
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'submit-form', formData: UserFormData): void
  (e: 'cancel'): void
}>()

// 1. Yup Validation Schema (Criteria #27)
const userEditSchema = yup.object({
  firstname: yup
    .string()
    .trim()
    .required('First name is required'),
  lastname: yup
    .string()
    .trim()
    .required('Last name is required'),
  email: yup
    .string()
    .trim()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  province: yup
    .string()
    .trim()
    .required('Province is required'),
  profileImageUrl: yup
    .string()
    .nullable()
    .optional(),
})

// 2. Connect schema with VeeValidate useForm
const { handleSubmit, errors, meta, resetForm, setValues, validateField } = useForm<UserFormData>({
  validationSchema: toTypedSchema(userEditSchema),
  initialValues: {
    firstname: props.initialData?.firstname || '',
    lastname: props.initialData?.lastname || '',
    email: props.initialData?.email || '',
    province: props.initialData?.province || '',
    profileImageUrl: props.initialData?.profileImageUrl || '',
  },
})

// 3. Connect fields with VeeValidate useField
const { value: firstname, errorMessage: firstnameError } = useField<string>('firstname')
const { value: lastname, errorMessage: lastnameError } = useField<string>('lastname')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: province, errorMessage: provinceError } = useField<string>('province')
const { value: profileImageUrl } = useField<string>('profileImageUrl')

// Disable submit button while form contains active errors or is saving/disabled
const isSubmitDisabled = computed(() => {
  return (
    props.disabled ||
    props.isSaving ||
    Object.keys(errors.value).length > 0 ||
    !meta.value.valid
  )
})

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

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      setValues({
        firstname: newData.firstname || '',
        lastname: newData.lastname || '',
        email: newData.email || '',
        province: newData.province || '',
        profileImageUrl: newData.profileImageUrl || '',
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  emit('submit-form', {
    firstname: values.firstname.trim(),
    lastname: values.lastname.trim(),
    email: values.email.trim(),
    province: values.province.trim(),
    profileImageUrl: values.profileImageUrl || '',
  })
})

function handleCancel() {
  if (props.initialData) {
    setValues({
      firstname: props.initialData.firstname || '',
      lastname: props.initialData.lastname || '',
      email: props.initialData.email || '',
      province: props.initialData.province || '',
      profileImageUrl: props.initialData.profileImageUrl || '',
    })
  } else {
    resetForm()
  }
  emit('cancel')
}
</script>
