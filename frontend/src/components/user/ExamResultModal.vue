<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-result-title"
      >
        <!-- Backdrop with Blur -->
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Confetti Animation Canvas / Elements when Passed (#43) -->
        <div
          v-if="result.passed"
          class="fixed inset-0 pointer-events-none z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div
            v-for="n in 24"
            :key="n"
            class="confetti-particle absolute size-2.5 rounded-xs animate-confetti-fall"
            :style="getConfettiStyle(n)"
          />
        </div>

        <!-- Result Modal Card -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-3"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-3"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6 z-20 text-slate-800"
          >
            <!-- Result Icon Header -->
            <div
              class="size-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-inner transition-transform duration-300 hover:scale-105"
              :class="result.passed ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50' : 'bg-rose-100 text-rose-600 ring-4 ring-rose-50'"
            >
              <span v-if="result.passed">🎉</span>
              <span v-else>📝</span>
            </div>

            <!-- Result Status Headline (#43) -->
            <div class="space-y-1.5">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase"
                :class="result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
              >
                {{ result.passed ? 'CONGRATULATIONS! YOU PASSED' : 'NOT PASSED' }}
              </span>

              <h2
                id="exam-result-title"
                class="text-2xl sm:text-3xl font-black tracking-tight"
                :class="result.passed ? 'text-[#00385A]' : 'text-slate-800'"
              >
                {{ result.passed ? `Welcome to Level ${result.newLevel}!` : 'Keep Practicing!' }}
              </h2>

              <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                <template v-if="result.passed">
                  You have successfully demonstrated competency and unlocked Level {{ result.newLevel }}: {{ newLevelName }}. Your benefits and privileges are upgraded immediately!
                </template>
                <template v-else>
                  Don't worry! Review the eLearning videos for this level and try the advancement exam again whenever you feel ready.
                </template>
              </p>
            </div>

            <!-- Score Summary Details (Score: X / Y - Pass Criteria: Z) (#43) -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Score</span>
                <p class="text-2xl sm:text-3xl font-black text-slate-800 mt-0.5">
                  {{ result.score }} <span class="text-base sm:text-lg font-semibold text-slate-400">/ {{ result.totalScore }}</span>
                </p>
              </div>

              <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Criteria</span>
                <p class="text-2xl sm:text-3xl font-black text-slate-800 mt-0.5">
                  {{ result.passCriteria }} <span class="text-base sm:text-lg font-semibold text-slate-400">Correct</span>
                </p>
              </div>
            </div>

            <!-- Celebrate with Unlocked Badge Card (#43) -->
            <div
              v-if="result.passed && result.badgeUnlocked"
              class="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200/90 flex items-center gap-4 text-left shadow-xs"
            >
              <div class="size-14 sm:size-16 rounded-2xl bg-white p-2 shadow-sm border border-amber-200 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  v-if="result.badgeUnlocked.imageUrl"
                  :src="result.badgeUnlocked.imageUrl"
                  :alt="result.badgeUnlocked.name"
                  class="size-full object-contain"
                />
                <span v-else class="text-3xl">🏅</span>
              </div>

              <div class="min-w-0 flex-1">
                <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                  ★ Badge Unlocked!
                </span>
                <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">
                  {{ result.badgeUnlocked.name }}
                </h4>
                <p class="text-[11px] text-slate-500">
                  Added to your profile achievements
                </p>
              </div>
            </div>

            <!-- Action Buttons (#43) -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <!-- If Passed: "Go to Dashboard" / "View New Benefits" -->
              <template v-if="result.passed">
                <RouterLink
                  to="/dashboard"
                  class="flex-1 py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Go to Dashboard</span>
                </RouterLink>

                <RouterLink
                  to="/profile/services"
                  class="flex-1 py-3 px-5 rounded-xl bg-[#00385A] hover:bg-[#002840] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>View New Benefits</span>
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </RouterLink>
              </template>

              <!-- If Failed: Friendly encouraging message with "Try Again" / "Review eLearning" -->
              <template v-else>
                <button
                  type="button"
                  @click="$emit('retry')"
                  class="flex-1 py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Try Again</span>
                </button>

                <RouterLink
                  to="/elearning"
                  class="flex-1 py-3 px-5 rounded-xl bg-[#00385A] hover:bg-[#002840] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Review eLearning</span>
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </RouterLink>
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { ExamSubmitResponse } from '@/services/ExamService'
import { getLevelName } from '@/utils/levelDisplay'

interface Props {
  isOpen: boolean
  result: ExamSubmitResponse
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'retry'): void
}>()

const newLevelName = computed(() => getLevelName(props.result.newLevel))

function handleBackdropClick() {
  if (props.dismissible) {
    emit('close')
  }
}

function getConfettiStyle(index: number) {
  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6']
  const color = colors[index % colors.length]
  const left = `${(index * 4.16).toFixed(1)}%`
  const delay = `${(index * 0.12).toFixed(2)}s`
  const duration = `${(1.5 + (index % 3) * 0.5).toFixed(2)}s`

  return {
    backgroundColor: color,
    left,
    top: '-20px',
    animationDelay: delay,
    animationDuration: duration,
  }
}
</script>

<style scoped>
@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) rotate(720deg);
    opacity: 0.2;
  }
}

.animate-confetti-fall {
  animation: confettiFall 2.5s ease-out infinite;
}
</style>
