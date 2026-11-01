<script setup lang="ts">
import { ref, watch } from 'vue'
import EyeIcon from '@/shared/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/shared/components/icons/EyeOffIcon.vue'
import { validateRequired } from '@/shared/utils/validation'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import PageTitle from '@/shared/components/PageTitle.vue'
import RequiredField from '@/shared/components/RequiredField.vue'
import AlertBox from '@/shared/components/AlertBox.vue'

const props = defineProps<{
  loginError?: string
}>()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref<Record<string,string>>({})
const alertMessage = ref('')
const alertVariant = ref<'error' | 'warning' | 'info' | 'success'>('error')
const emit = defineEmits<{
  (e: 'submit-login', username: string, password: string): void
  (e: 'no-account'): void
}>()

watch(() => props.loginError, (message) => {
  if (message) {
    error.value = { ...error.value, email: message }
  }
})

watch(email, () => {
  if (error.value.email) {
    error.value = { ...error.value, email: '' }
  }
})

const handleLogin = () => {
  const loginError = validateRequired({email: email.value, password: password.value})
  error.value = loginError
  if (Object.keys(loginError).length === 0) {
    alertMessage.value = ''
    emit('submit-login', email.value, password.value)
  } else {
    alertMessage.value = 'Please fill in all required fields.'
    alertVariant.value = 'error'
  }
}

const handleNoAccount = () => {
  emit('no-account')
}

</script>

<template>
  <div class="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-8 pt-10 pb-16 sm:px-10 sm:pt-12 sm:pb-40 w-full max-w-[440px] mx-auto text-center border border-gray-100">
    <PageTitle class="!text-[60px] !font-black text-[#01172e] mb-6 tracking-tight" style="-webkit-text-stroke: 2px currentColor;">Log in</PageTitle>
    <p class="text-[16px] text-[#4F6C83] mb-12 mx-auto leading-relaxed text-center">
      Access your AI Passport Institutional Account.
    </p>

    <AlertBox 
      v-if="alertMessage" 
      :variant="alertVariant" 
      :message="alertMessage" 
      class="mb-6 text-left" 
    />

    <form @submit.prevent="handleLogin" class="text-left space-y-10 pt-4">
      <div class="mt-4">
        <label for="email" class="block text-[#01172e] text-[17px] font-black mb-3" style="-webkit-text-stroke: 1px currentColor;">
          username <RequiredField/>
        </label>
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="user1"
          class="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
        />
        <ErrorMessage :message="error.email"/>
      </div>

      <div class="mt-10">
        <label for="password" class="block text-[#01172e] space-y-10 pt-4 text-[17px] font-black mb-3" style="-webkit-text-stroke: 1px currentColor;">
          password <RequiredField/>
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-button-primary"
          />
          <ErrorMessage :message="error.password"/>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-[#4F6C83] hover:text-primary-dark focus:outline-none"
          >
            <EyeOffIcon v-if="!showPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="text-left mt-6">
        <a href="#" class="text-[#4F6C83] hover:text-primary-dark transition-colors text-[15px] font-medium underline underline-offset-4 decoration-[#4F6C83]/50">
          forgot your password?
        </a>
      </div>

      <button
        type="submit"
        class="w-full bg-[#00385e] hover:bg-[#01172e] text-white font-black text-[17px] py-3.5 px-4 rounded-lg transition-colors mt-12"
        style="-webkit-text-stroke: 1px currentColor;"
      >
        Log in
      </button>
    </form>

    <div class="mt-12 text-[15px] text-[#4F6C83] mb-4">
      Don't have an account? 
      <a href="#" @click="handleNoAccount" class="text-[#01172e] font-black hover:underline" style="-webkit-text-stroke: 0.5px currentColor;">
        Sign up
      </a>
    </div>
  </div>
</template>
