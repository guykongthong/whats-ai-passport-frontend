<template>
  <AdminPageLayout title="e-Learning Management" main-padding="!max-w-[1400px] px-4 sm:px-8">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="w-full flex flex-col gap-6 -mt-3">
      <!-- Subheader & Quick Summary -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 gap-4">
        <div>
          <p class="text-xs sm:text-sm text-white/80">
            Publish and manage curriculum lecture videos and eLearning courses for certification levels.
          </p>
          <p class="text-[11px] text-white/60 mt-0.5">
            Students in Levels 2, 3, and 4 access these video lessons to prepare for level upgrade examinations.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/90">
            {{ filteredVideos.length }} Lessons Available
          </span>
        </div>
      </div>

      <!-- Main Layout: 2 Columns on Desktop (Form on Left / Playlist Catalog on Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column: Video Creation Form (5 Cols) -->
        <div class="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl text-white flex flex-col gap-5">
          <div class="pb-3 border-b border-white/10">
            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <svg class="size-5 text-[#C1D7AE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Add eLearning Lesson</span>
            </h3>
            <p class="text-xs text-white/60 mt-0.5">Fill out lesson title, description, URL, and target level.</p>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <!-- 1. Content / Course Title -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs sm:text-sm font-bold text-white">
                Course / Lesson Title <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Understanding Machine Learning Basics"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-white/10 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-sm transition-colors"
                @input="errors.title = ''"
              />
              <span v-if="errors.title" class="text-xs text-rose-300 font-medium">{{ errors.title }}</span>
            </div>

            <!-- 2. Target Level Selection (Level 1, 2, 3, 4) -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs sm:text-sm font-bold text-white">
                Curriculum Level <span class="text-rose-400">*</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="lvl in targetLevels"
                  :key="lvl.level"
                  type="button"
                  :class="[
                    'py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none',
                    form.level === lvl.level
                      ? 'bg-white/25 border-white text-white shadow-sm ring-1 ring-white/50'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
                  ]"
                  @click="form.level = lvl.level"
                >
                  <span class="text-xs font-extrabold">Level {{ lvl.level }}</span>
                  <span class="text-[10px] opacity-80 font-normal">({{ lvl.name }})</span>
                </button>
              </div>
            </div>

            <!-- 3. Video URL -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs sm:text-sm font-bold text-white">
                Video URL <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="form.videoUrl"
                type="url"
                placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4"
                class="w-full px-3.5 py-2.5 rounded-xl border bg-white/10 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-sm transition-colors"
                @input="errors.videoUrl = ''"
              />
              <span v-if="errors.videoUrl" class="text-xs text-rose-300 font-medium">{{ errors.videoUrl }}</span>
            </div>

            <!-- Live Video Preview Player Container -->
            <div v-if="previewEmbedUrl" class="flex flex-col gap-1.5 mt-1">
              <span class="text-[11px] font-semibold text-white/70">Video Preview</span>
              <div class="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-white/20 shadow-md">
                <iframe
                  :src="previewEmbedUrl"
                  title="Lesson Preview"
                  class="size-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>
            </div>

            <!-- 4. Content Description -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs sm:text-sm font-bold text-white">
                Content Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Provide a comprehensive summary of this lesson to assist students in preparing for the exam..."
                class="w-full px-3.5 py-2.5 rounded-xl border bg-white/10 border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 text-sm transition-colors resize-none"
              />
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t border-white/10 flex items-center justify-end gap-3 mt-1">
              <button
                type="button"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer select-none"
                @click="resetForm"
              >
                Reset
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#C1D7AE] hover:bg-[#b0cb99] text-[#00385e] shadow-md transition-all cursor-pointer flex items-center gap-1.5 select-none active:scale-95"
              >
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Publish Lesson</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column: Video Catalog Table / Cards (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Filter Tabs: [ All Levels ] | [ Level 2 ] | [ Level 3 ] | [ Level 4 ] -->
          <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md overflow-x-auto">
            <button
              type="button"
              :class="[
                'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap',
                selectedFilterLevel === null
                  ? 'bg-white/20 text-white border border-white/30 shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent',
              ]"
              @click="selectedFilterLevel = null"
            >
              All Levels ({{ lessonVideos.length }})
            </button>
            <button
              v-for="lvl in targetLevels"
              :key="lvl.level"
              type="button"
              :class="[
                'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5',
                selectedFilterLevel === lvl.level
                  ? 'bg-white/20 text-white border border-white/30 shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent',
              ]"
              @click="selectedFilterLevel = lvl.level"
            >
              <span
                :class="[
                  'size-2 rounded-full',
                  lvl.level === 2 ? 'bg-[#F2D794]' : (lvl.level === 3 ? 'bg-[#E5A88B]' : 'bg-[#DD898E]'),
                ]"
              />
              <span>Level {{ lvl.level }} ({{ getLevelCount(lvl.level) }})</span>
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-if="filteredVideos.length === 0"
            class="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center text-white flex flex-col items-center justify-center gap-3 shadow-xl"
          >
            <svg class="size-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p class="font-bold text-base">No eLearning lessons found</p>
            <p class="text-xs text-white/60">No videos configured for this level yet. Use the form on the left to add one.</p>
          </div>

          <!-- Lessons List -->
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="video in filteredVideos"
              :key="video.id"
              class="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.12] transition-all"
            >
              <div class="flex items-start gap-3.5 min-w-0">
                <div class="size-10 sm:size-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#C1D7AE]">
                  <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs select-none',
                        getLevelClasses(video.level),
                      ]"
                    >
                      Level {{ video.level }}: {{ getLevelName(video.level) }}
                    </span>
                    <h4 class="text-sm sm:text-base font-bold text-white truncate">
                      {{ video.title }}
                    </h4>
                  </div>
                  <p class="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed">
                    {{ video.description || 'Curriculum video lecture for exam preparation.' }}
                  </p>
                  <a
                    :href="video.videoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[11px] text-cyan-300 hover:text-cyan-200 hover:underline inline-flex items-center gap-1 mt-1 font-mono truncate"
                  >
                    <span>{{ video.videoUrl }}</span>
                    <svg class="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  class="size-9 rounded-xl flex items-center justify-center bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer shadow-xs hover:scale-105"
                  title="Delete Video Lesson"
                  aria-label="Delete Video Lesson"
                  @click="deleteVideo(video.id)"
                >
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import { useToast } from '@/composables/useToast'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'
import { eLearningVideos } from '@/data/eLearning'
import ELearningService from '@/services/ELearningService'

