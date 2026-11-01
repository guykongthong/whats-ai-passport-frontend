<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col items-center">
      <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
        
        <!-- Top Navigation Bar & Current Level Tag -->
        <div class="flex items-center justify-between">
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#00385A] transition-colors"
          >
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </RouterLink>

          <!-- Current Level Badge -->
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
            :class="getLevelClasses(currentLevelNumber)"
          >
            Level {{ currentLevelNumber }}: {{ getLevelName(currentLevelNumber) }}
          </span>
        </div>

        <!-- Level Transition Alert -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="levelTransitionAlert"
            class="flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs"
          >
            <div class="flex items-center gap-3">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                <CheckCircleIcon class="size-4" />
              </span>
              <p class="text-xs sm:text-sm font-semibold">
                {{ levelTransitionAlert }}
              </p>
            </div>
            <button
              type="button"
              @click="levelTransitionAlert = null"
              class="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 rounded-md hover:bg-emerald-100/60 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </transition>

        <!-- Course Header Info -->
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            The CA?T Passport Training Program
          </h1>
          <p class="text-xs sm:text-sm text-slate-500">
            Essential eLearning modules for Level {{ currentLevelNumber }} ({{ getLevelName(currentLevelNumber) }}) competency advancement.
          </p>
        </div>

        <!-- Video Player Section (16:9 Aspect Ratio) -->
        <section
          aria-label="Video Player Section"
          class="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm"
        >
          <div class="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950 shadow-inner">
            <!-- Loading Skeleton -->
            <div
              v-if="isLoading"
              class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-3 animate-pulse"
            >
              <div class="size-9 rounded-full border-3 border-white/20 border-t-white animate-spin" />
              <span class="text-xs font-medium text-slate-300">Loading lesson video...</span>
            </div>

            <!-- YouTube / Iframe Player -->
            <iframe
              v-else-if="activeEmbedUrl && isPlayingVideo"
              :src="activeEmbedUrl"
              title="eLearning Video Player"
              class="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />

            <!-- Direct HTML5 Video Player -->
            <video
              v-else-if="isHtml5Video && isPlayingVideo"
              :src="activeVideo?.videoUrl"
              controls
              autoplay
              playsinline
              class="size-full object-contain"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Video Poster / Preview Player Interface (Matching reference image) -->
            <div
              v-else
              class="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950 p-4 sm:p-6 text-white select-none"
            >
              <!-- Top bar watermark -->
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-medium bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  The CA?T Passport Platform
                </span>
                <span class="font-semibold text-slate-300">
                  Level {{ currentLevelNumber }} Module
                </span>
              </div>

              <!-- Center Big Play Button -->
              <div class="flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  @click="startPlaying"
                  class="group flex size-16 sm:size-20 items-center justify-center rounded-full bg-[#00385A]/90 hover:bg-[#002d4a] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white/20"
                  aria-label="Play Lesson Video"
                >
                  <PlayIcon class="size-8 sm:size-9 ml-1 text-white group-hover:scale-110 transition-transform" />
                </button>
                <span class="text-xs sm:text-sm font-semibold text-slate-200 drop-shadow-sm">
                  Click to start lesson
                </span>
              </div>

              <!-- Bottom Video Controls Mock Bar -->
              <div class="space-y-2 bg-gradient-to-t from-black/80 to-transparent pt-4">
                <div class="flex items-center justify-between text-xs text-slate-300">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      @click="startPlaying"
                      class="hover:text-white transition-colors cursor-pointer"
                      title="Play"
                    >
                      <svg class="size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                    <span class="text-[11px] font-mono text-slate-400">
                      {{ playbackTime }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-sky-400">
                      {{ progressPercentage }}%
                    </span>
                  </div>
                </div>

                <!-- Scrubber Progress Bar -->
                <div
                  class="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden cursor-pointer"
                  @click="seekProgress"
                >
                  <div
                    class="h-full bg-[#005a92] rounded-full transition-all duration-300"
                    :style="{ width: progressPercentage + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Playback Progress & Control Bar (Always visible) -->
          <div class="mt-3 rounded-xl bg-slate-900 px-4 py-3 text-white flex flex-col gap-2.5 shadow-sm">
            <div class="flex items-center justify-between text-xs text-slate-300">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="togglePlayPause"
                  class="flex items-center justify-center size-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  :title="isPlayingVideo ? 'Pause' : 'Play'"
                >
                  <svg v-if="isPlayingVideo" class="size-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                  <svg v-else class="size-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <span class="text-xs font-mono font-medium text-slate-200">
                  {{ playbackTime }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-[11px] font-semibold text-slate-400">
                  Lesson {{ currentVideoIndex + 1 }} of {{ rawVideos.length }}
                </span>
                <span class="text-xs font-mono font-bold text-sky-400">
                  {{ progressPercentage }}%
                </span>
              </div>
            </div>

            <!-- Interactive Scrubber Progress Bar -->
            <div
              class="relative h-2 w-full rounded-full bg-slate-700/80 overflow-hidden cursor-pointer"
              @click="seekProgress"
              title="Click to seek playback"
            >
              <div
                class="h-full bg-gradient-to-r from-sky-500 to-[#005a92] rounded-full transition-all duration-150"
                :style="{ width: progressPercentage + '%' }"
              />
            </div>
          </div>

          <!-- Active Lesson Title & Details (Directly Below Video) -->
          <div v-if="activeVideo" class="mt-4 px-2 pb-1 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Module {{ currentVideoIndex + 1 }}: {{ activeVideo.title }}
              </h2>

              <!-- Action: Mark Completed & Unlock Next Lesson -->
              <button
                type="button"
                @click="completeCurrentAndNext"
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
              >
                <CheckCircleIcon class="size-4 text-white" />
                <span>{{ currentVideoIndex < rawVideos.length - 1 ? 'Mark Complete & Next Lesson →' : 'Complete All Lessons' }}</span>
              </button>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ activeVideo.description || 'Understanding core AI literacy principles, responsible prompting, and practical workflows for The CA?T Passport.' }}
            </p>
          </div>
        </section>

        <!-- Curriculum Section (Vertical Stack Matching Reference Image) -->
        <section aria-label="Course Curriculum" class="space-y-4 pt-2">
          <!-- Overall Curriculum Progress Summary -->
          <div class="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-2.5 shadow-2xs">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-slate-900">
                  Curriculum Progress
                </h3>
                <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#00385A]">
                  Level {{ currentLevelNumber }}
                </span>
              </div>
              <span class="font-bold text-[#00385A]">
                {{ completedIndices.length }} / {{ curriculumLessons.length }} Completed ({{ overallCurriculumPercent }}%)
              </span>
            </div>
            <!-- Overall Curriculum Progress Bar -->
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full bg-emerald-600 rounded-full transition-all duration-500"
                :style="{ width: overallCurriculumPercent + '%' }"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">
              Curriculum Lessons
            </h3>
            <span class="text-xs font-semibold text-slate-500">
              {{ curriculumLessons.length }} Lessons Total
            </span>
          </div>

          <!-- Lessons List -->
          <div class="space-y-3">
            <div
              v-for="(lesson, idx) in curriculumLessons"
              :key="lesson.id ?? idx"
              class="rounded-xl border transition-all p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              :class="[
                idx === currentVideoIndex
                  ? 'bg-white border-[#00385A] border-l-4 shadow-sm'
                  : completedIndices.includes(idx)
                    ? 'bg-white border-slate-200/90 hover:border-slate-300'
                    : 'bg-white border-slate-200/70 hover:border-slate-300'
              ]"
              @click="selectVideo(idx)"
            >
              <!-- Left Icon & Lesson Details -->
              <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <!-- Status Circle Icon -->
                <div
                  class="size-10 sm:size-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  :class="[
                    completedIndices.includes(idx)
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : idx === currentVideoIndex
                        ? 'border-2 border-[#00385A] text-[#00385A] bg-blue-50/50'
                        : 'bg-slate-100 text-slate-500'
                  ]"
                >
                  <!-- Completed Icon -->
                  <CheckCircleIcon
                    v-if="completedIndices.includes(idx)"
                    class="size-6 text-white"
                  />
                  <!-- In Progress Play Icon -->
                  <PlayIcon
                    v-else-if="idx === currentVideoIndex"
                    class="size-4 ml-0.5 text-[#00385A]"
                  />
                  <!-- Ready Play Icon -->
                  <PlayIcon
                    v-else
                    class="size-4 ml-0.5 text-slate-400"
                  />
                </div>

                <!-- Text Info -->
                <div class="min-w-0">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    LESSON {{ idx + 1 }}
                  </span>
                  <h4
                    class="text-xs sm:text-sm font-bold truncate mt-0.5 text-slate-900"
                  >
                    {{ lesson.title }}
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{{ lesson.duration || '30 mins' }}</span>
                    <span>&bull;</span>
                    <span
                      class="font-semibold"
                      :class="[
                        completedIndices.includes(idx)
                          ? 'text-emerald-700'
                          : idx === currentVideoIndex
                            ? 'text-[#00385A]'
                            : 'text-slate-500'
                      ]"
                    >
                      {{ completedIndices.includes(idx) ? 'Completed' : idx === currentVideoIndex ? (isPlayingVideo ? 'In Progress' : 'Paused') : 'Ready to start' }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Right Action Button -->
              <div class="shrink-0" @click.stop>
                <button
                  type="button"
                  @click="selectVideo(idx)"
                  class="px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                  :class="[
                    completedIndices.includes(idx)
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : idx === currentVideoIndex
                        ? 'bg-[#00385A] hover:bg-[#002840] ring-2 ring-[#00385A]/30'
                        : 'bg-slate-700 hover:bg-slate-800'
                  ]"
                >
                  <svg v-if="idx === currentVideoIndex && isPlayingVideo" class="size-3.5 animate-pulse text-sky-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                  <svg v-else class="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>{{ completedIndices.includes(idx) ? 'Watch again' : idx === currentVideoIndex ? (isPlayingVideo ? 'Playing' : 'Resume') : 'Start Lesson' }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Bottom Action CTA Button: Take Certification Exam -->
        <div class="pt-6 pb-12 flex flex-col items-center justify-center gap-2">
          <RouterLink
            v-if="currentLevelNumber < 4"
            to="/exam"
            class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#00385A] hover:bg-[#002840] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <DocumentTextIcon class="size-4" />
            <span>Take Certification Exam</span>
          </RouterLink>

          <!-- Level 4 Master Notice -->
          <div
            v-else
            class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-bold shadow-2xs"
          >
            <TrophyIcon class="size-5 text-amber-700" />
            <span>Level 4 Master Achieved — All Curriculum Modules Completed</span>
          </div>
        </div>

      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/authStore'
import ELearningService, { type VideoItem, type UserVideosResponse } from '@/services/ELearningService'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { eLearningVideos } from '@/data/eLearning'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon.vue'
import PlayIcon from '@/shared/components/icons/PlayIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'

interface LessonViewItem extends VideoItem {
  duration?: string
  status: 'completed' | 'in-progress' | 'ready'
}

const userStore = useUserStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const rawVideos = ref<VideoItem[]>([])
const currentVideoIndex = ref(0)
const completedIndices = ref<number[]>([])
const isPlayingVideo = ref(false)
const levelTransitionAlert = ref<string | null>(null)
const currentPlaybackSeconds = ref(0)
let playbackInterval: ReturnType<typeof setInterval> | null = null

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)

// Storage key to persist completed e-learning lessons per user & level
function getStorageKey(): string {
  const uid = userStore.userProfile?.id || authStore.currentUser?.id || 'guest'
  return `elearning_completed_${uid}_lvl${currentLevelNumber.value}`
}

function loadCompletedLessons() {
  try {
    const saved = localStorage.getItem(getStorageKey())
    if (saved) {
      completedIndices.value = JSON.parse(saved)
    } else {
      completedIndices.value = []
    }
  } catch {
    completedIndices.value = []
  }
}

function saveCompletedLessons() {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(completedIndices.value))
  } catch {
    // ignore
  }
}

