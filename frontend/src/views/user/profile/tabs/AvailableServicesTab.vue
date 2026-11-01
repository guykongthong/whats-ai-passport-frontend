<template>
  <div class="space-y-8">
    <!-- Header Summary Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
      <div>
        <h3 class="text-xl font-extrabold text-[#00385A]">Available Services Catalog</h3>
        <p class="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
          Campus facilities, digital perks, and specialized workshops unlocked for your certified level tier.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{{ currentActiveServices.length }} Active Services</span>
        </span>
      </div>
    </div>

    <!-- Active Available Services Section (Current Level) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="size-4 text-emerald-600" />
          <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Current Tier Services (Level {{ currentLevel }}: {{ currentLevelName }})
          </h4>
        </div>
        <span class="text-xs text-slate-400 font-medium">
          Allowed for your credential
        </span>
      </div>

      <!-- Active Services Grid -->
      <div
        v-if="currentActiveServices.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div
          v-for="service in currentActiveServices"
          :key="service.name"
          class="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-[#00385A]/40 hover:shadow-md flex flex-col justify-between gap-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3.5">
              <div
                class="size-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-inner border"
                :class="getServiceTierColor(service.level)"
              >
                <DocumentTextIcon class="size-6" />
              </div>
              <div>
                <h5 class="text-sm font-bold text-slate-800 group-hover:text-[#00385A] transition-colors leading-snug">
                  {{ service.name }}
                </h5>
                <span
                  class="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                  :class="getLevelBadgeClasses(service.level)"
                >
                  {{ getAccessTag(service.level) }}
                </span>
              </div>
            </div>

            <!-- Active Status Pill -->
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 shrink-0">
              <CheckCircleIcon class="size-3 text-emerald-600" />
              <span>Active & Available</span>
            </span>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            {{ service.description }}
          </p>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Facility Access: Unlimited</span>
            <span class="font-semibold text-emerald-600 inline-flex items-center gap-1">
              <CheckCircleIcon class="size-3.5 text-emerald-600" />
              <span>Entitled</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State if no services found -->
      <div
        v-else
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center py-10"
      >
        <p class="text-sm font-bold text-slate-700">No Services Registered</p>
        <p class="text-xs text-slate-500 mt-1">Services for your current level are currently being updated.</p>
      </div>
    </div>

    <!-- Upcoming Services Section (Next Level Preview) -->
    <div v-if="nextLevelNumber" class="space-y-4 pt-4 border-t border-slate-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center gap-2">
          <LockIcon class="size-4 text-slate-500" />
          <h4 class="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Upcoming Services (Unlocked at Level {{ nextLevelNumber }}: {{ nextLevelName }})
          </h4>
        </div>

        <RouterLink
          to="/exam"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#00385A] hover:underline cursor-pointer self-start sm:self-auto"
        >
          <span>Take Level {{ nextLevelNumber }} Exam to Unlock</span>
          <span>&rarr;</span>
        </RouterLink>
      </div>

      <!-- Upcoming Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="service in upcomingServices"
          :key="service.name"
          class="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/70 p-5 opacity-75 hover:opacity-95 transition-opacity flex flex-col justify-between gap-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3.5">
              <div class="size-11 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-base shrink-0 border border-slate-300 grayscale">
                <LockIcon class="size-5" />
              </div>
              <div>
                <h5 class="text-sm font-bold text-slate-700 leading-snug">
                  {{ service.name }}
                </h5>
                <span class="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                  {{ getAccessTag(service.level) }}
                </span>
              </div>
            </div>

            <!-- Locked Status Pill -->
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold border border-slate-300 shrink-0">
              <LockIcon class="size-3" />
              <span>Upcoming Perk</span>
            </span>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            {{ service.description }}
          </p>

          <div class="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Unlock Requirement: Pass Level {{ nextLevelNumber }} Exam</span>
            <RouterLink
              to="/exam"
              class="font-bold text-[#00385A] hover:underline"
            >
              Start Exam &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Tier Congratulation Notice when user reaches Level 4 -->
    <div
      v-else
      class="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 flex items-center gap-4 text-amber-900"
    >
      <div class="size-12 rounded-2xl bg-amber-200/80 flex items-center justify-center shrink-0 shadow-inner text-amber-800">
        <TrophyIcon class="size-6" />
      </div>
      <div>
        <h5 class="text-sm font-black">All Campus Services Unlocked</h5>
        <p class="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
          You have achieved Level 4 (Master) credential status and possess unrestricted access to all specialized institutional facilities, workshops, and enterprise resources.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLevelName } from '@/utils/levelDisplay'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon.vue'