interface AdminVideoRecord {
  id: string | number
  level: number
  title: string
  description: string
  videoUrl: string
}

const targetLevels = [
  { level: 1, name: 'Explorer' },
  { level: 2, name: 'Achiever' },
  { level: 3, name: 'Innovator' },
  { level: 4, name: 'Master' },
]

const { showToast, toastMessage, triggerToast } = useToast()

const selectedFilterLevel = ref<number | null>(null)

const form = reactive({
  title: '',
  description: '',
  videoUrl: '',
  level: 2,
})

const errors = reactive({
  title: '',
  videoUrl: '',
})

const STORAGE_KEY = 'admin_elearning_videos_v1'

const lessonVideos = ref<AdminVideoRecord[]>([])

const isSaving = ref(false)

async function loadInitialVideos() {
  try {
    const res = await ELearningService.adminGetVideos()
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      lessonVideos.value = res.data.map((v, idx) => ({
        id: v.id ?? `server-${idx + 1}`,
        level: (v as unknown as { level?: number }).level || 1,
        title: v.title,
        description: v.description || '',
        videoUrl: v.videoUrl,
      }))
      saveToStorage()
      return
    }
  } catch (err) {
    console.info('Backend adminGetVideos offline, loading from local cache:', err)
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        lessonVideos.value = parsed
        return
      }
    }
  } catch (err) {
    console.warn('Failed to parse localStorage elearning videos:', err)
  }

  // Fallback to seed data from user side eLearning videos
  lessonVideos.value = eLearningVideos
    .filter((v) => Number(v.level) >= 1)
    .map((v, idx) => ({
      id: `seed-${idx + 1}`,
      level: Number(v.level) || 1,
      title: v.title,
      description: `Comprehensive video instruction for Level ${v.level} certification curriculum.`,
      videoUrl: v.url.startsWith('http') ? v.url : `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
    }))
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessonVideos.value))
  } catch (err) {
    console.warn('Failed to save elearning videos to storage:', err)
  }
}

const filteredVideos = computed(() => {
  if (selectedFilterLevel.value === null) {
    return lessonVideos.value
  }
  return lessonVideos.value.filter((v) => v.level === selectedFilterLevel.value)
})

function getLevelCount(levelNumber: number): number {
  return lessonVideos.value.filter((v) => v.level === levelNumber).length
}

const previewEmbedUrl = computed<string | null>(() => {
  const url = form.videoUrl.trim()
  if (!url) return null
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
  }
  return null
})

function resetForm() {
  form.title = ''
  form.description = ''
  form.videoUrl = ''
  form.level = 2
  errors.title = ''
  errors.videoUrl = ''
}

async function handleSubmit() {
  errors.title = ''
  errors.videoUrl = ''

  if (!form.title.trim()) {
    errors.title = 'Course or content title is required.'
    return
  }
  if (!form.videoUrl.trim()) {
    errors.videoUrl = 'Video URL is required.'
    return
  }

  isSaving.value = true
  try {
    const res = await ELearningService.adminCreateVideo({
      level: form.level,
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl.trim(),
    })

    const newLesson: AdminVideoRecord = {
      id: res?.data?.id ?? `server-${Date.now()}`,
      level: form.level,
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl.trim(),
    }

    lessonVideos.value.unshift(newLesson)
    saveToStorage()
    triggerToast(`Level ${form.level} eLearning lesson published to server successfully!`)
    resetForm()
  } catch (err) {
    console.warn('Server createVideo offline, storing locally:', err)
    const newLesson: AdminVideoRecord = {
      id: `custom-${Date.now()}`,
      level: form.level,
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl.trim(),
    }

    lessonVideos.value.unshift(newLesson)
    saveToStorage()
    triggerToast(`Level ${form.level} eLearning lesson saved successfully!`)
    resetForm()
  } finally {
    isSaving.value = false
  }
}

async function deleteVideo(id: string | number) {
  try {
    await ELearningService.adminDeleteVideo(id)
  } catch (err) {
    console.info('Backend deleteVideo offline, removing locally:', err)
  }
  lessonVideos.value = lessonVideos.value.filter((v) => v.id !== id)
  saveToStorage()
  triggerToast('Lesson video removed successfully.')
}

onMounted(() => {
  loadInitialVideos()
})
</script>