// Fallback high-quality playable YouTube AI educational videos
const PLAYABLE_AI_VIDEOS: Record<number, string[]> = {
  1: [
    'https://www.youtube.com/watch?v=JMUxmLyrhSk', // Intro to AI & LLMs
    'https://www.youtube.com/watch?v=jC4v5AS4RIM', // Prompt Engineering
    'https://www.youtube.com/watch?v=bEj301dD2jE', // Responsible AI & Ethics
    'https://www.youtube.com/watch?v=aircAruvnKk', // How Neural Networks Learn
    'https://www.youtube.com/watch?v=ukzFI9rgwfU', // Machine Learning Foundations
  ],
  2: [
    'https://www.youtube.com/watch?v=ukzFI9rgwfU', // ML Basics
    'https://www.youtube.com/watch?v=2eWuYf-aZE4', // Data Privacy
    'https://www.youtube.com/watch?v=e-gwvmhyU54', // Fine-tuning Models
    'https://www.youtube.com/watch?v=gV0_raKR2UQ', // Model Reliability & Bias
    'https://www.youtube.com/watch?v=T-D1OfcDW1M', // Distributed Workflows
  ],
  3: [
    'https://www.youtube.com/watch?v=T-D1OfcDW1M', // Vector Search & RAG
    'https://www.youtube.com/watch?v=H74tPjA7F8w', // Benchmark Testing
    'https://www.youtube.com/watch?v=bEj301dD2jE', // AI Governance Audits
    'https://www.youtube.com/watch?v=ukzFI9rgwfU', // GPU Computing
    'https://www.youtube.com/watch?v=JMUxmLyrhSk', // Advanced Multimodal
  ],
  4: [
    'https://www.youtube.com/watch?v=T-D1OfcDW1M', // Enterprise Architecture
    'https://www.youtube.com/watch?v=H74tPjA7F8w', // Model Serving & Scale
    'https://www.youtube.com/watch?v=aircAruvnKk', // Next-Gen Alignment
    'https://www.youtube.com/watch?v=jC4v5AS4RIM', // Enterprise Mentoring
    'https://www.youtube.com/watch?v=bEj301dD2jE', // Global AI Policy
  ],
}

