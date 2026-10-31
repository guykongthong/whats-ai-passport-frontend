<template>
  <AdminPageLayout title="Edit Level Criteria" main-padding="!max-w-[960px] px-4 sm:px-8">
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
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-8 text-center text-sm shadow-xl"
      >
        <p class="font-semibold text-base">{{ error }}</p>
        <p class="text-xs text-rose-300 mt-1">Unable to retrieve level data from the backend server.</p>
        <div class="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            class="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
            @click="fetchLevel"
          >
            Try Again
          </button>
          <RouterLink
            to="/admin/levels"
            class="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/15"
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
        @submit.prevent
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
              v-if="levelData?.badgeImageUrl"
              :src="levelData.badgeImageUrl"
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
                v-model.number="passCriteria"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 4"
                class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 font-semibold focus:outline-hidden"
              />
            </div>
            <span class="text-xs sm:text-sm font-semibold text-white/80 select-none">
              / 5 questions correct
            </span>
          </div>
        </div>

        <!-- Form Actions Footer -->
        <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
          <button
            type="button"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-md transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import BackLink from '@/shared/components/BackLink.vue'
import AdminLevelService from '@/services/AdminLevelService'
import type { LevelAdmin } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const route = useRoute()
const router = useRouter()

const levelNumber = computed<number>(() => {
  const param = route.params.levelNumber || route.params.id
  return Number(param) || 1
})

const levelData = ref<LevelAdmin | null>(null)
const passCriteria = ref(1)
const loading = ref(true)
const error = ref<string | null>(null)

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
    passCriteria.value = response.data.passCriteria ?? 1
  } catch (err: unknown) {
    console.error('Failed to load level details from backend:', err)
    error.value = 'Failed to load level criteria. Please check your network connection or login session.'
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/admin/levels')
}

onMounted(() => {
  fetchLevel()
})
</script>
