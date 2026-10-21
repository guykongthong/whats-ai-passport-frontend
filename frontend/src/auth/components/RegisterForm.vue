<template>
  <div class="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-10 shadow-md">
    <h1 class="mb-12 text-center text-3xl font-extrabold text-button-primary pb-3">
      Sign up
    </h1>

    <StepIndicator :current-step="currentStep" :total-steps="3" class="mb-10 pb-5 pt-3" />

    <AlertBox 
      v-if="alertMessage" 
      :variant="alertVariant" 
      :message="alertMessage" 
      class="mb-6" 
    />

    <!-- Step 1: Name fields -->
    <form v-if="currentStep === 1" class="flex flex-col gap-6 pt-6" @submit.prevent="goNext">
      <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.nameTh"
            label="ชื่อ (ภาษาไทย)"
            placeholder="กรอกชื่อของคุณ"
            :error-message="error.nameTh"
            required
          />
          <BaseInput
            v-model="form.surnameTh"
            label="นามสกุล (ภาษาไทย)"
            placeholder="กรอกนามสกุลของคุณ"
            :error-message="error.surnameTh"
            required
          />
          <BaseInput
            v-model="form.nameEn"
            label="Name (English)"
            placeholder="Enter your first name"
            :error-message="error.nameEn"
            required
          />
          <BaseInput
            v-model="form.surnameEn"
            label="Surname (English)"
            placeholder="Enter your surname"
            :error-message="error.surnameEn"
            required
          />
      </div>

      <!-- Province dropdown -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-button-primary">
          Province <RequiredField/>
        </label>
        <select
          v-model="form.province"
          class="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          :class="form.province === '' ? 'text-gray-400' : 'text-gray-900'"
        >
        <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        <option value="" disabled>Select your province</option>
      </select>
      <ErrorMessage :message="error.province"/>
      </div>

      <BaseButton type="submit" variant="primary" class="mt-6 w-full py-3 text-base">Next →</BaseButton>
    </form>

    <!-- Step 2: Email & Password -->
    <form v-else-if="currentStep === 2" class="flex flex-col gap-6 pt-6" @submit.prevent="goNext">
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@gmail.com"
        :error-message="error.email"
        required
      />

      <!-- Password with show/hide toggle -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-button-primary">
          Create your own password <RequiredField/>
        </label>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
          <ErrorMessage :message="error.password"/>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            @click="showPassword = !showPassword"
          >
            <!-- Eye-slash (password hidden) -->
            <EyeOffIcon v-if="!showPassword" />
            <!-- Eye (password visible) -->
            <EyeIcon v-else />
          </button>
        </div>
      </div>

      <!-- Verify password with show/hide toggle -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold text-button-primary">
          Verify password <RequiredField/>
        </label>
        <div class="relative">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
          <ErrorMessage :message="error.confirmPassword"/>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <EyeOffIcon v-if="!showConfirmPassword" />
            <EyeIcon v-else />
          </button>
        </div>
      </div>

      <!-- Password mismatch error -->
      <p v-if="passwordError" class="-mt-2 text-sm text-red-500">{{ passwordError }}</p>

      <div class="mt-2 flex gap-4">
        <BaseButton type="button" variant="secondary" class="flex-1" @click="goBack">
          ← Back
        </BaseButton>
        <BaseButton type="submit" variant="primary" class="flex-1">Next →</BaseButton>
      </div>
    </form>

    <!-- Step 3: Email verification confirmation -->
    <div v-else class="flex flex-col items-center gap-6">
      <p class="text-center text-sm text-gray-600">
        Please check and verify your email address
      </p>

      <div class="flex w-full items-center justify-center rounded-xl bg-gray-50 py-10">
        <EmailVerificationIllustration />
      </div>

      <BackLink
        to="/login"
        label="Back to Login"
        customClass="text-sm font-semibold text-button-primary underline underline-offset-2"
      />
    </div>

    <!-- "already have an account" — step 1 only -->
    <p v-if="currentStep === 1" class="mt-10 text-center text-sm text-gray-500">
      already have an account?
      <RouterLink
        to="/login"
        class="font-semibold text-button-primary underline underline-offset-2"
      >
        Log in
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import StepIndicator from '@/shared/components/StepIndicator.vue'
import BackLink from '@/shared/components/BackLink.vue'
import EyeIcon from '@/shared/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/shared/components/icons/EyeOffIcon.vue'
import EmailVerificationIllustration from '@/shared/components/icons/EmailVerificationIllustration.vue'
import { validateRequired } from '@/shared/utils/validation'
import type { FieldErrors } from '@/types/FieldErrors'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import RequiredField from '@/shared/components/RequiredField.vue'
import AlertBox from '@/shared/components/AlertBox.vue'

