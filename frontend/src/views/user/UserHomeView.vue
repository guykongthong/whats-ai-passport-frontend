<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col items-center">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
        
        <!-- Hero Banner: Level, Progression, and Direct CTA -->
        <section
          aria-label="Current Passport Status"
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002d4f] via-[#00385e] to-[#1a4a6e] p-6 sm:p-8 lg:p-10 text-white shadow-lg"
        >
          <!-- Background Decorative Elements -->
          <div class="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-indigo-400/15 blur-2xl" />
          <div class="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-blue-400/10 blur-2xl" />

          <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1 max-w-2xl">
              <!-- Active Badge -->
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-xs ring-1 ring-white/15">
                <span class="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Passport Credential</span>
              </div>

              <!-- Main Level Heading -->
              <h1 class="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Level {{ currentLevel }} – <span class="text-[#F2D794]">{{ levelTitle }}</span>
              </h1>

              <p class="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed">
                {{ levelDescription }}
              </p>

              <!-- Progression Towards Next Level -->
              <div class="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/10">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span class="flex items-center gap-1.5">
                    <span>Overall Progression</span>
                    <span class="text-white font-bold">({{ progressPercentage }}%)</span>
                  </span>
                  <span v-if="nextLevelNumber" class="text-[#F2D794]">
                    Next: Level {{ nextLevelNumber }} – {{ nextLevelTitle }}
                  </span>
                  <span v-else class="text-amber-300 font-bold inline-flex items-center gap-1">
                    <TrophyIcon class="size-3.5" />
                    <span>Highest Level Achieved</span>
                  </span>
                </div>

                <!-- Progress Bar -->
                <div class="relative h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-[#F2D794] transition-all duration-700 ease-out"
                    :style="{ width: `${progressPercentage}%` }"
                    role="progressbar"
                    :aria-valuenow="progressPercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>

                <!-- Step Indicators -->
                <div class="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span
                    v-for="step in 4"
                    :key="step"
                    class="flex items-center gap-1"
                    :class="step <= currentLevel ? 'text-white font-bold' : 'text-slate-400'"
                  >
                    <span
                      class="size-1.5 rounded-full"
                      :class="step <= currentLevel ? 'bg-[#F2D794]' : 'bg-slate-500'"
                    />
                    L{{ step }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Direct CTA Button: Take Upgrade Exam -->
            <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <RouterLink
                to="/dashboard/exam"
                class="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#002845] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-[#001f36] hover:-translate-y-0.5 active:translate-y-0 transition-all border border-white/20"
              >
                <span>Take Upgrade Exam</span>
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </RouterLink>

              <RouterLink
                to="/dashboard/elearning"
                class="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors py-1"
              >
                <span>Prepare via eLearning &rarr;</span>
              </RouterLink>
            </div>
          </div>
        </section>

        <!-- Two-column Grid: Benefits Card & Services Card -->
        <section aria-label="Level Benefits and Services" class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          <!-- Benefits Card -->
          <div class="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs">
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-button-primary">
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-900">Active Benefits</h2>
                  <p class="text-xs text-slate-500">Unlocked perks for Level {{ currentLevel }}</p>
                </div>
              </div>
              <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-button-primary">
                {{ currentBenefits.length }} Perks
              </span>
            </div>

            <div class="flex-1 py-4">
              <ul v-if="currentBenefits.length > 0" class="flex flex-col gap-2.5">
                <li
                  v-for="(benefit, idx) in currentBenefits"
                  :key="idx"
                  class="flex items-start gap-3 rounded-xl p-3 bg-slate-50 border border-slate-100"
                >
                  <div class="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg class="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {{ benefit }}
                  </p>
                </li>
              </ul>
              <div v-else class="py-8 text-center text-sm text-slate-400">
                No active benefits found for this level.
              </div>
            </div>

            <div class="pt-3 border-t border-gray-100 text-[11px] text-slate-400">
              Benefits update automatically upon passing upgrade exams.
            </div>
          </div>

          <!-- Services Card -->
          <div class="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs">
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-900">Available Services</h2>
                  <p class="text-xs text-slate-500">Accessible facilities for your tier</p>
                </div>
              </div>
              <span class="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                {{ activeServices.length }} Services
              </span>
            </div>

            <div class="flex-1 py-4">
              <ul v-if="activeServices.length > 0" class="flex flex-col gap-2.5">
                <li
                  v-for="(service, idx) in activeServices"
                  :key="idx"
                  class="flex items-center justify-between gap-3 rounded-xl p-3 bg-slate-50 border border-slate-100"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="size-2 rounded-full bg-purple-500" />
                    <span class="text-xs sm:text-sm font-semibold text-slate-800">
                      {{ service.name }}
                    </span>
                  </div>
                  <span class="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                    Tier {{ service.level }}
                  </span>
                </li>
              </ul>
              <div v-else class="py-8 text-center text-sm text-slate-400">
                No services currently available.
              </div>
            </div>

            <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Campus resources provided by CAMT Passport</span>
              <RouterLink to="/dashboard/services" class="font-semibold text-purple-600 hover:underline">
                View all &rarr;
              </RouterLink>
            </div>
          </div>

        </section>

      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLevelStore } from '@/stores/levelStore'
import { useUserStore } from '@/stores/user'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelName } from '@/utils/levelDisplay'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'

const userStore = useUserStore()
const levelStore = useLevelStore()

// Computed getters directly bound to reactive Pinia userStore
const currentLevel = computed<number>(() => userStore.currentUserLevel)
const levelDetails = computed(() => userStore.currentLevelDetails)

const levelTitle = computed<string>(() => {
  if (levelDetails.value?.label && levelDetails.value.label.trim() !== '') {
    return levelDetails.value.label
  }
  return getLevelName(currentLevel.value)
})

const progressPercentage = computed<number>(() => {
  const lvl = Math.min(Math.max(currentLevel.value, 1), 4)
  return Math.round((lvl / 4) * 100)
})

const nextLevelNumber = computed<number | null>(() => {
  return currentLevel.value < 4 ? currentLevel.value + 1 : null
})

const nextLevelTitle = computed<string | null>(() => {
  return nextLevelNumber.value ? getLevelName(nextLevelNumber.value) : null
})

const levelDescription = computed<string>(() => {
  if (levelDetails.value?.description && levelDetails.value.description.trim() !== '') {
    return levelDetails.value.description
  }
  switch (currentLevel.value) {
    case 1:
      return 'Foundational credential covering essential digital skills, CAMT orientation, and entry-level privileges.'
    case 2:
      return 'Intermediate credential demonstrating applied technical proficiency, lab access, and specialized workshops.'
    case 3:
      return 'Advanced credential for innovative projects, GPU cluster access, incubation, and industry mentorship.'
    case 4:
      return 'Master credential recognizing top-tier academic, professional excellence and international competition support.'
    default:
      return 'Keep learning and pass upgrade examinations to unlock higher level privileges and resources.'
  }
})

const currentBenefits = computed<string[]>(() => {
  if (levelDetails.value?.benefits && levelDetails.value.benefits.length > 0) {
    return levelDetails.value.benefits
  }
  return levelStore.getBenefitsForLevel(String(currentLevel.value)).map((b) => b.description)
})

const activeServices = computed(() => {
  if (levelDetails.value?.services && levelDetails.value.services.length > 0) {
    return levelDetails.value.services.map((name) => {
      const match = levelStore.allServices.find((s) => s.name === name)
      return {
        name,
        level: match ? match.level : String(currentLevel.value),
      }
    })
  }
  return levelStore.allServices.filter((s) => Number(s.level) <= currentLevel.value)
})

onMounted(() => {
  if (!userStore.currentLevelDetails) {
    userStore.fetchLevelDetails()
  }
})
</script>