import LockIcon from '@/shared/components/icons/LockIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'

interface ServiceItem {
  level: string
  name: string
  description: string
}

const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  if (!userStore.currentLevelDetails) {
    await userStore.fetchLevelDetails()
  }
})

const currentLevel = computed(() => userStore.currentUserLevel)
const currentLevelName = computed(() => getLevelName(currentLevel.value))

const nextLevelNumber = computed<number | null>(() => {
  return currentLevel.value < 4 ? currentLevel.value + 1 : null
})

const nextLevelName = computed<string>(() => {
  return nextLevelNumber.value ? getLevelName(nextLevelNumber.value) : ''
})

const serviceCatalog: ServiceItem[] = [
  // Level 1
  {
    level: '1',
    name: 'AI Literacy Orientation',
    description: 'Comprehensive onboarding to CAMT digital infrastructure, AI tools, and acceptable use policies.',
  },
  {
    level: '1',
    name: 'Basic Prompt Writing Clinic',
    description: 'Hands-on guided sessions for crafting effective prompts and interacting with generative LLMs.',
  },
  // Level 2
  {
    level: '2',
    name: 'Intermediate AI Tooling Workshop',
    description: 'Deep dive into model integration, workflow automation, and multimodal generation tools.',
  },
  {
    level: '2',
    name: 'Data Handling Consultation',
    description: '1-on-1 advisor sessions for data cleaning, preprocessing, and compliance with data privacy standards.',
  },
  // Level 3
  {
    level: '3',
    name: 'Advanced Project Mentorship',
    description: 'Dedicated faculty and industry mentors providing architectural review for capstone projects.',
  },
  {
    level: '3',
    name: 'AI Ethics Review Session',
    description: 'Institutional ethics evaluation and bias auditing for production AI deployments.',
  },
  // Level 4
  {
    level: '4',
    name: 'Expert Certification Support',
    description: 'Sponsored vouchers and fast-track prep for recognized enterprise cloud and AI certifications.',
  },
  {
    level: '4',
    name: 'Community Speaker Placement',
    description: 'Exclusive invitation to deliver keynote presentations and tech talks across academic symposiums.',
  },
]

// Current level allowed services (cumulative from level 1 up to current level)
const currentActiveServices = computed<ServiceItem[]>(() => {
  const lvl = currentLevel.value
  return serviceCatalog.filter((s) => Number(s.level) <= lvl)
})

// Upcoming services strictly unlocked at the next level
const upcomingServices = computed<ServiceItem[]>(() => {
  const nextLvl = nextLevelNumber.value
  if (!nextLvl) return []
  return serviceCatalog.filter((s) => Number(s.level) === nextLvl)
})

function getAccessTag(levelStr: string): string {
  switch (levelStr) {
    case '1':
      return 'Level 1 Access'
    case '2':
      return 'Level 2 Exclusive'
    case '3':
      return 'Level 3 Specialized'
    case '4':
      return 'Level 4 Mastery'
    default:
      return `Level ${levelStr} Tier`
  }
}

function getLevelBadgeClasses(levelStr: string): string {
  switch (levelStr) {
    case '1':
      return 'bg-[#C1D7AE]/40 text-[#5A7447]'
    case '2':
      return 'bg-[#F2D794]/40 text-[#866D2B]'
    case '3':
      return 'bg-[#E5A88B]/40 text-[#7A4228]'
    case '4':
      return 'bg-[#DD898E]/40 text-[#73292E]'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function getServiceTierColor(levelStr: string): string {
  switch (levelStr) {
    case '1':
      return 'bg-[#C1D7AE]/25 text-[#5A7447] border-[#C1D7AE]/60'
    case '2':
      return 'bg-[#F2D794]/25 text-[#866D2B] border-[#F2D794]/60'
    case '3':
      return 'bg-[#E5A88B]/25 text-[#7A4228] border-[#E5A88B]/60'
    case '4':
      return 'bg-[#DD898E]/25 text-[#73292E] border-[#DD898E]/60'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}
</script>
