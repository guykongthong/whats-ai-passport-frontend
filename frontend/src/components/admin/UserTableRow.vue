<template>
  <tr
    :class="[
      'border-b transition-colors',
      theme === 'dark'
        ? 'border-white/10 hover:bg-white/5'
        : 'border-slate-100 hover:bg-slate-50/80',
    ]"
  >
    <!-- Avatar & User Info (Name, Username, Email) -->
    <td class="px-4 py-4 sm:px-6 sm:py-5">
      <div class="flex items-center gap-3.5 sm:gap-4">
        <!-- Avatar image with initials fallback -->
        <img
          v-if="user.profileImageUrl && !imageError"
          :src="user.profileImageUrl"
          :alt="fullName"
          class="size-11 sm:size-12 rounded-full object-cover border border-white/20 shrink-0"
          @error="imageError = true"
        />
        <div
          v-else
          :class="[
            'size-11 sm:size-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none border',
            theme === 'dark'
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-indigo-50 border-indigo-100 text-indigo-700',
          ]"
        >
          {{ userInitials }}
        </div>

        <!-- Name, Username, and Email (each on its own distinct line) -->
        <div class="flex flex-col min-w-0">
          <span
            :class="[
              'text-base sm:text-lg font-bold truncate leading-snug',
              theme === 'dark' ? 'text-white' : 'text-slate-900',
            ]"
          >
            {{ fullName }}
          </span>
          <span
            :class="[
              'text-xs sm:text-sm font-mono mt-0.5',
              theme === 'dark' ? 'text-white/60' : 'text-slate-400',
            ]"
          >
            @{{ user.username }}
          </span>
          <span
            :class="[
              'text-xs sm:text-sm truncate mt-0.5',
              theme === 'dark' ? 'text-white/80' : 'text-slate-500',
            ]"
          >
            {{ user.email }}
          </span>
        </div>
      </div>
    </td>

    <!-- Province (Centered) -->
    <td class="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-base sm:text-lg font-medium text-center">
      <span :class="theme === 'dark' ? 'text-white/90' : 'text-slate-600'">
        {{ user.province || '-' }}
      </span>
    </td>

    <!-- Current Level Badge (Centered) -->
    <td class="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-center">
      <span
        :class="[
          'inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs select-none',
          levelBadgeClass,
        ]"
      >
        Level {{ user.currentLevel }}: {{ levelName }}
      </span>
    </td>

    <!-- Account Status (Active / Deactivated) (Centered) -->
    <td class="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-center">
      <StatusBadge :enabled="user.enabled" />
    </td>

    <!-- Action Icon Buttons (Centered) -->
    <td class="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-center">
      <div class="flex items-center justify-center gap-2.5">
        <!-- View Details Icon Button -->
        <button
          type="button"
          :class="[
            'size-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border shadow-xs',
            theme === 'dark'
              ? 'text-white bg-white/10 hover:bg-white/20 border-white/20 hover:scale-105'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200',
          ]"
          title="View Details"
          aria-label="View Details"
          @click="handleViewDetails"
        >
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <!-- Toggle Status Icon Button -->
        <button
          type="button"
          :class="[
            'size-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border shadow-xs',
            user.enabled
              ? 'text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/30 hover:scale-105'
              : 'text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30 hover:scale-105',
          ]"
          :title="user.enabled ? 'Deactivate User' : 'Reactivate User'"
          :aria-label="user.enabled ? 'Deactivate User' : 'Reactivate User'"
          @click="handleToggleStatus"
        >
          <svg v-if="user.enabled" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <svg v-else class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StatusBadge from '@/components/admin/StatusBadge.vue'
import type { AdminUser } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const props = withDefaults(
  defineProps<{
    user: AdminUser
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'dark',
  },
)

const emit = defineEmits<{
  (e: 'toggle-status', user: AdminUser): void
  (e: 'view-details', userId: number): void
}>()

const imageError = ref(false)

// Reset error flag if user prop changes during component reuse
watch(
  () => props.user.profileImageUrl,
  () => {
    imageError.value = false
  },
)

const fullName = computed(() => {
  const first = props.user.firstname?.trim() || ''
  const last = props.user.lastname?.trim() || ''
  return `${first} ${last}`.trim() || props.user.username
})

const userInitials = computed(() => {
  const first = props.user.firstname?.trim().charAt(0) || ''
  const last = props.user.lastname?.trim().charAt(0) || ''
  const combined = (first + last).toUpperCase()
  return combined || props.user.username.slice(0, 2).toUpperCase()
})

const levelName = computed(() => getLevelName(props.user.currentLevel))
const levelBadgeClass = computed(() => getLevelClasses(props.user.currentLevel))

function handleViewDetails() {
  emit('view-details', props.user.id)
}

function handleToggleStatus() {
  emit('toggle-status', props.user)
}
</script>
