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
                    <button
                      type="button"
                      class="hover:text-white transition-colors"
                      title="Audio"
                    >
                      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
                      </svg>
                    </button>
                    <span class="text-[11px] font-mono text-slate-400">
                      {{ playbackTime }} / {{ activeVideoDuration }}
                    </span>
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-[11px] font-bold border border-white/30 px-1 rounded text-slate-300">
                      CC
                    </span>
                    <svg class="size-4 hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>

                <!-- Scrubber Progress Bar -->
                <div class="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden cursor-pointer">
                  <div
                    class="h-full bg-[#005a92] rounded-full transition-all duration-300"
                    :style="{ width: progressPercentage + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Active Lesson Title & Details (Directly Below Video) -->
          <div v-if="activeVideo" class="mt-4 px-2 pb-1 space-y-1">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Module {{ currentVideoIndex + 1 }}: {{ activeVideo.title }}
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ activeVideo.description || 'Understanding core AI literacy principles, responsible prompting, and practical workflows for The CA?T Passport.' }}
            </p>
          </div>
        </section>

        <!-- Curriculum Section (Vertical Stack Matching Reference Image) -->
        <section aria-label="Course Curriculum" class="space-y-4 pt-2">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">
              Curriculum
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
              class="rounded-xl border transition-all p-4 sm:p-5 flex items-center justify-between gap-4"
              :class="[
                lesson.status === 'in-progress'
                  ? 'bg-white border-slate-300 border-l-4 border-l-[#00385A] shadow-xs'
                  : lesson.status === 'completed'
                    ? 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                    : 'bg-slate-50/70 border-slate-200/70 opacity-70'
              ]"
            >
              <!-- Left Icon & Lesson Details -->
              <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <!-- Status Circle Icon -->
                <div
                  class="size-10 sm:size-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  :class="[
                    lesson.status === 'completed'
                      ? 'bg-[#00385A] text-white shadow-xs'
                      : lesson.status === 'in-progress'
                        ? 'border-2 border-[#00385A] text-[#00385A] bg-blue-50/50'
                        : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  <!-- Completed Icon -->
                  <CheckCircleIcon
                    v-if="lesson.status === 'completed'"
                    class="size-6 text-white"
                  />
                  <!-- In Progress Play Icon -->
                  <PlayIcon
                    v-else-if="lesson.status === 'in-progress'"
                    class="size-4 ml-0.5 text-[#00385A]"
                  />
                  <!-- Locked Icon -->
                  <LockIcon
                    v-else
                    class="size-4 text-slate-500"
                  />
                </div>

                <!-- Text Info -->
                <div class="min-w-0">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    LESSON {{ idx + 1 }}
                  </span>
                  <h4
                    class="text-xs sm:text-sm font-bold truncate mt-0.5"
                    :class="lesson.status === 'locked' ? 'text-slate-600' : 'text-slate-900'"
                  >
                    {{ lesson.title }}
                  </h4>
                  <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{{ lesson.duration || '45 mins' }}</span>
                    <span>&bull;</span>
                    <span
                      class="font-semibold"
                      :class="[
                        lesson.status === 'completed'
                          ? 'text-emerald-700'
                          : lesson.status === 'in-progress'
                            ? 'text-[#00385A]'
                            : 'text-slate-500'
                      ]"
                    >
                      {{ lesson.status === 'completed' ? 'Completed' : lesson.status === 'in-progress' ? 'In Progress' : 'Locked' }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Right Action Button -->
              <div class="shrink-0">
                <button
                  v-if="lesson.status === 'completed'"
                  type="button"
                  @click="selectVideo(idx)"
                  class="px-4 py-2 rounded-lg bg-[#00385A] hover:bg-[#002840] text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  Watch again
                </button>
                <button
                  v-else-if="lesson.status === 'in-progress'"
                  type="button"
                  @click="selectVideo(idx)"
                  class="px-4 py-2 rounded-lg bg-[#00385A] hover:bg-[#002840] text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  Resume
                </button>
                <span
                  v-else
                  class="text-xs font-medium text-slate-400 px-3 py-1.5"
                >
                  Locked
                </span>
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
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ELearningService, { type VideoItem, type UserVideosResponse } from '@/services/ELearningService'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { eLearningVideos } from '@/data/eLearning'
import TrophyIcon from '@/shared/components/icons/TrophyIcon.vue'
import CheckCircleIcon from '@/shared/components/icons/CheckCircleIcon.vue'
import LockIcon from '@/shared/components/icons/LockIcon.vue'
import PlayIcon from '@/shared/components/icons/PlayIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'

interface LessonViewItem extends VideoItem {
  duration?: string
  status: 'completed' | 'in-progress' | 'locked'
}

const userStore = useUserStore()

const isLoading = ref(false)
const rawVideos = ref<VideoItem[]>([])
const currentVideoIndex = ref(0)
const isPlayingVideo = ref(false)
const levelTransitionAlert = ref<string | null>(null)

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)

// Map raw videos into curriculum lessons matching reference states
const curriculumLessons = computed<LessonViewItem[]>(() => {
  return rawVideos.value.map((v, idx) => {
    let status: 'completed' | 'in-progress' | 'locked' = 'locked'
    if (idx < currentVideoIndex.value) {
      status = 'completed'
    } else if (idx === currentVideoIndex.value) {
      status = 'in-progress'
    } else {
      status = 'locked'
    }

    const defaultDurations = ['45 mins', '60 mins', '30 mins', '45 mins']
    const duration = v.description?.match(/(\d+\s*mins)/i)?.[1] || defaultDurations[idx % defaultDurations.length]

    return {
      ...v,
      duration,
      status,
    }
  })
})

const activeVideo = computed<LessonViewItem | null>(() => {
  return curriculumLessons.value[currentVideoIndex.value] ?? null
})

const activeVideoDuration = computed<string>(() => {
  return activeVideo.value?.duration || '45:00'
})

const playbackTime = computed<string>(() => {
  return isPlayingVideo.value ? '28:15' : '12:45'
})

const progressPercentage = computed<number>(() => {
  return isPlayingVideo.value ? 65 : 28
})

// YouTube Embed helper
const activeEmbedUrl = computed<string | null>(() => {
  const url = activeVideo.value?.videoUrl
  if (!url) return null

  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  const match = url.match(ytRegex)
  if (match) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`
  }

  return null
})

const isHtml5Video = computed<boolean>(() => {
  const url = activeVideo.value?.videoUrl
  if (!url) return false
  return /\.(mp4|webm|ogg)$/i.test(url)
})

function selectVideo(index: number) {
  if (index >= 0 && index < rawVideos.value.length) {
    currentVideoIndex.value = index
    isPlayingVideo.value = true
  }
}

function startPlaying() {
  isPlayingVideo.value = true
}

async function fetchLevelVideos() {
  isLoading.value = true
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
      videoUrl: v.url || 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
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
                videoUrl: extra.videoUrl,
              })
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // Set default active to Lesson 2 (In Progress) if multiple lessons exist to match the design reference
  if (rawVideos.value.length > 1 && currentVideoIndex.value === 0) {
    currentVideoIndex.value = 1
  } else if (currentVideoIndex.value >= rawVideos.value.length) {
    currentVideoIndex.value = 0
  }
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
</script>
