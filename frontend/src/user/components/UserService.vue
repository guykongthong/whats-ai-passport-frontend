<template>
  <div class="flex flex-col gap-10">
    <!-- Active Services Section -->
    <section>
      <div class="pb-4 flex items-center gap-2">
        <h2 class="text-2xl font-extrabold text-[#00385A]">Active Services</h2>
      </div>

      <div v-if="activeServices.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          v-for="(service, index) in activeServices"
          :key="index"
          class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
        >
          <div>
            <div class="pb-4 flex items-center justify-between">
              <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#00385A]">Tier {{ service.level }}</span>
            </div>
            <h3 class="mb-2 text-xl font-bold text-[#00385A]">{{ service.name }}</h3>
            <!-- No description available in mock data -->
            <p class="mb-6 text-sm font-medium text-gray-500">Service provided as part of Level {{ service.level }} capabilities.</p>
          </div>

          <button class="w-full rounded-xl bg-blue-50 py-3 text-sm font-bold text-[#00385A] transition hover:bg-[#00385A] hover:text-white">
            Access Portal
          </button>
        </div>
      </div>
      <div v-else class="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        No active services available.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useLevelStore } from '@/stores/levelStore'

const authStore = useAuthStore()
const levelStore = useLevelStore()

// Get all services unlocked up to the user's current level
const activeServices = computed(() => {
  const userLevel = Number(authStore.currentUser?.level || 1)
  return levelStore.allServices.filter(s => Number(s.level) <= userLevel)
})
</script>
