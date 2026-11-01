<template>
  <AdminPageLayout title="Edit Level Criteria" main-padding="!max-w-[960px] px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full flex flex-col gap-6 -mt-3">
      <!-- Top Action Bar: Back Link & Breadcrumb Indicator -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <BackLink
          to="/admin/levels"
          label="← Back to Criteria of Levels"
          custom-class="text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
        />
        <div class="flex items-center gap-2 shrink-0">
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-xs select-none shrink-0 whitespace-nowrap',
              getLevelClasses(levelNumber),
            ]"
          >
            Level {{ levelNumber }}: {{ levelData?.name || getLevelName(levelNumber) }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-16 border border-white/20 flex flex-col items-center justify-center gap-3 text-white shadow-xl"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/80">Loading level configuration...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-8 sm:p-10 text-center text-sm shadow-xl flex flex-col items-center justify-center"
      >
        <p class="font-bold text-base sm:text-lg text-white">{{ error }}</p>
        <p class="text-xs sm:text-sm text-rose-300 mt-1.5">Unable to retrieve level data from the backend server.</p>
        <div class="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            class="px-6 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md cursor-pointer active:scale-95 min-w-[130px] inline-flex items-center justify-center"
            @click="fetchLevel"
          >
            Try Again
          </button>
          <RouterLink
            to="/admin/levels"
            class="px-6 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20 shadow-md inline-flex items-center justify-center"
          >
            Back to Levels
          </RouterLink>
        </div>
      </div>

      <!-- Form Card Scaffold -->
      <form
        v-else
        novalidate
        class="bg-white/[0.08] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 shadow-xl text-white flex flex-col gap-6"
        @submit.prevent="handleSave"
      >
        <!-- Level Header Profile -->
        <div class="flex items-center gap-4 pb-5 border-b border-white/10">
          <div
            :class="[
              'size-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-md',
              getLevelTheme(levelNumber).badgeContainer,
            ]"
          >
            <img
              v-if="levelData?.badgeImageUrl || levelData?.badge?.imageUrl"
              :src="levelData.badgeImageUrl || levelData.badge?.imageUrl"
              :alt="levelData.name"
              class="size-14 rounded-2xl object-cover"
            />
            <template v-else>
              <svg v-if="levelNumber === 1" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
              </svg>
              <svg v-else-if="levelNumber === 2" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="5" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <svg v-else-if="levelNumber === 3" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <svg v-else class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18h18M4 15l2.5-9 5.5 5 5.5-5L20 15H4z" />
              </svg>
            </template>
          </div>

          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
              {{ levelData?.name || getLevelName(levelNumber) }} Tier Configuration
            </h2>
            <p class="text-xs text-white/70 mt-0.5">
              Update pass criteria thresholds, campus benefits, and student services for Level {{ levelNumber }}.
            </p>
          </div>
        </div>

        <!-- Section 1: Pass Criteria Threshold -->
        <div class="flex flex-col gap-2">
          <label for="passCriteriaInput" class="text-xs sm:text-sm font-semibold tracking-wide text-white">
            Pass Criteria (Passing Score Threshold)
            <span class="text-rose-400 ml-0.5">*</span>
          </label>
          <div class="flex items-center gap-3 mt-1">
            <div class="relative w-36 sm:w-44">
              <input
                id="passCriteriaInput"
                v-model.number="form.passCriteria"
                type="number"
                min="1"
                max="5"
                step="1"
                placeholder="e.g. 4"
                :class="[
                  'w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white/10 text-white placeholder-white/40 font-semibold focus:outline-hidden transition-colors',
                  errors.passCriteria ? 'border-rose-400 ring-1 ring-rose-400/50' : 'border-white/20 focus:border-white/40',
                ]"
                @input="errors.passCriteria = ''"
              />
            </div>
            <span class="text-xs sm:text-sm font-semibold text-white/80 select-none">
              / 5 questions correct
            </span>
          </div>
          <p v-if="errors.passCriteria" class="text-xs text-rose-300 font-medium mt-0.5">
            {{ errors.passCriteria }}
          </p>
        </div>

        <!-- Section 2: Benefits Array (FE-ADMIN-20 Integration) -->
        <div class="pt-2">
          <DynamicTagListInput
            v-model="form.benefits"
            label="Campus Benefits & Privileges"
            placeholder="Type a new benefit and press Enter..."
            theme="dark"
            required
            @update:model-value="errors.benefits = ''"
          />
          <p v-if="errors.benefits" class="text-xs text-rose-300 font-medium mt-1">
            {{ errors.benefits }}
          </p>
        </div>

        <!-- Section 3: Services Array (FE-ADMIN-20 Integration) -->
        <div class="pt-2">
          <DynamicTagListInput
            v-model="form.services"
            label="Available Student Services"
            placeholder="Type a new service name and press Enter..."
            theme="dark"
          />
        </div>

        <!-- Form Actions Footer -->
        <div class="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
          <button
            type="button"
            :disabled="isSaving"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer disabled:opacity-50"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving" class="size-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import * as yup from 'yup'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import BackLink from '@/shared/components/BackLink.vue'
