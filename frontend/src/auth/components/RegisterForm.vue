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

    <!-- Step 1: Profile information -->
    <form v-if="currentStep === 1" class="flex flex-col gap-6 pt-6" @submit.prevent="goNext">
      <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <BaseInput
          v-model="firstname"
          label="First name"
          placeholder="Enter your first name"
          :error-message="errors.firstname"
          required
        />
        <BaseInput
          v-model="lastname"
          label="Last name"
          placeholder="Enter your last name"
          :error-message="errors.lastname"
          required
        />
      </div>

      <BaseInput
        v-model="username"
        label="Username"
        placeholder="Enter your username"
        :error-message="errors.username"
        required
      />

      <!-- Province dropdown -->
      <div class="flex flex-col gap-1">
        <label for="register-province" class="text-sm font-semibold text-button-primary">
          Province <RequiredField />
        </label>
        <select
          id="register-province"
          v-model="province"
          class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-button-primary"
          :class="province === '' ? 'text-gray-400' : 'text-gray-900'"
        >
          <option value="" disabled>Select your province</option>
          <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        </select>
        <ErrorMessage :message="errors.province" />
      </div>

      <!-- Profile Picture Upload -->
      <ImageUpload
        v-model="profileImageUrl"
        label="Profile image"
        :error-message="errors.profileImageUrl"
        required
      />

      <BaseButton type="submit" variant="primary" class="mt-6 w-full py-3 text-base">
        Next →
      </BaseButton>
    </form>

    <!-- Step 2: Account credentials -->
    <form v-else-if="currentStep === 2" class="flex flex-col gap-6 pt-6" @submit.prevent="onSubmit">
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="you@gmail.com"
        :error-message="errors.email"
        required
      />

      <!-- Password with show/hide toggle -->
      <div class="flex flex-col gap-1">
        <label for="register-password" class="text-sm font-semibold text-button-primary">
          Create your own password <RequiredField />
        </label>
        <div class="relative">
          <input
            id="register-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="At least 6 characters"
            class="w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            @click="showPassword = !showPassword"
          >
            <!-- Eye-slash (password hidden) -->
            <EyeOffIcon v-if="!showPassword" />
            <!-- Eye (password visible) -->
            <EyeIcon v-else />
          </button>
        </div>
        <ErrorMessage :message="errors.password" />
      </div>

      <!-- Verify password with show/hide toggle -->
      <div class="flex flex-col gap-1">
        <label for="register-confirm-password" class="text-sm font-semibold text-button-primary">
          Verify password <RequiredField />
        </label>
        <div class="relative">
          <input
            id="register-confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Re-enter your password"
            class="w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
          <button
            type="button"
            aria-label="Toggle confirm password visibility"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <!-- Eye-slash (password hidden) -->
            <EyeOffIcon v-if="!showConfirmPassword" />
            <!-- Eye (password visible) -->
            <EyeIcon v-else />
          </button>
        </div>
        <ErrorMessage :message="errors.confirmPassword" />
      </div>

      <div class="mt-2 flex gap-4">
        <BaseButton type="button" variant="secondary" class="flex-1" @click="goBack">
          ← Back
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          class="flex-1"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Registering...' : 'Register' }}
        </BaseButton>
      </div>
    </form>

    <!-- Step 3: Confirmation -->
    <div v-else class="flex flex-col items-center gap-6">
      <p class="text-center text-sm text-gray-600">
        Registration completed successfully! Your account is ready.
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
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { registerSchema, step1Schema, type RegisterFormValues } from '@/auth/schemas/registerSchema'
import type { RegisterPayload } from '@/types'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import StepIndicator from '@/shared/components/StepIndicator.vue'
import BackLink from '@/shared/components/BackLink.vue'
import EyeIcon from '@/shared/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/shared/components/icons/EyeOffIcon.vue'
import EmailVerificationIllustration from '@/shared/components/icons/EmailVerificationIllustration.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import RequiredField from '@/shared/components/RequiredField.vue'
import AlertBox from '@/shared/components/AlertBox.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'

interface Props {
  registerError?: string
  isSubmitting?: boolean
  submitHandler?: (payload: RegisterPayload) => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  registerError: '',
  isSubmitting: false,
})

const emit = defineEmits<{
  'submit-register': [
    payload: RegisterPayload,
    callback?: (err?: unknown) => void,
  ]
}>()

const currentStep = ref(1)

watch(
  () => props.registerError,
  (msg) => {
    if (msg) {
      alertMessage.value = msg
      alertVariant.value = 'error'
    }
  }
)

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
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')

const { errors, defineField, handleSubmit, validate, setErrors } = useForm<RegisterFormValues>({
  validationSchema: computed(() =>
    toTypedSchema(currentStep.value === 1 ? step1Schema : registerSchema)
  ),
  initialValues: {
    firstname: '',
    lastname: '',
    username: '',
    province: '',
    profileImageUrl: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const [firstname] = defineField('firstname')
const [lastname] = defineField('lastname')
const [username] = defineField('username')
const [province] = defineField('province')
const [profileImageUrl] = defineField('profileImageUrl')
const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('confirmPassword')

async function goNext() {
  if (currentStep.value === 1) {
    const result = await validate()
    if (!result.valid) {
      alertMessage.value = 'Please fill in all required fields and upload a profile picture.'
      alertVariant.value = 'error'
      return
    }
    alertMessage.value = ''
    currentStep.value = 2
  }
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value -= 1
    alertMessage.value = ''
    setErrors({})
  }
}

const onSubmit = handleSubmit(
  async (formValues) => {
    alertMessage.value = ''
    const payload: RegisterPayload = {
      username: formValues.username,
      password: formValues.password,
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      email: formValues.email,
      province: formValues.province,
      profileImageUrl: formValues.profileImageUrl,
    }

    try {
      if (props.submitHandler) {
        await props.submitHandler(payload)
      } else {
        await new Promise<void>((resolve, reject) => {
          emit('submit-register', payload, (err?: unknown) => {
            if (err) {
              reject(err instanceof Error ? err : new Error(String(err)))
            } else {
              resolve()
            }
          })
        })
      }
      currentStep.value = 3
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (props.registerError || 'Registration failed.')
      alertMessage.value = message
      alertVariant.value = 'error'
    }
  },
  () => {
    alertMessage.value = 'Please fill in all required fields.'
    alertVariant.value = 'error'
  }
)
</script>
