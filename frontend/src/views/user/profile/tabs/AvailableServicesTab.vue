<template>
  <div class="space-y-6">
    <!-- Header Summary Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
      <div>
        <h3 class="text-xl font-bold text-slate-900">Available Services</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Services and privileges available for Level {{ currentLevel }} ({{ currentLevelName }}) students.
        </p>
      </div>

      <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 self-start sm:self-auto">
        {{ currentActiveServices.length }} Active Services
      </span>
    </div>

    <!-- Active Available Services Section (Current Level) -->
    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-500">
        <h4 class="text-sm font-semibold text-slate-800">
          Services for your current level (Level {{ currentLevel }}: {{ currentLevelName }})
        </h4>
        <span>Levels 1 - {{ currentLevel }}</span>
      </div>

      <!-- Active Services Grid -->
      <div
        v-if="currentActiveServices.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div
          v-for="service in currentActiveServices"
          :key="service.name"
          class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between gap-2.5 hover:border-slate-300 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <h5 class="text-sm font-bold text-slate-900 leading-snug">
              {{ service.name }}
            </h5>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold shrink-0"
              :class="getLevelBadgeClasses(service.level)"
            >
              Level {{ service.level }}
            </span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            {{ service.description }}
          </p>
        </div>
      </div>

      <!-- Empty State if no services found -->
      <div
        v-else
        class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500"
      >
        <p class="text-sm font-semibold text-slate-700">No Services Available</p>
        <p class="text-xs text-slate-400 mt-1">Services for your current level are currently being updated.</p>
      </div>
    </div>

    <!-- Upcoming Services Section (Next Level Preview) -->
    <div v-if="nextLevelNumber" class="space-y-3 pt-3 border-t border-slate-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <h4 class="text-sm font-semibold text-slate-700">
          Upcoming services (Level {{ nextLevelNumber }}: {{ nextLevelName }})
        </h4>

        <RouterLink
          to="/exam"
          class="font-semibold text-[#00385A] hover:underline self-start sm:self-auto"
        >
          Take Level {{ nextLevelNumber }} Exam to Unlock &rarr;
        </RouterLink>
      </div>

      <!-- Upcoming Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="service in upcomingServices"
          :key="service.name"
          class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 sm:p-5 flex flex-col justify-between gap-2.5"
        >
          <div class="flex items-start justify-between gap-3">
            <h5 class="text-sm font-semibold text-slate-700 leading-snug">
              {{ service.name }}
            </h5>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-200 text-slate-600 shrink-0">
              Level {{ service.level }}
            </span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Top Tier Notice when user reaches Level 4 -->
    <div
      v-else
      class="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-3.5 text-slate-700"
    >
      <div class="size-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
        <TrophyIcon class="size-5" />
      </div>
      <div>
        <h5 class="text-sm font-bold text-slate-900">All Services Unlocked</h5>
        <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
          You are at Level 4 (Master) and have access to all services in The CA?T Passport.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLevelName, getLevelClasses } from '@/utils/levelDisplay'
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
  // Level 1: Explorer
  {
    level: '1',
    name: 'AI Literacy Orientation',
    description: 'Comprehensive orientation covering The CA?T Passport services, student token quotas, and ethical AI usage policies.',
  },
  {
    level: '1',
    name: 'Basic Prompt Writing Clinic',
    description: 'Hands-on guided clinic on prompt structure, few-shot prompting, and academic verification of AI outputs.',
  },
  // Level 2: Achiever
  {
    level: '2',
    name: 'Intermediate AI Tooling Workshop',
    description: 'Practical workshop on using AI coding assistants, generative design tools, and student project workflows.',
  },
  {
    level: '2',
    name: 'Data Handling Consultation',
    description: 'Expert consultation on dataset cleaning, data anonymization, and privacy compliance for training AI models.',
  },
  // Level 3: Innovator
  {
    level: '3',
    name: 'High-Performance GPU Cluster Access',
    description: 'Access to CA?T GPU nodes (NVIDIA A100) and architecture guidance for deep learning and fine-tuning capstones.',
  },
  {
    level: '3',
    name: 'AI Ethics Review Session',
    description: 'Formal review and risk assessment session evaluating fairness, hallucination safeguards, and transparency in student AI applications.',
  },
  // Level 4: Master
  {
    level: '4',
    name: 'Expert AI Certification Support',
    description: 'Institutional vouchers and preparation support for professional cloud AI and machine learning engineering certifications.',
  },
  {
    level: '4',
    name: 'Community AI Ambassador Placement',
    description: 'Opportunities to present AI research and mentor incoming students at CA?T AI symposiums and events.',
  },
]

// Current level allowed services (dynamic from backend userStore.availableServices, with catalog descriptions)
const currentActiveServices = computed<ServiceItem[]>(() => {
  const backendServices = userStore.availableServices
  if (backendServices && backendServices.length > 0) {
    return backendServices.map((name) => {
      const found = serviceCatalog.find((s) => s.name.toLowerCase() === name.toLowerCase())
      return found || {
        level: String(currentLevel.value),
        name,
        description: 'Authorized campus service benefit associated with your AI Passport certification.',
      }
    })
  }
  const lvl = currentLevel.value
  return serviceCatalog.filter((s) => Number(s.level) <= lvl)
})

// Upcoming services strictly unlocked at the next level
const upcomingServices = computed<ServiceItem[]>(() => {
  const nextLvl = nextLevelNumber.value
  if (!nextLvl) return []
  return serviceCatalog.filter((s) => Number(s.level) === nextLvl)
})

function getLevelBadgeClasses(levelStr: string): string {
  return getLevelClasses(levelStr)
}
</script>
