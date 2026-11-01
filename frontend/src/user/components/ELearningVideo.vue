<template>
  <!-- Empty State -->
  <div
    v-if="videos.length === 0"
    class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center"
  >
    <VideoOffIcon class="size-12 text-gray-300" />
    <p class="mt-4 text-base font-bold text-gray-700">No content available</p>
    <p class="mt-1 text-sm text-gray-400">
      No e-learning videos are available for your current level.
    </p>
  </div>

  <!-- Main Content -->
  <div v-else>
    <!-- Video Player Placeholder -->
    <div class="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
      <div class="absolute inset-0 flex items-center justify-center bg-gray-300/40">
        <a
          :href="activeVideo?.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex size-14 items-center justify-center rounded-full bg-button-primary/90 text-white shadow-lg transition hover:scale-105 hover:bg-button-primary"
        >
          <PlayIcon class="size-7" />
        </a>
      </div>
    </div>

    <!-- Active Video Info -->
    <div class="pt-5">
      <h2 class="text-2xl font-bold text-gray-900">{{ activeVideo?.title }}</h2>
    </div>

    <!-- Curriculum Section -->
    <div class="pt-2">
      <h3 class="text-xl font-bold text-gray-900">Curriculum</h3>
      <div class="mt-6 flex flex-col gap-4">
      <div
        v-for="(video, index) in videos"
        :key="index"
        class="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-4 py-3 transition"
        :class="
          selectedIndex === index
            ? 'border-button-primary border-l-4'
            : 'border-gray-200 hover:border-gray-300'
        "
        @click="selectedIndex = index"
      >
        <!-- Left: icon + info -->
        <div class="flex items-center gap-3">
          <!-- Active indicator -->
          <div
            class="flex size-9 flex-shrink-0 items-center justify-center rounded-full"
            :class="selectedIndex === index ? 'bg-button-primary text-white' : 'bg-gray-100 text-gray-400'"
          >
            <PlayCircleIcon class="size-4" />
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">
              LESSON {{ index + 1 }}
            </p>
            <p class="text-sm font-semibold text-gray-800">{{ video.title }}</p>
          </div>
        </div>

        <!-- Right: Watch button -->
        <a
          :href="video.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-shrink-0 rounded-lg px-4 py-1.5 text-sm font-semibold transition"
          :class="
            selectedIndex === index
              ? 'bg-button-primary text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          @click.stop
        >
          {{ selectedIndex === index ? 'Watch' : 'Watch' }}
        </a>
      </div>
    </div>
    </div>

    <!-- Take Certification Exam -->
    <div class="pt-8 mb-12 flex justify-center sm:mb-20">
      <RouterLink
        to="/dashboard/exam"
        class="flex items-center gap-2 rounded-xl bg-button-primary px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
      >
        <DocumentTextIcon class="size-5" />
        Take Certification Exam
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { ELearningVideo } from '@/types/ExamContent'
import VideoOffIcon from '@/shared/components/icons/VideoOffIcon.vue'
import PlayIcon from '@/shared/components/icons/PlayIcon.vue'
import PlayCircleIcon from '@/shared/components/icons/PlayCircleIcon.vue'
import DocumentTextIcon from '@/shared/components/icons/DocumentTextIcon.vue'

const eLearningVideos: ELearningVideo[] = []

const authStore = useAuthStore()
const selectedIndex = ref(0)

const videos = computed(() => {
  const level = authStore.currentUser?.level
  if (!level) return []
  return eLearningVideos.filter((v) => v.level === String(level))
})

const activeVideo = computed(() => videos.value[selectedIndex.value] ?? null)
</script>
