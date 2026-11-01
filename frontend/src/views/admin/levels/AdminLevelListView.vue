<template>
  <AdminPageLayout title="Criteria of Levels" main-padding="!max-w-[1400px] px-4 sm:px-8">
    <div class="w-full flex flex-col gap-6 mt-1">
      <!-- Subheader (Tightened to PageTitle with 12px gap) -->
      <div class="pb-3 border-b border-white/10">
        <p class="text-xs sm:text-sm text-white/80">
          Overview of all 4 certification tiers, required pass criteria, campus privileges, and student services.
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white/10 backdrop-blur-md rounded-2xl p-16 border border-white/20 flex flex-col items-center justify-center gap-3 text-white"
      >
        <div class="size-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span class="text-sm font-medium text-white/80">Loading levels criteria...</span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-rose-500/20 border border-rose-500/30 text-rose-200 rounded-2xl p-8 sm:p-10 text-center text-sm shadow-xl flex flex-col items-center justify-center"
      >
        <p class="font-bold text-base sm:text-lg text-white">{{ error }}</p>
        <p class="text-xs sm:text-sm text-rose-300 mt-1.5">Please check your connection or session and try again.</p>
        <button
          type="button"
          class="mt-6 px-6 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md cursor-pointer active:scale-95 min-w-[130px] inline-flex items-center justify-center"
          @click="fetchLevels"
        >
          Try Again
        </button>
      </div>

      <!-- 4 Level Cards Grid (Refined with 3-Tier Spacing System) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        <div
          v-for="level in levels"
          :key="level.levelNumber"
          :class="[
            'bg-white/[0.08] backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-lg text-white flex flex-col gap-6 justify-between transition-all duration-200 hover:bg-white/[0.11] min-w-0',
            getLevelTheme(level.levelNumber).hoverBorder,
          ]"
        >
          <!-- Section 1: Header Block -->
          <div>
            <!-- Top Bar: Badge Icon, Short "Level X" Pill, and Edit Button with shrink-0 -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <!-- Compact Badge Visual Container -->
                <div
                  :class="[
                    'size-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm',
                    getLevelTheme(level.levelNumber).badgeContainer,
                  ]"
                >
                  <img
                    v-if="hasCustomBadgeImage(level.badgeImageUrl || level.badge?.imageUrl)"
                    :src="level.badgeImageUrl || level.badge?.imageUrl"
                    :alt="level.badgeName || level.badge?.name || level.name"
                    class="size-9 rounded-xl object-cover"
                  />
                  <!-- Vector SVG Icons per Tier -->
                  <template v-else>
                    <!-- Level 1: Explorer (Compass) -->
                    <svg v-if="level.levelNumber === 1" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
                    </svg>
                    <!-- Level 2: Achiever (Medal) -->
                    <svg v-else-if="level.levelNumber === 2" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="8" r="5" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                    <!-- Level 3: Innovator (Lightbulb) -->
                    <svg v-else-if="level.levelNumber === 3" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <!-- Level 4: Master (Crown) -->
                    <svg v-else class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 18h18M4 15l2.5-9 5.5 5 5.5-5L20 15H4z" />
                    </svg>
                  </template>
                </div>

                <!-- Short Level Pill: "Level 1", "Level 2", etc. -->
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs select-none shrink-0 whitespace-nowrap',
                    getLevelClasses(level.levelNumber),
                  ]"
                >
                  Level {{ level.levelNumber }}
                </span>
              </div>

              <!-- Edit Button with shrink-0 -->
              <RouterLink
                :to="`/admin/levels/${level.levelNumber}`"
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                :aria-label="`Edit Level ${level.levelNumber}`"
              >
                <svg class="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </RouterLink>
            </div>

            <!-- Level Title (ระดับ 1: 4px gap-1, ระดับ 2: 12px mt-3 from icons) -->
            <div class="mt-3 flex flex-col gap-1">
              <h3 class="text-base sm:text-lg font-bold text-white tracking-tight leading-snug truncate" :title="`${level.name || getLevelName(level.levelNumber)} Certification`">
                {{ level.name || getLevelName(level.levelNumber) }} Certification
              </h3>
            </div>

            <!-- Pass Criteria Box (ระดับ 2: 12px mt-3 from subtitle) -->
            <div class="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.08] border border-white/15 text-xs text-white/90 whitespace-nowrap">
              <div class="flex items-center gap-1.5 min-w-0">
                <svg class="size-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-white/80 font-medium">Pass Criteria</span>
              </div>
              <span
                :class="[
                  'font-bold px-2 py-0.5 rounded-md text-[11px] shrink-0 border',
                  getLevelTheme(level.levelNumber).passCriteriaBadge,
                ]"
              >
                {{ formatPassCriteria(level.passCriteria) }}
              </span>
            </div>
          </div>

          <!-- Section 2: Benefits (ระดับ 2: 12px mt-3 between header and items, 12px space-y-3 between items) -->
          <div class="flex-1 flex flex-col justify-between">
            <div class="pb-2">
              <div class="flex items-center justify-between gap-2 whitespace-nowrap">
                <span class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 shrink-0">
                  <svg class="size-3.5 text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span>BENEFITS</span>
                </span>
              </div>

              <!-- Benefits List with 12px inter-item spacing (space-y-3) and baseline-aligned checkmark -->
              <ul class="mt-3 space-y-3 text-xs text-white/90">
                <li
                  v-for="(benefit, idx) in normalizeStringList(level.benefits)"
                  :key="idx"
                  class="flex items-start gap-2.5 text-xs"
                >
                  <svg class="size-3.5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <div class="flex-1 min-w-0 leading-relaxed text-white/90">
                    <span class="break-words">{{ benefit }}</span>
                  </div>
                </li>
                <li
                  v-if="normalizeStringList(level.benefits).length === 0"
                  class="text-xs text-white/50 italic py-1"
                >
                  No benefits configured
                </li>
              </ul>
            </div>

            <!-- Section 3: SERVICES with min-h-[68px] ensuring aligned horizontal dividers -->
            <div class="pt-4 border-t border-white/10 mt-auto">
              <div class="flex items-center justify-between gap-2 whitespace-nowrap">
                <span class="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 shrink-0">
                  <svg class="size-3.5 text-sky-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>SERVICES</span>
                </span>
              </div>

              <!-- Service Chips (ระดับ 2: mt-3 from header, ระดับ 1: gap-2 between chips, min-h-[68px] for uniform alignment) -->
              <div class="mt-3 flex flex-wrap gap-2 min-h-[68px] content-start">
                <span
                  v-for="(service, idx) in normalizeStringList(level.services)"
                  :key="idx"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.08] border border-white/10 text-xs font-medium text-white/95 leading-snug"
                >
                  <span :class="['size-1.5 rounded-full shrink-0', getLevelTheme(level.levelNumber).serviceDot]" />
                  <span>{{ service }}</span>
                </span>
                <span
                  v-if="normalizeStringList(level.services).length === 0"
                  class="text-xs text-white/50 italic py-1"
                >
                  No services configured
                </span>
              </div>
            </div>
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
import AdminLevelService from '@/services/AdminLevelService'
import type { LevelAdmin } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const levels = ref<LevelAdmin[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/**
 * Official Level Color System per Screenshot & levelDisplay.ts
 * - Level 1: Explorer (#C1D7AE / #5A7447)
 * - Level 2: Achiever (#F2D794 / #866D2B)
 * - Level 3: Innovator (#E5A88B / #7A4228)
 * - Level 4: Master (#DD898E / #73292E)
 */
interface LevelTheme {
  badgeContainer: string
  hoverBorder: string
  passCriteriaBadge: string
  serviceDot: string
}

function getLevelTheme(levelNumber: number): LevelTheme {
  switch (levelNumber) {
    case 1:
      return {
        badgeContainer: 'bg-[#C1D7AE]/20 border-[#C1D7AE]/40 text-[#C1D7AE]',
        hoverBorder: 'hover:border-[#C1D7AE]/60',
        passCriteriaBadge: 'text-[#C1D7AE] bg-[#C1D7AE]/15 border-[#C1D7AE]/30',
        serviceDot: 'bg-[#C1D7AE]',
      }
    case 2:
      return {
        badgeContainer: 'bg-[#F2D794]/20 border-[#F2D794]/40 text-[#F2D794]',
        hoverBorder: 'hover:border-[#F2D794]/60',
        passCriteriaBadge: 'text-[#F2D794] bg-[#F2D794]/15 border-[#F2D794]/30',
        serviceDot: 'bg-[#F2D794]',
      }
    case 3:
      return {
        badgeContainer: 'bg-[#E5A88B]/20 border-[#E5A88B]/40 text-[#E5A88B]',
        hoverBorder: 'hover:border-[#E5A88B]/60',
        passCriteriaBadge: 'text-[#E5A88B] bg-[#E5A88B]/15 border-[#E5A88B]/30',
        serviceDot: 'bg-[#E5A88B]',
      }
    case 4:
      return {
        badgeContainer: 'bg-[#DD898E]/20 border-[#DD898E]/40 text-[#DD898E]',
        hoverBorder: 'hover:border-[#DD898E]/60',
        passCriteriaBadge: 'text-[#DD898E] bg-[#DD898E]/15 border-[#DD898E]/30',
        serviceDot: 'bg-[#DD898E]',
      }
    default:
      return {
        badgeContainer: 'bg-white/10 border-white/20 text-white',
        hoverBorder: 'hover:border-white/40',
        passCriteriaBadge: 'text-white bg-white/10 border-white/20',
        serviceDot: 'bg-sky-400',
      }
  }
}

function formatPassCriteria(criteria: number | undefined): string {
  if (criteria === undefined || criteria === null) return 'N/A'
  return `${criteria}/5 questions`
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

function hasCustomBadgeImage(url?: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  return !trimmed.includes('placehold.co')
}

async function fetchLevels() {
  loading.value = true
  error.value = null

  try {
    const response = await AdminLevelService.getLevels()
    levels.value = response.data || []
  } catch (err: unknown) {
    console.error('Failed to load levels criteria:', err)
    error.value = 'Failed to load levels criteria. Please check your connection or session and try again.'
    levels.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLevels()
})
</script>
