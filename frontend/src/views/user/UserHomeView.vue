<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col items-center">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">

        <!-- 1. Top Card: Current Level & Progression Roadmap (Matching reference image) -->
        <section
          aria-label="Level Progression and Status"
          class="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6"
        >
          <!-- Level Title & Description -->
          <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#002845] tracking-tight">
              Level {{ currentLevel }} – {{ levelTitle }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {{ levelDescription }}
            </p>
          </div>

          <!-- Level Progression Roadmap -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between text-xs">
              <h2 class="font-bold text-slate-800 text-xs sm:text-sm">
                Level Progression Roadmap
              </h2>
              <span class="text-slate-500 font-semibold">
                Overall Progress: <strong class="text-slate-800 font-bold">{{ progressPercentage }}%</strong>
              </span>
            </div>

            <!-- Progress Bar Track -->
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-[#00385A] transition-all duration-700 ease-out"
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>

            <!-- 4-Step Milestone Checklist (Horizontal) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div
                v-for="step in roadmapSteps"
                :key="step.level"
                class="flex items-center gap-2.5 min-w-0"
              >
                <!-- Milestone Circle Icon -->
                <div
                  class="size-6 rounded-full flex items-center justify-center shrink-0 transition-colors text-xs font-bold"
                  :class="[
                    step.isCompleted
                      ? 'bg-[#002845] text-white'
                      : step.isActive
                        ? 'bg-[#002845] text-white ring-2 ring-[#002845]/20'
                        : 'border border-slate-300 text-slate-400 bg-white'
                  ]"
                >
                  <!-- Completed: Checkmark -->
                  <svg v-if="step.isCompleted" class="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <!-- Active or Upcoming: Step Number -->
                  <span v-else>{{ step.level }}</span>
                </div>

                <!-- Milestone Labels -->
                <div class="min-w-0">
                  <p
                    class="text-xs font-bold truncate leading-tight"
                    :class="step.isActive || step.isCompleted ? 'text-slate-900' : 'text-slate-500'"
                  >
                    {{ step.name }}
                  </p>
                  <p
                    class="text-[11px] font-medium leading-tight mt-0.5"
                    :class="[
                      step.isCompleted
                        ? 'text-emerald-700 font-semibold'
                        : step.isActive
                          ? 'text-slate-600 font-semibold'
                          : 'text-slate-400'
                    ]"
                  >
                    {{ step.statusLabel }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Primary CTA: Take Upgrade Exam (If not Level 4) -->
              <RouterLink
                v-if="nextLevelNumber"
                to="/exam"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002845] hover:bg-[#001830] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Take Upgrade Exam for Level {{ nextLevelNumber }}</span>
                <span>&rarr;</span>
              </RouterLink>

              <!-- Level 4 Master Achieved Button -->
              <RouterLink
                v-else
                to="/profile/badges"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <TrophyIcon class="size-4 text-white" />
                <span>View Master Badges</span>
              </RouterLink>

              <!-- Secondary CTA: Prepare via E-Learning -->
              <RouterLink
                to="/elearning"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#002845] border border-sky-100 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
              >
                <DocumentTextIcon class="size-4 text-[#002845]" />
                <span>Prepare via E-Learning</span>
              </RouterLink>
            </div>

            <!-- Right Link: View Syllabus & Benefits -->
            <RouterLink
              to="/profile/services"
              class="inline-flex items-center justify-center sm:justify-start gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
            >
              <span>View Syllabus Requirements</span>
              <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </RouterLink>
          </div>
        </section>

        <!-- 2. Card: Active Benefits & Resources (2x2 Grid Matching reference image) -->
        <section
          aria-label="Active Benefits and Resources"
          class="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-5"
        >
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900">
                Active Benefits & Resources
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                These privileges are unlocked for your current Level {{ currentLevel }} ({{ levelTitle }}) student status.
              </p>
            </div>
            <span class="text-xs text-slate-500 font-medium">
              {{ formattedBenefits.length }} benefits unlocked
            </span>
          </div>

          <!-- Benefits 2x2 Grid -->
          <div
            v-if="formattedBenefits.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              v-for="(benefit, idx) in formattedBenefits"
              :key="idx"
              class="rounded-xl border border-slate-200/80 bg-sky-50/40 p-4 sm:p-5 flex flex-col justify-between gap-2.5 transition-all hover:border-slate-300"
            >
              <div class="flex items-start gap-2.5">
                <!-- Simple Clean Checkmark (No nested circles) -->
                <svg class="size-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {{ benefit.title }}
                    </h3>
                    <span
                      v-if="benefit.tag"
                      class="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-sky-100 text-sky-800 shrink-0"
                    >
                      {{ benefit.tag }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    {{ benefit.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="py-8 text-center text-xs text-slate-400">
            No active benefits registered for your current credential tier.
          </div>
        </section>

        <!-- 3. Card: Available Campus Facilities & Services Catalog -->
        <section
          aria-label="Available Campus Services"
          class="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-5"
        >
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 class="text-base sm:text-lg font-bold text-slate-900">
                Accessible Campus Facilities & Services
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Institutional facilities and workshops available to reserve under your tier.
              </p>
            </div>
            <span class="text-xs text-slate-500 font-medium">
              {{ activeServices.length }} facilities available
            </span>
          </div>

          <!-- Services Grid -->
          <div
            v-if="activeServices.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              v-for="(service, idx) in activeServices"
              :key="idx"
              class="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 flex items-center justify-between gap-3 transition-all hover:border-slate-300"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Clean Building/Facility Line Icon (No heavy purple box) -->
                <svg class="size-4.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>

                <div class="min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {{ service.name }}
                  </h3>
                  <span class="text-[11px] text-slate-500 font-medium">
                    CA?T Student Service
                  </span>
                </div>
              </div>

              <!-- Simple Clean Unlocked Label (No heavy pill with borders) -->
              <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1 shrink-0">
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlocked</span>
              </span>
            </div>
          </div>

          <!-- Footer link -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Privileges sync automatically upon completing advancement exams.</span>
            <RouterLink to="/profile/services" class="font-bold text-[#002845] hover:underline cursor-pointer">
              View all services catalog &rarr;
            </RouterLink>
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
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'

const userStore = useUserStore()
const levelStore = useLevelStore()

const currentLevel = computed<number>(() => userStore.currentUserLevel || 1)
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

const levelDescription = computed<string>(() => {
  if (levelDetails.value?.description && levelDetails.value.description.trim() !== '') {
    return levelDetails.value.description
  }
  switch (currentLevel.value) {
    case 1:
      return 'Foundational tier for new members, introducing core digital knowledge, university workflows, and basic digital tools.'
    case 2:
      return 'Intermediate tier for students who have developed specialized domain skills and can apply digital tools to build real-world projects.'
    case 3:
      return 'Awarded to students demonstrating applied innovation and independent research projects. Unlocks high-performance computing resources, dedicated research mentorship, and enterprise venture pathways.'
    case 4:
      return 'Highest tier of The CA?T Passport, recognizing outstanding academic, professional, and international expertise.'
    default:
      return 'Complete curriculum modules and pass competency examinations to advance your credential tier.'
  }
})

// Roadmap 4 steps
const roadmapSteps = computed(() => {
  const levelLabels = [
    { level: 1, name: 'L1 Explorer' },
    { level: 2, name: 'L2 Achiever' },
    { level: 3, name: 'L3 Innovator' },
    { level: 4, name: 'L4 Master' },
  ]

  const current = currentLevel.value

  return levelLabels.map((item) => {
    const isCompleted = item.level < current || (item.level === 4 && current === 4)
    const isActive = item.level === current && current < 4

    let statusLabel = 'Next Goal'
    if (isCompleted) {
      statusLabel = 'Completed'
    } else if (isActive) {
      statusLabel = 'Active • Current'
    }

    return {
      level: item.level,
      name: item.name,
      isCompleted,
      isActive,
      statusLabel,
    }
  })
})

const currentBenefits = computed<string[]>(() => {
  if (levelDetails.value?.benefits && levelDetails.value.benefits.length > 0) {
    return levelDetails.value.benefits
  }
  return levelStore.getBenefitsForLevel(String(currentLevel.value)).map((b) => b.description)
})

// Format raw benefits string into title, description, and tags
const formattedBenefits = computed(() => {
  return currentBenefits.value.map((desc) => {
    let tag: string | null = null
    if (/quota|50 hours/i.test(desc)) tag = 'QUOTA'
    else if (/funding|10,000|grant/i.test(desc)) tag = 'GRANT'
    else if (/certificate/i.test(desc)) tag = 'CERTIFIED'
    else if (/mentoring|mentor/i.test(desc)) tag = 'ADVISORY'
    else if (/gpu|a100|h100/i.test(desc)) tag = 'QUOTA'

    const parts = desc.split(':')
    if (parts.length > 1) {
      return {
        title: parts[0]?.trim() || '',
        description: parts.slice(1).join(':').trim(),
        tag,
      }
    }

    return {
      title: desc,
      description: 'Active The CA?T Passport service entitlement for your certified level.',
      tag,
    }
  })
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