const emit = defineEmits<{
  'submit-register': [
    nameTh: string,
    surnameTh: string,
    nameEn: string,
    surnameEn: string,
    province: string,
    email: string,
    password: string,
  ]
}>()

const currentStep = ref(1)

const form = reactive({
  nameTh: '',
  surnameTh: '',
  nameEn: '',
  surnameEn: '',
  province: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const provinces = [
  'Amnat Charoen', 'Ang Thong', 'Bangkok', 'Bueng Kan', 'Buriram',
  'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Chanthaburi', 'Chiang Mai',
  'Chiang Rai', 'Chonburi', 'Chumphon', 'Kalasin', 'Kamphaeng Phet',
  'Kanchanaburi', 'Khon Kaen', 'Krabi', 'Lampang', 'Lamphun',
  'Loei', 'Lopburi', 'Mae Hong Son', 'Maha Sarakham', 'Mukdahan',
  'Nakhon Nayok', 'Nakhon Pathom', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan',
  'Nakhon Si Thammarat', 'Nan', 'Narathiwat', 'Nong Bua Lamphu', 'Nong Khai',
  'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phang Nga', 'Phatthalung',
  'Phayao', 'Phetchabun', 'Phetchaburi', 'Phichit', 'Phitsanulok',
  'Phra Nakhon Si Ayutthaya', 'Phrae', 'Phuket', 'Prachinburi', 'Prachuap Khiri Khan',
  'Ranong', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo',
  'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 'Saraburi',
  'Satun', 'Sing Buri', 'Sisaket', 'Songkhla', 'Sukhothai',
  'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 'Trang',
  'Trat', 'Ubon Ratchathani', 'Udon Thani', 'Uthai Thani', 'Uttaradit',
  'Yala', 'Yasothon',
]

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const error = ref<FieldErrors>({})
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')

function goNext() {
  if (currentStep.value === 1) {
    const stepErrors = validateRequired({ nameTh: form.nameTh, surnameTh: form.surnameTh, nameEn: form.nameEn, surnameEn: form.surnameEn, province: form.province })
    error.value = stepErrors
        if (Object.keys(stepErrors).length > 0) {
          alertMessage.value = 'Please fill in all required fields.'
          alertVariant.value = 'error'
          return
        }
        alertMessage.value = ''
        currentStep.value = 2
  } else if (currentStep.value === 2) {
    const stepErrors = validateRequired({ email: form.email, password: form.password, confirmPassword: form.confirmPassword })
    error.value = stepErrors
        if (Object.keys(stepErrors).length > 0) {
          alertMessage.value = 'Please fill in all required fields.'
          alertVariant.value = 'error'
          return
        }
        alertMessage.value = ''
    if (form.password !== form.confirmPassword) {
      passwordError.value = 'Passwords do not match'
      alertMessage.value = 'Passwords do not match.'
      alertVariant.value = 'error'
    } else {
      passwordError.value = ''
      alertMessage.value = ''
    emit(
      'submit-register',
      form.nameTh,
      form.surnameTh,
      form.nameEn,
      form.surnameEn,
      form.province,
      form.email,
      form.password,
    )
    currentStep.value = 3
    }
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value -= 1
    alertMessage.value = ''
  }
}
</script>
