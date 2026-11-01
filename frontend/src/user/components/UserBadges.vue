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
import { getLevelName } from '@/utils/levelDisplay'

const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.fetchUserProfile()
  }
})

interface BadgeDisplay {
  id: string
  label: string
  name: string
}

const earnedBadges = computed<BadgeDisplay[]>(() => {
  if (userStore.badges && userStore.badges.length > 0) {
    return userStore.badges.map((b, idx) => ({
      id: String(idx + 1),
      label: b.name,
      name: b.name,
    }))
  }
  const currentLvl = userStore.currentUserLevel
  const list: BadgeDisplay[] = []
  for (let i = 1; i <= currentLvl; i++) {
    const title = getLevelName(i)
    list.push({
      id: String(i),
      label: title,
      name: title,
    })
  }
  return list
})
</script>
