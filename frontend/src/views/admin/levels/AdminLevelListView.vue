<template>
  <AdminPageLayout title="Criteria of Levels" main-padding="px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-white/10 gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Competency Levels & Criteria</h2>
          <p class="text-xs sm:text-sm text-white/60 mt-1">
            Overview of all 4 certification tiers, required pass criteria, campus privileges, and student services.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/80">
            4 Tiers Configured
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-16 border border-white/20 flex flex-col items-center justify-center gap-3 text-white"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/70">Loading levels criteria...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-6 text-center text-sm"
      >
        <p class="font-semibold">{{ error }}</p>
        <button
          type="button"
          class="mt-3 px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer"
          @click="fetchLevels"
        >
          Try Again
        </button>
      </div>

      <!-- 4 Level Cards Grid (Criteria #15 & #16) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          v-for="level in levels"
          :key="level.levelNumber"
          :class="[
            'bg-white/10 backdrop-blur-md rounded-2xl p-6 border shadow-lg text-white flex flex-col justify-between transition-all duration-200 hover:bg-white/15 group',
            getLevelBorderClass(level.levelNumber),
          ]"
        >
          <!-- Card Top Content -->
          <div class="flex flex-col flex-1">
            <!-- Header: Badge Icon & Level Pill -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <!-- Badge Image / Vector SVG Icon -->
              <div
                :class="[
                  'size-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm',
                  getBadgeContainerClass(level.levelNumber),
                ]"
              >
                <img
                  v-if="level.badge?.imageUrl"
                  :src="level.badge.imageUrl"
                  :alt="level.name"
                  class="size-14 rounded-2xl object-cover"
                />
                <!-- Professional SVG Vector Icons per Level Tier -->
                <template v-else>
                  <!-- Level 1: Explorer (Compass Icon) -->
                  <svg v-if="level.levelNumber === 1" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
                  </svg>
                  <!-- Level 2: Achiever (Medal Icon) -->
                  <svg v-else-if="level.levelNumber === 2" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="8" r="5" stroke-width="2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  <!-- Level 3: Innovator (Lightbulb Innovation Icon) -->
                  <svg v-else-if="level.levelNumber === 3" class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <!-- Level 4: Master (Crown / Highest Honor Icon) -->
                  <svg v-else class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18h18M4 15l2.5-9 5.5 5 5.5-5L20 15H4z" />
                  </svg>
                </template>
              </div>

              <!-- Level Tag Badge -->
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-xs select-none',
                  getLevelClasses(level.levelNumber),
                ]"
              >
                Level {{ level.levelNumber }}
              </span>
            </div>

            <!-- Level Name & Tier -->
            <div class="mb-4">
              <h3 class="text-xl font-bold text-white tracking-tight">
                {{ level.name || getLevelName(level.levelNumber) }}
              </h3>
              <p class="text-xs text-white/60 mt-0.5">
                Competency Tier {{ level.levelNumber }}
              </p>
            </div>

            <!-- Pass Criteria Box -->
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-5 flex items-center gap-3">
              <div class="size-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300">
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="min-w-0">
                <span class="text-xs text-white/50 block font-medium uppercase tracking-wider">Pass Criteria</span>
                <span class="text-sm font-bold text-emerald-300">
                  {{ formatPassCriteria(level.passCriteria) }}
                </span>
              </div>
            </div>

            <!-- Benefits Section -->
            <div class="mb-5 flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <svg class="size-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Benefits
                </span>
                <span class="text-[11px] text-white/50 font-medium">
                  {{ normalizeStringList(level.benefits).length }} items
                </span>
              </div>

              <ul class="space-y-1.5 text-xs text-white/80">
                <li
                  v-for="(benefit, idx) in normalizeStringList(level.benefits)"
                  :key="idx"
                  class="flex items-start gap-2 leading-relaxed"
                >
                  <span class="text-emerald-400 shrink-0 mt-0.5">&bull;</span>
                  <span class="line-clamp-2" :title="benefit">{{ benefit }}</span>
                </li>
                <li
                  v-if="normalizeStringList(level.benefits).length === 0"
                  class="text-xs text-white/40 italic"
                >
                  No benefits configured
                </li>
              </ul>
            </div>

            <!-- Services Section -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <svg class="size-3.5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Available Services
                </span>
                <span class="text-[11px] text-white/50 font-medium">
                  {{ normalizeStringList(level.services).length }} services
                </span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(service, idx) in normalizeStringList(level.services)"
                  :key="idx"
                  class="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-white/90"
                  :title="service"
                >
                  {{ service }}
                </span>
                <span
                  v-if="normalizeStringList(level.services).length === 0"
                  class="text-xs text-white/40 italic"
                >
                  No services configured
                </span>
              </div>
            </div>
          </div>

          <!-- Card Footer: Edit Level Action Button -->
          <div class="pt-4 border-t border-white/10 mt-auto">
            <RouterLink
              :to="`/admin/levels/${level.levelNumber}`"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm group-hover:bg-white/20"
              :aria-label="`Edit Level ${level.levelNumber} (${level.name})`"
            >
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Level</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import AdminLevelService from '@/services/AdminLevelService'
import type { LevelAdmin } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { useToast } from '@/composables/useToast'

