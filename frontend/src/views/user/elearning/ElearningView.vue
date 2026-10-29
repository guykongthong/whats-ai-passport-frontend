<template>
  <UserPageLayout>
    <main class="flex-1 w-full bg-[#EEF2F7] px-4 sm:px-6 lg:px-8 py-8">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <!-- Top Navigation / Breadcrumb -->
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
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
            :class="getLevelClasses(currentLevelNumber)"
          >
            <span>Level {{ currentLevelNumber }}: {{ getLevelName(currentLevelNumber) }}</span>
          </span>
        </div>

        <!-- Video Player Section (FE-USER-15) -->
        <section
          aria-label="Video Player Section"
          class="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-5"
        >
          <!-- Video Frame Container (16:9 Aspect Ratio) -->
          <div class="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <!-- Loading Skeleton -->
            <div
              v-if="isLoading"
              class="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white gap-3 animate-pulse"
            >
              <div class="size-10 rounded-full border-3 border-white/20 border-t-white animate-spin" />
              <span class="text-xs font-medium text-slate-300">Loading lesson video...</span>
            </div>

            <!-- YouTube / Iframe Player -->
            <iframe
              v-else-if="activeEmbedUrl"
              :src="activeEmbedUrl"
              title="eLearning Video Player"
              class="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />

            <!-- Direct HTML5 Video Player -->
            <video
              v-else-if="isHtml5Video"
              :src="activeVideo?.videoUrl"
              controls
              playsinline
              class="size-full object-contain"
            >
              Your browser does not support the video tag.
            </video>

            <!-- Fallback External Link Player Card -->
            <div
              v-else-if="activeVideo"
              class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-[#002d4f] p-6 text-center text-white"
            >
              <div class="size-16 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-xs mb-3 ring-1 ring-white/20">
                <svg class="size-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h4 class="text-base sm:text-lg font-bold max-w-md">
                {{ activeVideo.title }}
              </h4>
              <p class="text-xs text-slate-300 mt-1.5 max-w-sm line-clamp-2">
                {{ activeVideo.description || 'Watch the lecture video on external source.' }}
              </p>
              <a
                :href="activeVideo.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Open Lesson Video</span>
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <!-- Empty State when no videos -->
            <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center"
            >
              <svg class="size-12 text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-sm font-semibold text-slate-300">No video selected</p>
              <p class="text-xs text-slate-500 mt-1">Select a lesson to begin watching.</p>
            </div>
          </div>

          <!-- Active Lesson Header & Metadata Details -->
          <div v-if="activeVideo" class="space-y-3 pt-2">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-[#00385A] text-white text-[11px] font-bold">
                  Lesson {{ currentVideoIndex + 1 }}
                </span>
                <span class="text-xs text-slate-400">
                  Level {{ currentLevelNumber }} Curriculum
                </span>
              </div>
            </div>

            <h2 class="text-xl sm:text-2xl font-extrabold text-[#00385A] tracking-tight">
              {{ activeVideo.title }}
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {{ activeVideo.description || 'Comprehensive video instruction designed to prepare students for the level competency examination.' }}
            </p>
          </div>
        </section>
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ELearningService, { type VideoItem, type UserVideosResponse } from '@/services/ELearningService'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { eLearningVideos } from '@/data/eLearning'

const userStore = useUserStore()

const isLoading = ref(false)
const videos = ref<VideoItem[]>([])
const currentVideoIndex = ref(0)

const currentLevelNumber = computed<number>(() => userStore.currentUserLevel || 1)

const activeVideo = computed<VideoItem | null>(() => {
  return videos.value[currentVideoIndex.value] ?? null
})

// Embed URL computation (YouTube vs HTML5 vs external)
const activeEmbedUrl = computed<string | null>(() => {
  const url = activeVideo.value?.videoUrl
  if (!url) return null

  // Check YouTube pattern
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  const match = url.match(ytRegex)
  if (match) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0`
  }

  return null
})

const isHtml5Video = computed<boolean>(() => {
  const url = activeVideo.value?.videoUrl
  if (!url) return false
  return /\.(mp4|webm|ogg)$/i.test(url)
})

async function fetchLevelVideos() {
  isLoading.value = true
  try {
    const res = await ELearningService.getCurrentLevelVideos()
    if (res?.data) {
      if ('videos' in res.data && Array.isArray((res.data as UserVideosResponse).videos)) {
        videos.value = (res.data as UserVideosResponse).videos
      } else if (Array.isArray(res.data)) {
        videos.value = res.data.map((v, idx) => ({
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

  // Fallback to local mock data if backend returned empty
  if (videos.value.length === 0) {
    const currentLvlStr = String(currentLevelNumber.value)
    const filtered = eLearningVideos.filter((v) => v.level === currentLvlStr)
    videos.value = filtered.map((v, idx) => ({
      id: idx + 1,
      title: v.title,
      description: `Fundamental lesson exploring ${v.title.toLowerCase()} for Level ${currentLvlStr}.`,
      videoUrl: v.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    }))
  }

  if (currentVideoIndex.value >= videos.value.length) {
    currentVideoIndex.value = 0
  }
}

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
  await fetchLevelVideos()
})
</script>