function resolvePlayableUrl(url: string | undefined, idx: number, level: number): string {
  if (url && !url.includes('example.com') && (url.includes('youtube') || url.includes('youtu.be') || /\.(mp4|webm)$/i.test(url))) {
    return url
  }
  const defaultList = PLAYABLE_AI_VIDEOS[1] ?? ['https://www.youtube.com/watch?v=JMUxmLyrhSk']
  const levelList = PLAYABLE_AI_VIDEOS[level] ?? defaultList
  return levelList[idx % levelList.length] ?? defaultList[0] ?? 'https://www.youtube.com/watch?v=JMUxmLyrhSk'
}

// Map raw videos into curriculum lessons - all lessons accessible & unlocked!
const curriculumLessons = computed<LessonViewItem[]>(() => {
  return rawVideos.value.map((v, idx) => {
    let status: 'completed' | 'in-progress' | 'ready' = 'ready'
    if (completedIndices.value.includes(idx)) {
      status = 'completed'
    } else if (idx === currentVideoIndex.value) {
      status = 'in-progress'
    } else {
      status = 'ready'
    }

    const defaultDurations = ['25 mins', '30 mins', '20 mins', '35 mins', '45 mins']
    const duration = v.description?.match(/(\d+\s*mins)/i)?.[1] || defaultDurations[idx % defaultDurations.length]

    return {
      ...v,
      duration,
      status,
    }
  })
})

