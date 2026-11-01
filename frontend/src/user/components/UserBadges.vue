<template>
  <div class="flex flex-col gap-10">
    <section>
      <div v-if="earnedBadges.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div 
          v-for="lvl in earnedBadges" 
          :key="lvl.id"
          class="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
        >
          <h3 class="text-center text-lg font-bold text-[#00385A]">Level {{ lvl.id }}: {{ lvl.label || lvl.name }}</h3>
          <span class="mt-3 rounded-full bg-[#00385A] px-4 py-1 text-xs font-bold text-white shadow-sm">Verified</span>
        </div>
      </div>
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        No badges unlocked yet.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLevelStore } from '@/stores/levelStore'
import type { Level } from '@/types/Level'

const levelStore = useLevelStore()
const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

const earnedBadges = computed<Level[]>(() => {
  const passedLevelIds = new Set(
    userStore.examHistories.filter(h => h.passed).map(h => String(h.levelNumber)),
  )
  return levelStore.allLevels.filter(l => passedLevelIds.has(String(l.id)))
})
</script>
