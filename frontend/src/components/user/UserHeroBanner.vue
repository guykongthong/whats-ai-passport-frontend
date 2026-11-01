<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#131b31] to-[#1c2242] p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-800/80">
    <!-- Decorative background glow and accents -->
    <div class="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-indigo-500/15 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-purple-500/10 blur-3xl" />
    <div class="pointer-events-none absolute right-1/4 bottom-0 size-48 rounded-full bg-blue-500/10 blur-2xl" />

    <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <!-- Left Column: Level Info & Title -->
      <div class="flex-1 max-w-2xl">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md ring-1 ring-white/15">
          <span class="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Passport Credential</span>
        </div>

        <!-- Main Title: Level Number & Title -->
        <h1 class="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Level {{ currentLevel }} – <span class="bg-gradient-to-r from-indigo-200 via-white to-indigo-100 bg-clip-text text-transparent">{{ displayTitle }}</span>
        </h1>

        <!-- Subtitle / Description -->
        <p class="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
          {{ levelDescription }}
        </p>

        <!-- Progress Indicator toward next level -->
        <div class="mt-6 rounded-2xl bg-white/5 p-4 backdrop-blur-xs border border-white/10">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span class="flex items-center gap-1.5">
              <span>Overall Progression</span>
              <span class="text-indigo-300 font-bold">({{ progressPercentage }}%)</span>
            </span>
            <span v-if="nextLevelNumber" class="text-indigo-200">
              Next: Level {{ nextLevelNumber }} – {{ nextLevelTitle }}
            </span>
            <span v-else class="text-amber-300 font-bold inline-flex items-center gap-1">
              <TrophyIcon class="size-3.5" :level="numericLevel" />
              <span>Highest Level Reached</span>
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-400 transition-all duration-700 ease-out"
              :style="{ width: `${progressPercentage}%` }"
              role="progressbar"
              :aria-valuenow="progressPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <!-- Level Step Markers -->
          <div class="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span
              v-for="step in 4"
              :key="step"
              class="flex items-center gap-1 transition-colors"
              :class="step <= numericLevel ? 'text-indigo-300 font-semibold' : 'text-slate-500'"
            >
              <span
                class="size-1.5 rounded-full"
                :class="step <= numericLevel ? 'bg-indigo-400' : 'bg-slate-600'"
              />
              L{{ step }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right Column: Direct CTA Button -->
      <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
        <RouterLink
          :to="examRoute"
          class="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-400 hover:to-indigo-500 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <span>Take Upgrade Exam</span>
          <svg class="size-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>

        <!-- Secondary shortcut to e-Learning -->
        <RouterLink
          to="/dashboard/elearning"
          class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg class="size-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Prepare with eLearning</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getLevelName } from '@/utils/levelDisplay'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'

interface Props {
  currentLevel?: number | string
  levelTitle?: string
  passingScore?: number
  examRoute?: string
  customDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentLevel: 1,
  levelTitle: '',
  passingScore: 70,
  examRoute: '/dashboard/exam',
  customDescription: '',
})

const numericLevel = computed(() => {
  const lvl = Number(props.currentLevel)
  return isNaN(lvl) || lvl < 1 ? 1 : lvl
})

const displayTitle = computed(() => {
  if (props.levelTitle && props.levelTitle.trim() !== '') {
    return props.levelTitle
  }
  return getLevelName(numericLevel.value)
})

const progressPercentage = computed(() => {
  const lvl = Math.min(Math.max(numericLevel.value, 1), 4)
  return Math.round((lvl / 4) * 100)
})

const nextLevelNumber = computed(() => {
  return numericLevel.value < 4 ? numericLevel.value + 1 : null
})

const nextLevelTitle = computed(() => {
  return nextLevelNumber.value ? getLevelName(nextLevelNumber.value) : null
})

const levelDescription = computed(() => {
  if (props.customDescription && props.customDescription.trim() !== '') {
    return props.customDescription
  }
  switch (numericLevel.value) {
    case 1:
      return 'Foundational credential covering essential digital skills, CA?T orientation, and entry-level privileges.'
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
</script>
