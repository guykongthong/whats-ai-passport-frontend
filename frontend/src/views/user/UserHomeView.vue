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

          <!-- Action Buttons Bar -->
          <div class="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
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
                  <h3 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {{ benefit.title }}
                  </h3>
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
              <div class="min-w-0">
                <h3 class="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {{ service.name }}
                </h3>
                <span class="text-[11px] text-slate-500 font-medium">
                  CA?T Student Service
                </span>
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

const currentBenefits = computed<string[]>(() => {
  if (levelDetails.value?.benefits && levelDetails.value.benefits.length > 0) {
    return levelDetails.value.benefits
  }
  return levelStore.getBenefitsForLevel(String(currentLevel.value)).map((b) => b.description)
})

// Format raw benefits string into title and description
const formattedBenefits = computed(() => {
  return currentBenefits.value.map((desc) => {
    const parts = desc.split(':')
    if (parts.length > 1) {
      return {
        title: parts[0]?.trim() || '',
        description: parts.slice(1).join(':').trim(),
      }
    }

    return {
      title: desc,
      description: 'Active The CA?T Passport entitlement for your certified level.',
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
