<template>
  <div class="space-y-6">
    <!-- Header / Summary Bar -->
    <div class="border-b border-slate-200 pb-4">
      <div>
        <h3 class="text-xl font-bold text-slate-900">Certification Badges</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
          Digital badges unlocked through examination in The CA?T Passport.
        </p>
      </div>
    </div>

    <!-- 4-Level Badges Grid (Criteria #21) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div
        v-for="badge in badgeCards"
        :key="badge.level"
        :class="[
          'relative flex flex-col rounded-2xl border p-5 transition-all text-center cursor-pointer select-none',
          badge.isUnlocked
            ? 'bg-gradient-to-b from-white to-slate-50/70 border-slate-200/90 shadow-xs hover:-translate-y-1 hover:border-[#00385A]/40 hover:shadow-md'
            : 'bg-slate-50/70 border-dashed border-slate-300/80 grayscale opacity-70 hover:opacity-90 hover:border-slate-400',
        ]"
        role="button"
        tabindex="0"
        :aria-label="`View details for ${badge.title}`"
        @click="openBadgeModal(badge)"
        @keydown.enter="openBadgeModal(badge)"
        @keydown.space.prevent="openBadgeModal(badge)"
      >
        <!-- Lock Overlay Tag for Locked Badges -->
        <div
          v-if="!badge.isUnlocked"
          class="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-slate-200 text-slate-600 shadow-2xs"
          title="Locked"
        >
          <LockIcon class="size-4" />
        </div>

        <!-- Badge Emblem Icon -->
        <div class="mx-auto my-3 flex size-20 items-center justify-center rounded-2xl p-2.5 transition-transform">
          <div
            :class="[
              'size-full rounded-2xl flex items-center justify-center text-3xl shadow-inner border overflow-hidden',
              badge.isUnlocked ? badge.badgeBgClass : 'bg-slate-200 text-slate-400 border-slate-300',
            ]"
          >
            <!-- Level 1: Explorer (Compass) -->
            <svg v-if="badge.level === 1" class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
            </svg>
            <!-- Level 2: Achiever (Medal) -->
            <svg v-else-if="badge.level === 2" class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="5" stroke-width="1.8" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            <!-- Level 3: Innovator (Lightbulb) -->
            <svg v-else-if="badge.level === 3" class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <!-- Level 4: Master (Crown) -->
            <svg v-else class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 18h18M4 15l2.5-9 5.5 5 5.5-5L20 15H4z" />
            </svg>
          </div>
        </div>

        <!-- Level Indicator Pill -->
        <div class="mb-2">
          <span
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold',
              badge.isUnlocked ? getLevelClasses(badge.level) : 'bg-slate-100 text-slate-600 border border-slate-200',
            ]"
          >
            Level {{ badge.level }}: {{ badge.title }}
          </span>
        </div>

        <!-- Badge Title & Description -->
        <h4 class="text-sm font-extrabold text-[#00385A] leading-snug">
          {{ badge.badgeName }}
        </h4>
        <p class="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {{ badge.description }}
        </p>

        <!-- Bottom Status Bar -->
        <div class="mt-auto pt-3">
          <div v-if="badge.isUnlocked" class="text-center">
            <span v-if="badge.unlockedAt" class="text-xs font-medium text-slate-500">
              Unlocked: {{ formatDate(badge.unlockedAt) }}
            </span>
          </div>

          <div v-else class="text-center">
            <span class="text-xs text-slate-400 font-medium">
              Pass Level {{ badge.level }} exam
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Badge Details Modal -->
    <Transition name="fade">
      <div
        v-if="selectedBadge"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
        @click.self="closeBadgeModal"
        @keydown.esc="closeBadgeModal"
      >
        <div class="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-6 animate-scale-up">
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
            @click="closeBadgeModal"
          >
            <XMarkIcon class="size-5" />
          </button>

          <!-- Modal Header with Badge Graphic -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
            <div
              :class="[
                'size-24 rounded-2xl flex items-center justify-center text-4xl shadow-md border shrink-0 overflow-hidden',
                selectedBadge.isUnlocked ? selectedBadge.badgeBgClass : 'bg-slate-100 text-slate-400 border-slate-200 grayscale',
              ]"
            >
              <!-- Level 1: Explorer (Compass) -->
              <svg v-if="selectedBadge.level === 1" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14.828 9.172l-1.414 4.242-4.242 1.414 1.414-4.242 4.242-1.414z" />
              </svg>
              <!-- Level 2: Achiever (Medal) -->
              <svg v-else-if="selectedBadge.level === 2" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="5" stroke-width="1.8" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <!-- Level 3: Innovator (Lightbulb) -->
              <svg v-else-if="selectedBadge.level === 3" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <!-- Level 4: Master (Crown) -->
              <svg v-else class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 18h18M4 15l2.5-9 5.5 5 5.5-5L20 15H4z" />
              </svg>
            </div>

            <div class="text-center sm:text-left space-y-1.5 flex-1">
              <div class="inline-flex items-center gap-2">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-md text-xs font-semibold',
                    selectedBadge.isUnlocked ? getLevelClasses(selectedBadge.level) : 'bg-slate-100 text-slate-600 border border-slate-200',
                  ]"
                >
                  Level {{ selectedBadge.level }}: {{ selectedBadge.title }}
                </span>

                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    selectedBadge.isUnlocked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600',
                  ]"
                >
                  {{ selectedBadge.isUnlocked ? 'Unlocked' : 'Locked' }}
                </span>
              </div>

              <h3 :id="modalTitleId" class="text-xl sm:text-2xl font-black text-[#00385A]">
                {{ selectedBadge.badgeName }}
              </h3>
              <p class="text-xs text-slate-500 font-medium">
                Official Digital Competency Credential
              </p>
            </div>
          </div>

          <!-- Description Section -->
          <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p class="font-bold text-[#00385A]">Credential Overview:</p>
            <p>{{ selectedBadge.description }}</p>
          </div>

          <!-- Requirements & Verification Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl border border-slate-200/80 bg-white">
              <span class="text-slate-400 block text-[11px] font-medium">Passing Criteria</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">
                {{ selectedBadge.passingScore }}% Score or Higher
              </span>
            </div>

            <div class="p-3.5 rounded-xl border border-slate-200/80 bg-white">
              <span class="text-slate-400 block text-[11px] font-medium">Credential Status</span>
              <span
                :class="[
                  'font-bold text-sm mt-0.5 block',
                  selectedBadge.isUnlocked ? 'text-emerald-700' : 'text-slate-600',
                ]"
              >
                {{ selectedBadge.isUnlocked ? 'Issued & Verified' : 'Pending Examination' }}
              </span>
            </div>
          </div>

          <!-- Unlocked Date or Unlock CTA -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div>
              <span v-if="selectedBadge.isUnlocked && selectedBadge.unlockedAt" class="text-xs text-slate-500">
                Unlocked on: <strong class="text-slate-700">{{ formatFullDate(selectedBadge.unlockedAt) }}</strong>
              </span>
              <span v-else-if="!selectedBadge.isUnlocked" class="text-xs text-amber-700 font-medium">
                Complete Level {{ selectedBadge.level }} exam to earn this badge.
              </span>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <RouterLink
                v-if="!selectedBadge.isUnlocked"
                to="/exam"
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00385A] hover:bg-[#002a43] text-white text-xs font-bold transition-colors shadow-xs text-center cursor-pointer"
              >
                Go to Exam
              </RouterLink>

              <button
                type="button"
                class="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                @click="closeBadgeModal"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import LockIcon from '@/shared/components/icons/LockIcon.vue'
import XMarkIcon from '@/shared/components/icons/XMarkIcon.vue'

interface BadgeCardItem {
  level: number
  title: string
  badgeName: string
  description: string
  passingScore: number
  isUnlocked: boolean
  unlockedAt?: string | null
  imageUrl?: string | null
  badgeBgClass: string
}

const userStore = useUserStore()

const modalTitleId = 'badge-modal-title'
const selectedBadge = ref<BadgeCardItem | null>(null)

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

const currentUserLevel = computed(() => userStore.currentUserLevel)

const badgeIcons: Record<number, { bgClass: string }> = {
  1: { bgClass: 'bg-slate-100 text-slate-700 border-slate-300' },
  2: { bgClass: 'bg-sky-100 text-sky-800 border-sky-300' },
  3: { bgClass: 'bg-blue-100 text-blue-900 border-blue-300' },
  4: { bgClass: 'bg-blue-900 text-white border-blue-700' },
}

const badgeCards = computed<BadgeCardItem[]>(() => {
  const currentLvl = currentUserLevel.value
  const userBadges = userStore.badges
  const examHistories = userStore.examHistories

  return [1, 2, 3, 4].map((levelNum) => {
    const title = getLevelName(levelNum)

    // Unlocked criteria:
    // Level 1 is always unlocked. Other levels are unlocked if currentLevel >= levelNum
    // OR if userBadges has a matching badge
    const isUnlocked = levelNum <= currentLvl

    // Match unlock timestamp from user badges or exam history
    const matchedBadge = userBadges.find((b) =>
      b.name.toLowerCase().includes(title.toLowerCase()) ||
      b.name.toLowerCase().includes(`level ${levelNum}`),
    )

    const matchedExam = examHistories.find(
      (e) => Number(e.levelNumber) === levelNum && e.passed,
    )

    const unlockedAt = matchedBadge?.unlockedAt || matchedExam?.attemptDateTime || null
    const imageUrl = matchedBadge?.imageUrl || null

    return {
      level: levelNum,
      title,
      badgeName: `CAMT AI ${title} Badge`,
      description: `Official CAMT Passport certification recognizing student competency and privileges at Level ${levelNum}.`,
      passingScore: 70 + (levelNum - 1) * 5,
      isUnlocked,
      unlockedAt,
      imageUrl,
      badgeBgClass: badgeIcons[levelNum]?.bgClass || 'bg-slate-100 text-slate-700 border-slate-300',
    }
  })
})

function openBadgeModal(badge: BadgeCardItem) {
  selectedBadge.value = badge
}

function closeBadgeModal() {
  selectedBadge.value = null
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scaleUp 0.18s ease-out;
}
</style>
