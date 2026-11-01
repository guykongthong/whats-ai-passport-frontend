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
import { LEVEL_NUMBERS, getLevelName } from '@/utils/levelDisplay'

const props = defineProps<{
  users: UserRow[]
}>()

const totalUsers = computed(() => props.users.length)

const dotColors: Record<number, string> = {
  1: 'bg-[#b8d4a3]',
  2: 'bg-[#f5e6a3]',
  3: 'bg-[#f5c4a3]',
  4: 'bg-[#f5a3a3]',
}

const levelBreakdown = computed(() => {
  return LEVEL_NUMBERS.map((lvl) => ({
    level: lvl,
    name: getLevelName(lvl),
    dotColor: dotColors[lvl] || 'bg-slate-400',
    count: props.users.filter((u) => u.level === lvl).length,
  }))
})
</script>
