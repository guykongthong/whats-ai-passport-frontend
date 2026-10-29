<template>
  <div class="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
      <div>
        <h3 class="text-xl font-extrabold text-[#00385A]">Available Institutional Services</h3>
        <p class="text-xs font-medium text-slate-500 mt-0.5">
          Campus and institutional services unlocked based on your certified level.
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
        <span class="size-1.5 rounded-full bg-blue-600"></span>
        {{ activeServices.length }} Active Services
      </span>
    </div>

    <!-- Services Grid -->
    <div v-if="activeServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div
        v-for="(service, index) in activeServices"
        :key="index"
        class="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-6 transition-all hover:border-indigo-300 hover:shadow-md"
      >
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-500/10">
              Tier {{ service.level }}
            </span>
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span class="size-1.5 rounded-full bg-emerald-500"></span>
              Authorized
            </span>
          </div>

          <h4 class="text-base font-extrabold text-[#00385A]">
            {{ service.name }}
          </h4>
          <p class="mt-1 text-xs text-slate-500 line-clamp-2">
            Service access granted to members meeting Level {{ service.level }} institutional standards.
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            class="w-full rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-[#00385A] hover:bg-[#00385A] hover:text-white transition-colors cursor-pointer"
          >
            Access Portal &rarr;
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
      <p class="text-sm font-bold text-slate-700">No active services available</p>
      <p class="mt-1 text-xs text-slate-500">
        Advance your skill level to unlock more campus and institutional services.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLevelStore } from '@/stores/levelStore'

const userStore = useUserStore()
const levelStore = useLevelStore()

interface ServiceItem {
  name: string
  level: number | string
}

const activeServices = computed<ServiceItem[]>(() => {
  const currentLvl = userStore.currentUserLevel
  return levelStore.allServices
    .filter((s) => Number(s.level) <= currentLvl)
    .map((s) => ({
      name: s.name,
      level: s.level,
    }))
})
</script>
