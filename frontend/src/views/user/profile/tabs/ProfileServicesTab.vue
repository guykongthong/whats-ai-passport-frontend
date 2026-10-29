<template>
  <div class="space-y-6">
    <div class="border-b border-slate-200/80 pb-4">
      <h2 class="text-lg font-bold text-slate-800">Available Level Services</h2>
      <p class="text-xs sm:text-sm text-slate-500">
        Digital services and benefits unlocked for your current level credential.
      </p>
    </div>

    <!-- Services Grid -->
    <div v-if="services.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="service in services"
        :key="service"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3.5">
          <div class="size-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            ✓
          </div>
          <div>
            <h3 class="font-bold text-sm text-slate-800">{{ service }}</h3>
            <p class="text-xs text-slate-500">Unlocked with Level {{ currentLevel }} status</p>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          Enabled
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center py-14"
    >
      <p class="text-sm font-semibold text-slate-700">No Services Available</p>
      <p class="text-xs text-slate-500 mt-1">Upgrade your level status to access exclusive platform services.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const services = computed(() => userStore.availableServices)
const currentLevel = computed(() => userStore.currentUserLevel)
</script>