const overallCurriculumPercent = computed<number>(() => {
  if (curriculumLessons.value.length === 0) return 0
  return Math.round((completedIndices.value.length / curriculumLessons.value.length) * 100)
})

const activeVideo = computed<LessonViewItem | null>(() => {
  return curriculumLessons.value[currentVideoIndex.value] ?? null
})

const activeVideoDuration = computed<string>(() => {
  return activeVideo.value?.duration || '30 mins'
})

function parseDurationSeconds(durationStr: string): number {
  const match = durationStr.match(/(\d+)\s*mins?/i)
  if (match && match[1]) {
    return parseInt(match[1], 10) * 60
  }
  return 1800 // default 30 mins
}

const totalDurationSeconds = computed<number>(() => {
  return parseDurationSeconds(activeVideoDuration.value)
})

function formatSeconds(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = Math.floor(totalSec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

const playbackTime = computed<string>(() => {
  return `${formatSeconds(currentPlaybackSeconds.value)} / ${formatSeconds(totalDurationSeconds.value)}`
})

const progressPercentage = computed<number>(() => {
  if (totalDurationSeconds.value <= 0) return 0
  return Math.min(100, Math.round((currentPlaybackSeconds.value / totalDurationSeconds.value) * 100))
})

function startPlaybackTimer() {
  if (playbackInterval) clearInterval(playbackInterval)
  playbackInterval = setInterval(() => {
    if (isPlayingVideo.value) {
      if (currentPlaybackSeconds.value < totalDurationSeconds.value) {
        currentPlaybackSeconds.value += 1
      } else {
        // Video finished!
        if (!completedIndices.value.includes(currentVideoIndex.value)) {
          completedIndices.value.push(currentVideoIndex.value)
          saveCompletedLessons()
        }
      }
    }
  }, 1000)
}

function stopPlaybackTimer() {
  if (playbackInterval) {
    clearInterval(playbackInterval)
    playbackInterval = null
  }
}

function togglePlayPause() {
  if (isPlayingVideo.value) {
    isPlayingVideo.value = false
    stopPlaybackTimer()
  } else {
    isPlayingVideo.value = true
    startPlaybackTimer()
  }
}

function seekProgress(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  if (!target) return
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  currentPlaybackSeconds.value = Math.round(ratio * totalDurationSeconds.value)
  isPlayingVideo.value = true
  startPlaybackTimer()
}

function completeCurrentAndNext() {
  if (!completedIndices.value.includes(currentVideoIndex.value)) {
    completedIndices.value.push(currentVideoIndex.value)
    saveCompletedLessons()
  }
  if (currentVideoIndex.value < rawVideos.value.length - 1) {
    currentVideoIndex.value += 1
    currentPlaybackSeconds.value = 0
    isPlayingVideo.value = true
    startPlaybackTimer()
  }
}

// YouTube Embed helper - Guaranteed working embed URL
const activeEmbedUrl = computed<string | null>(() => {
  const rawUrl = activeVideo.value?.videoUrl
  const resolved = resolvePlayableUrl(rawUrl, currentVideoIndex.value, currentLevelNumber.value)

  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  const match = resolved.match(ytRegex)
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`
  }

  if (rawUrl && rawUrl.includes('example.com')) {
    if (rawUrl.includes('first-prompt')) {
      return 'https://www.youtube-nocookie.com/embed/aircAruvnKk?autoplay=1&rel=0'
    }
    if (rawUrl.includes('intro-to-ai') || rawUrl.includes('l1')) {
      return 'https://www.youtube-nocookie.com/embed/ukzFI9rgwfU?autoplay=1&rel=0'
    }
    return 'https://www.youtube-nocookie.com/embed/HQnC3411xYg?autoplay=1&rel=0'
  }

  return 'https://www.youtube-nocookie.com/embed/JMUxmLyrhSk?autoplay=1&rel=0'
})

const isHtml5Video = computed<boolean>(() => {
  const url = activeVideo.value?.videoUrl
  if (!url || url.includes('example.com')) return false
  return /\.(mp4|webm|ogg)$/i.test(url)
})

function selectVideo(index: number) {
  if (index >= 0 && index < rawVideos.value.length) {
    currentVideoIndex.value = index
    currentPlaybackSeconds.value = 0
    isPlayingVideo.value = true
    startPlaybackTimer()
  }
}

function startPlaying() {
  isPlayingVideo.value = true
  startPlaybackTimer()
}

async function fetchLevelVideos() {
  isLoading.value = true
  loadCompletedLessons()
  try {
    const res = await ELearningService.getCurrentLevelVideos()
    if (res?.data) {
      if ('videos' in res.data && Array.isArray((res.data as UserVideosResponse).videos)) {
        rawVideos.value = (res.data as UserVideosResponse).videos
      } else if (Array.isArray(res.data)) {
        rawVideos.value = res.data.map((v, idx) => ({
          id: (v as { id?: number | string }).id ?? idx + 1,
          title: v.title,
          description: (v as { description?: string }).description || '',
          videoUrl: (v as { videoUrl?: string; url?: string }).videoUrl || (v as { url?: string }).url || '',
        }))
      }
    }
  } catch (err: unknown) {
    console.info('Backend getCurrentLevelVideos offline, fallback to mock data:', err)
  } finally {
    isLoading.value = false
  }

  // Fallback to local course curriculum if API response is empty
  if (rawVideos.value.length === 0) {
    const currentLvlStr = String(currentLevelNumber.value)
    const filtered = eLearningVideos.filter((v) => v.level === currentLvlStr)
    rawVideos.value = filtered.map((v, idx) => ({
      id: idx + 1,
      title: v.title,
      description: v.description || `Core course module for Level ${currentLvlStr}.`,
      videoUrl: resolvePlayableUrl(v.url, idx, currentLevelNumber.value),
    }))
  } else {
    // Map any backend seeded example.com URLs to real playable YouTube videos
    rawVideos.value = rawVideos.value.map((v, idx) => ({
      ...v,
      videoUrl: resolvePlayableUrl(v.videoUrl, idx, currentLevelNumber.value),
    }))
  }

  // Seamlessly bridge any custom lessons added through Admin E-Learning portal for this level
  try {
    if (typeof localStorage !== 'undefined') {
      const rawLocal = localStorage.getItem('admin_elearning_videos_v1')
      if (rawLocal) {
        const parsedLocal = JSON.parse(rawLocal)
        if (Array.isArray(parsedLocal)) {
          const extraForLevel = parsedLocal.filter((v) => Number(v.level) === currentLevelNumber.value)
          for (const extra of extraForLevel) {
            if (!rawVideos.value.some((existing) => existing.videoUrl === extra.videoUrl || existing.title === extra.title)) {
              rawVideos.value.push({
                id: extra.id || `local-${Date.now()}`,
                title: extra.title,
                description: extra.description || '',
                videoUrl: resolvePlayableUrl(extra.videoUrl, rawVideos.value.length, currentLevelNumber.value),
              })
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // Start at the first uncompleted lesson in the list
  const firstUncompleted = rawVideos.value.findIndex((_, i) => !completedIndices.value.includes(i))
  currentVideoIndex.value = firstUncompleted >= 0 ? firstUncompleted : 0
  currentPlaybackSeconds.value = 0
}

// Watch for level upgrades
watch(
  () => userStore.currentUserLevel,
  async (newLevel, oldLevel) => {
    if (newLevel && oldLevel && newLevel !== oldLevel) {
      const levelName = getLevelName(newLevel)
      levelTransitionAlert.value = `Level updated to Level ${newLevel}: ${levelName}! Curriculum refreshed.`
      currentVideoIndex.value = 0
      isPlayingVideo.value = false
      stopPlaybackTimer()
      await fetchLevelVideos()
    }
  }
)

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  await fetchLevelVideos()
})

onUnmounted(() => {
  stopPlaybackTimer()
})
</script>
