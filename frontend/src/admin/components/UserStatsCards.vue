<template>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div class="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center text-white shadow-sm border border-white/30 flex flex-col items-center col-span-2 md:col-span-1">
      <div class="text-white/70 text-sm font-semibold">Total Users</div>
      <div class="text-white text-3xl font-extrabold mt-2">{{ totalUsers }}</div>
    </div>

    <div 
      v-for="level in levelBreakdown" 
      :key="level.level"
      class="bg-white/20 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/30 flex flex-col items-center text-center"
    >
      <div class="flex items-center justify-center gap-2">
        <div :class="['w-3 h-3 rounded-full', level.dotColor]"></div>
        <div class="text-white/70 text-sm font-semibold">Level {{ level.level }}</div>
      </div>
      <div class="text-white text-3xl font-extrabold mt-2">{{ level.count }}</div>
      <div class="text-white/50 text-xs font-medium mt-1">{{ level.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserRow } from '@/admin/components/UserListTable.vue'

const props = defineProps<{
  users: UserRow[]
}>()

const totalUsers = computed(() => props.users.length)

const levelBreakdown = computed(() => {
  const levels = [
    { level: 1, name: 'Explorer', dotColor: 'bg-[#b8d4a3]' },
    { level: 2, name: 'Achiever', dotColor: 'bg-[#f5e6a3]' },
    { level: 3, name: 'Innovator', dotColor: 'bg-[#f5c4a3]' },
    { level: 4, name: 'Master', dotColor: 'bg-[#f5a3a3]' },
  ]

  return levels.map(l => ({
    ...l,
    count: props.users.filter(u => u.level === l.level).length
  }))
})
</script>