const { showToast, toastMessage } = useToast()

const levels = ref<LevelAdmin[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fallbackLevels: LevelAdmin[] = [
  {
    id: 1,
    levelNumber: 1,
    name: 'Explorer',
    passCriteria: 4,
    benefits: [
      'Access to borrowing basic digital equipment from the CAMT Equipment Pool',
      'Access to high-speed CMU-WiFi 6 and university VPN',
      'Receive a Digital Stamp for participating in events',
      'Access to basic video courses in the Level 1 system',
      'Receive early notifications about Hackathons and special Workshops',
    ],
    services: [
      'AI Literacy Orientation',
      'Basic Prompt Writing Clinic',
    ],
    badge: {
      name: 'Level 1 Explorer Badge',
      imageUrl: '',
    },
  },
  {
    id: 2,
    levelNumber: 2,
    name: 'Achiever',
    passCriteria: 4,
    benefits: [
      'Unlock all benefits from Level 1',
      'Free quota for the 3D Printing Lab: 50 hours/semester',
      'Reserve Smart Meeting Rooms for project team meetings',
      'Receive a Digital Certificate of Achievement (Level 2)',
      'Access Exclusive Industry Mentoring with experts in the technology industry',
      'Borrow Cinema equipment and professional-grade production equipment',
    ],
    services: [
      'Intermediate AI Tooling Workshop',
      'Data Handling Consultation',
    ],
    badge: {
      name: 'Level 2 Achiever Badge',
      imageUrl: '',
    },
  },
  {
    id: 3,
    levelNumber: 3,
    name: 'Innovator',
    passCriteria: 4,
    benefits: [
      'Unlock all benefits from Level 1 and Level 2',
      'Access the High-Performance GPU Cluster (NVIDIA A100/H100) for AI & Deep Learning',
      'Fast-track selection for the CAMT Tech Startup Incubation program',
      'Priority booking for the Motion Capture Studio & Virtual Production facilities',
    ],
    services: [
      'Advanced Project Mentorship',
      'AI Ethics Review Session',
    ],
    badge: {
      name: 'Level 3 Innovator Badge',
      imageUrl: '',
    },
  },
  {
    id: 4,
    levelNumber: 4,
    name: 'Master',
    passCriteria: 5,
    benefits: [
      'Unlock all benefits from Level 1 and Level 2',
      'Access the High-Performance GPU Cluster (NVIDIA A100/H100) for AI & Deep Learning',
      'Project funding support for national-level competitions, up to 10,000 THB',
      'Fast-track selection for the CAMT Tech Startup Incubation program',
      'Priority booking for the Motion Capture Studio & Virtual Production facilities',
    ],
    services: [
      'Expert Certification Support',
      'Community Speaker Placement',
    ],
    badge: {
      name: 'Level 4 Master Badge',
      imageUrl: '',
    },
  },
]

function getBadgeContainerClass(levelNumber: number): string {
  switch (levelNumber) {
    case 1:
      return 'bg-[#C1D7AE]/20 border-[#C1D7AE]/30 text-[#C1D7AE]'
    case 2:
      return 'bg-[#F2D794]/20 border-[#F2D794]/30 text-[#F2D794]'
    case 3:
      return 'bg-[#E5A88B]/20 border-[#E5A88B]/30 text-[#E5A88B]'
    case 4:
      return 'bg-[#DD898E]/20 border-[#DD898E]/30 text-[#DD898E]'
    default:
      return 'bg-white/10 border-white/20 text-white'
  }
}

function getLevelBorderClass(levelNumber: number): string {
  switch (levelNumber) {
    case 1:
      return 'hover:border-[#C1D7AE]/60 border-white/20'
    case 2:
      return 'hover:border-[#F2D794]/60 border-white/20'
    case 3:
      return 'hover:border-[#E5A88B]/60 border-white/20'
    case 4:
      return 'hover:border-[#DD898E]/60 border-white/20'
    default:
      return 'border-white/20'
  }
}

function formatPassCriteria(criteria: number | undefined): string {
  if (criteria === undefined || criteria === null) return 'N/A'
  if (criteria > 10) {
    return `Pass Score: ${criteria}%`
  }
  return `Pass Score: ${criteria}/5 questions`
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

async function fetchLevels() {
  loading.value = true
  error.value = null

  try {
    const response = await AdminLevelService.getLevels()
    if (response.data && response.data.length > 0) {
      levels.value = response.data
    } else {
      levels.value = fallbackLevels
    }
  } catch (err: unknown) {
    console.warn('Could not fetch levels from backend, using fallback configuration:', err)
    levels.value = fallbackLevels
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLevels()
})
</script>
