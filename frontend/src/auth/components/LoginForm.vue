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
  <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-6 py-8 sm:px-10 sm:py-10 w-full max-w-[440px] mx-auto text-center border border-gray-100 my-auto">
    <PageTitle class="!text-4xl sm:!text-5xl !font-black text-[#01172e] mb-2 tracking-tight" style="-webkit-text-stroke: 1.5px currentColor;">Log in</PageTitle>
    <p class="text-sm sm:text-base text-[#4F6C83] mb-6 sm:mb-8 mx-auto leading-relaxed text-center">
      Access your AI Passport Institutional Account.
    </p>

    <AlertBox 
      v-if="alertMessage" 
      :variant="alertVariant" 
      :message="alertMessage" 
      class="mb-6 text-left" 
    />

    <form @submit.prevent="handleLogin" class="text-left flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <label for="email" class="text-[#01172e] text-sm sm:text-[15px] font-bold" style="-webkit-text-stroke: 0.5px currentColor;">
          Username <RequiredField/>
        </label>
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="user1"
          class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00385e]/20 focus:border-[#00385e] transition-all"
        />
        <ErrorMessage :message="error.email"/>
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="text-[#01172e] text-sm sm:text-[15px] font-bold" style="-webkit-text-stroke: 0.5px currentColor;">
          Password <RequiredField/>
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00385e]/20 focus:border-[#00385e] transition-all"
          />
          <ErrorMessage :message="error.password"/>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4F6C83] hover:text-primary-dark focus:outline-none cursor-pointer"
          >
            <EyeOffIcon v-if="!showPassword" class="w-5 h-5" />
            <EyeIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs sm:text-sm">
        <a href="#" class="text-[#4F6C83] hover:text-[#00385e] transition-colors font-medium underline underline-offset-4 decoration-[#4F6C83]/50">
          Forgot your password?
        </a>
      </div>

      <button
        type="submit"
        class="w-full bg-[#00385e] hover:bg-[#01172e] text-white font-bold text-base py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] mt-2 cursor-pointer"
      >
        Log in
      </button>
    </form>

    <div class="mt-6 text-sm text-[#4F6C83]">
      Don't have an account? 
      <a href="#" @click.prevent="handleNoAccount" class="text-[#00385e] font-bold hover:underline cursor-pointer">
        Sign up
      </a>
    </div>
  </div>
</template>