import Toast from '@/shared/components/Toast.vue'
import DynamicTagListInput from '@/components/admin/DynamicTagListInput.vue'
import AdminLevelService from '@/services/AdminLevelService'
import type { LevelAdmin } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { showToast, toastMessage, triggerToast } = useToast()

const levelNumber = computed<number>(() => {
  const param = route.params.levelNumber || route.params.id
  return Number(param) || 1
})

const levelData = ref<LevelAdmin | null>(null)
const loading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  passCriteria: 4,
  benefits: [] as string[],
  services: [] as string[],
})

const errors = reactive({
  passCriteria: '',
  benefits: '',
})

// Validation Schema per Criteria #21
const levelEditSchema = yup.object({
  passCriteria: yup
    .number()
    .typeError('Pass criteria must be a valid number.')
    .required('Pass criteria is required.')
    .integer('Pass criteria must be a whole integer.')
    .min(1, 'Pass criteria must be at least 1.')
    .max(5, 'Pass criteria cannot exceed 5 questions.'),
  benefits: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one campus benefit item is required.'),
})

function getLevelTheme(lvl: number) {
  switch (lvl) {
    case 1:
      return { badgeContainer: 'bg-[#C1D7AE]/20 border-[#C1D7AE]/40 text-[#C1D7AE]' }
    case 2:
      return { badgeContainer: 'bg-[#F2D794]/20 border-[#F2D794]/40 text-[#F2D794]' }
    case 3:
      return { badgeContainer: 'bg-[#E5A88B]/20 border-[#E5A88B]/40 text-[#E5A88B]' }
    case 4:
      return { badgeContainer: 'bg-[#DD898E]/20 border-[#DD898E]/40 text-[#DD898E]' }
    default:
      return { badgeContainer: 'bg-white/10 border-white/20 text-white' }
  }
}

function normalizeStringList(items: unknown[] | undefined): string[] {
  if (!items || !Array.isArray(items)) return []
  return items.map((item) => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>
      return (obj.description || obj.name || JSON.stringify(item)) as string
    }
    return String(item)
  })
}

async function fetchLevel() {
  const num = levelNumber.value
  if (!num || Number.isNaN(num) || num < 1 || num > 4) {
    error.value = `Invalid level number (${route.params.levelNumber || route.params.id}). Must be between 1 and 4.`
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await AdminLevelService.getLevel(num)
    levelData.value = response.data
    form.passCriteria = response.data.passCriteria ?? (num === 4 ? 5 : 4)
    form.benefits = normalizeStringList(response.data.benefits)
    form.services = normalizeStringList(response.data.services)
  } catch (err: unknown) {
    console.error(`Failed to fetch level ${num}:`, err)
    if (axios.isAxiosError(err)) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Failed to load criteria for Level ${num}. Please check your connection or session and try again.`
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = `Failed to load criteria for Level ${num}.`
    }
  } finally {
    loading.value = false
  }
}

async function validateForm(): Promise<boolean> {
  errors.passCriteria = ''
  errors.benefits = ''

  try {
    await levelEditSchema.validate(form, { abortEarly: false })
    return true
  } catch (err: unknown) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((validationErr) => {
        if (validationErr.path === 'passCriteria') {
          errors.passCriteria = validationErr.message
        }
        if (validationErr.path === 'benefits') {
          errors.benefits = validationErr.message
        }
      })
    }
    return false
  }
}

async function handleSave() {
  const isValid = await validateForm()
  if (!isValid) return

  isSaving.value = true
  const num = levelNumber.value

  const payload: Partial<LevelAdmin> = {
    levelNumber: num,
    name: levelData.value?.name || getLevelName(num),
    passCriteria: form.passCriteria,
    benefits: form.benefits,
    services: form.services,
  }

  try {
    await AdminLevelService.updateLevel(num, payload)
    await triggerToast(`Level ${num} criteria updated successfully.`)
    setTimeout(() => {
      router.push('/admin/levels')
    }, 600)
  } catch (err: unknown) {
    console.error(`Failed to update level ${num}:`, err)
    let errorMessage = `Failed to update Level ${num} criteria. Please try again.`
    if (axios.isAxiosError(err)) {
      errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        errorMessage
    } else if (err instanceof Error) {
      errorMessage = err.message
    }
    await triggerToast(errorMessage)
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  router.push('/admin/levels')
}

onMounted(() => {
  fetchLevel()
})
</script>
