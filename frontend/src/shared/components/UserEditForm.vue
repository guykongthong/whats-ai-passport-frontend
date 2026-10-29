<template>
  <form
    :class="[
      'rounded-2xl p-6 sm:p-7 border space-y-5 transition-colors',
      theme === 'dark'
        ? 'bg-white/10 border-white/15 text-white'
        : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
    ]"
    @submit.prevent="handleSubmit"
  >
    <!-- First Name & Last Name Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          :class="[
            'block text-xs font-semibold mb-1.5',
            theme === 'dark' ? 'text-white/80' : 'text-slate-700'
          ]"
        >
          First Name <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.firstname"
          type="text"
          required
          placeholder="First name"
          :class="[
            'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2',
            theme === 'dark'
              ? 'bg-white/15 border border-white/20 text-white placeholder-white/40 focus:ring-white/50 focus:bg-white/20'
              : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-indigo-500/30 focus:border-indigo-600'
          ]"
        />
        <p v-if="errors.firstname" class="mt-1 text-xs text-rose-400 font-medium">
          {{ errors.firstname }}
        </p>
      </div>

      <div>
        <label
          :class="[
            'block text-xs font-semibold mb-1.5',
            theme === 'dark' ? 'text-white/80' : 'text-slate-700'
          ]"
        >
          Last Name <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.lastname"
          type="text"
          required
          placeholder="Last name"
          :class="[
            'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2',
            theme === 'dark'
              ? 'bg-white/15 border border-white/20 text-white placeholder-white/40 focus:ring-white/50 focus:bg-white/20'
              : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-indigo-500/30 focus:border-indigo-600'
          ]"
        />
        <p v-if="errors.lastname" class="mt-1 text-xs text-rose-400 font-medium">
          {{ errors.lastname }}
        </p>
      </div>
    </div>

    <!-- Email Address -->
    <div>
      <label
        :class="[
          'block text-xs font-semibold mb-1.5',
          theme === 'dark' ? 'text-white/80' : 'text-slate-700'
        ]"
      >
        Email Address <span class="text-rose-500">*</span>
      </label>
      <input
        v-model="form.email"
        type="email"
        required
        placeholder="you@domain.com"
        :disabled="disableEmail"
        :class="[
          'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2',
          disableEmail ? 'opacity-60 cursor-not-allowed' : '',
          theme === 'dark'
            ? 'bg-white/15 border border-white/20 text-white placeholder-white/40 focus:ring-white/50 focus:bg-white/20'
            : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-indigo-500/30 focus:border-indigo-600'
        ]"
      />
      <p v-if="errors.email" class="mt-1 text-xs text-rose-400 font-medium">
        {{ errors.email }}
      </p>
    </div>

    <!-- Province Selector -->
    <div>
      <label
        :class="[
          'block text-xs font-semibold mb-1.5',
          theme === 'dark' ? 'text-white/80' : 'text-slate-700'
        ]"
      >
        Province <span class="text-rose-500">*</span>
      </label>
      <select
        v-model="form.province"
        required
        :class="[
          'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 cursor-pointer',
          theme === 'dark'
            ? 'bg-white/15 border border-white/20 text-white focus:ring-white/50'
            : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-indigo-500/30 focus:border-indigo-600'
        ]"
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
      <p v-if="errors.province" class="mt-1 text-xs text-rose-400 font-medium">
        {{ errors.province }}
      </p>
    </div>

    <!-- Actions Bar -->
    <div
      :class="[
        'pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t',
        theme === 'dark' ? 'border-white/15' : 'border-slate-100'
      ]"
    >
      <button
        type="button"
        :class="[
          'w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer',
          theme === 'dark'
            ? 'border border-white/30 text-white hover:bg-white/10'
            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
        ]"
        @click="handleCancel"
      >
        Cancel
      </button>

      <button
        type="submit"
        :disabled="isSaving"
        :class="[
          'w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50',
          theme === 'dark'
            ? 'bg-white text-slate-900 hover:bg-white/90'
            : 'bg-[#00385A] text-white hover:bg-[#002a43]'
        ]"
      >
        <span
          v-if="isSaving"
          :class="[
            'size-3.5 rounded-full border-2 border-t-transparent animate-spin',
            theme === 'dark' ? 'border-slate-900' : 'border-white'
          ]"
        />
        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface UserEditFormData {
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl?: string
}

const props = withDefaults(
  defineProps<{
    initialData?: Partial<UserEditFormData & { name?: string; surname?: string }>
    isSaving?: boolean
    theme?: 'light' | 'dark'
    disableEmail?: boolean
  }>(),
  {
    initialData: () => ({}),
    isSaving: false,
    theme: 'light',
    disableEmail: false,
  },
)

const emit = defineEmits<{
  (e: 'submit-form', data: UserEditFormData): void
  (e: 'cancel'): void
}>()

const form = reactive<UserEditFormData>({
  firstname: '',
  lastname: '',
  email: '',
  province: '',
  profileImageUrl: '',
})

const errors = reactive<Record<string, string>>({})

function populateForm() {
  if (props.initialData) {
    form.firstname =
      props.initialData.firstname ?? props.initialData.name ?? ''
    form.lastname =
      props.initialData.lastname ?? props.initialData.surname ?? ''
    form.email = props.initialData.email ?? ''
    form.province = props.initialData.province ?? ''
    form.profileImageUrl = props.initialData.profileImageUrl ?? ''
  }
}

watch(
  () => props.initialData,
  () => {
    populateForm()
  },
  { immediate: true, deep: true },
)

function validate(): boolean {
  errors.firstname = ''
  errors.lastname = ''
  errors.email = ''
  errors.province = ''

  let isValid = true

  if (!form.firstname.trim()) {
    errors.firstname = 'First name is required.'
    isValid = false
  }

  if (!form.lastname.trim()) {
    errors.lastname = 'Last name is required.'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please provide a valid email address.'
    isValid = false
  }

  if (!form.province) {
    errors.province = 'Please select a province.'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return

  emit('submit-form', {
    firstname: form.firstname.trim(),
    lastname: form.lastname.trim(),
    email: form.email.trim(),
    province: form.province,
    profileImageUrl: form.profileImageUrl,
  })
}

function handleCancel() {
  populateForm()
  errors.firstname = ''
  errors.lastname = ''
  errors.email = ''
  errors.province = ''
  emit('cancel')
}

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
</script>
