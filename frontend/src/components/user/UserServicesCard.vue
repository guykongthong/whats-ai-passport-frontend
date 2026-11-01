<template>
  <div class="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
    <!-- Card Header -->
    <div class="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
      <div class="flex items-center gap-3.5">
        <div class="flex size-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-500/10">
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Facilities & Services
          </h2>
          <p class="text-xs font-medium text-slate-500">
            Available campus services & facilities
          </p>
        </div>
      </div>

      <!-- Count Badge -->
      <span class="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-700/10">
        {{ displayedServices.length }} Active
      </span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="flex flex-1 flex-col gap-3 py-4 animate-pulse">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4">
        <div class="flex items-center justify-between">
          <div class="h-4 w-32 rounded-md bg-slate-200" />
          <div class="h-4 w-12 rounded-full bg-slate-200" />
        </div>
        <div class="h-3 w-48 rounded-md bg-slate-200" />
      </div>
    </div>

    <!-- Services List -->
    <div v-else-if="displayedServices.length > 0" class="flex-1 py-4">
      <div class="flex flex-col gap-3">
        <div
          v-for="(service, idx) in displayedServices"
          :key="idx"
          class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:border-purple-100 hover:bg-purple-50/30 transition-all"
        >
          <!-- Top row: Name & Badge -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-purple-500" />
              <h3 class="text-sm font-bold text-slate-800">
                {{ service.name }}
              </h3>
            </div>
            <span
              class="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs"
              :class="getTierBadgeClasses(service.level)"
            >
              Tier {{ service.level }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 leading-relaxed font-normal pl-4">
            {{ service.description }}
          </p>

          <!-- Facility Status / Action -->
          <div class="mt-1 flex items-center justify-between pt-2 border-t border-slate-200/50 pl-4 text-[11px]">
            <span class="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Ready to Access
            </span>
            <RouterLink
              to="/dashboard/services"
              class="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Details &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div class="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-700">No active services</p>
      <p class="text-xs text-slate-400 mt-1">Services will unlock as your level progresses.</p>
    </div>

    <!-- Card Footer -->
    <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span class="inline-flex items-center gap-1.5">
        <span class="size-2 rounded-full bg-purple-500" />
        Institutional Facilities
      </span>
      <RouterLink
        to="/dashboard/services"
        class="text-[11px] font-semibold text-purple-600 hover:underline"
      >
        View All Services &rarr;
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLevelStore } from '@/stores/levelStore'
import type { Service } from '@/types/Service'

interface ServiceWithDesc extends Service {
  description: string
}

interface Props {
  currentLevel?: number | string
  services?: Service[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentLevel: 1,
  services: () => [],
  loading: false,
})

const levelStore = useLevelStore()

const serviceDescriptions: Record<string, string> = {
  'AI Literacy Orientation': 'Foundational orientation covering safe AI tools, CMU authentication, and campus digital ethics.',
  'Basic Prompt Writing Clinic': 'Interactive clinic providing prompt engineering templates for writing, coding, and design.',
  'Intermediate AI Tooling Workshop': 'Hands-on training with creative pipelines, workflow automation, and multimodal generation.',
  'Data Handling Consultation': 'Expert advisory on dataset preparation, privacy compliance, and research data curation.',
  'Advanced Project Mentorship': 'Technical guidance and project acceleration with faculty and tech industry veterans.',
  'AI Ethics Review Session': 'Structured compliance and algorithm bias check for student capstones and applications.',
  'Expert Certification Support': 'Exam preparation packages and institutional testing vouchers for industry certifications.',
  'Community Speaker Placement': 'Platform to showcase your student projects and research at regional CA?T tech conferences.',
}

const displayedServices = computed<ServiceWithDesc[]>(() => {
  const currentLevelNum = Number(props.currentLevel) || 1
  
  // If explicitly passed through props
  const sourceServices: Service[] = props.services && props.services.length > 0
    ? props.services
    : levelStore.allServices

  // Filter all services unlocked up to the current level
  const filtered = sourceServices.filter((s) => Number(s.level) <= currentLevelNum)

  return filtered.map((s) => ({
    ...s,
    description: serviceDescriptions[s.name] || `Standard facility provided as part of Level ${s.level} capabilities.`,
  }))
})

function getTierBadgeClasses(tier: string | number): string {
  switch (Number(tier)) {
    case 1:
      return 'bg-emerald-100 text-emerald-800'
    case 2:
      return 'bg-amber-100 text-amber-800'
    case 3:
      return 'bg-orange-100 text-orange-800'
    case 4:
      return 'bg-rose-100 text-rose-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}
</script>
