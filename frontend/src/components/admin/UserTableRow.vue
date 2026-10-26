<template>
  <tr
    :class="[
      'transition-colors',
      theme === 'dark'
        ? 'hover:bg-white/10 border-b border-white/20'
        : 'hover:bg-slate-50/80 border-b border-slate-200',
    ]"
  >
    <!-- User (Avatar + Full name + Username) -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
      <div class="flex items-center gap-3">
        <!-- Avatar image with fallback -->
        <img
          v-if="user.profileImageUrl && !imageError"
          :src="user.profileImageUrl"
          :alt="fullName"
          class="size-10 rounded-full object-cover shrink-0"
          :class="theme === 'dark' ? 'border border-white/30' : 'border border-slate-200'"
          @error="imageError = true"
        />
        <div
          v-else
          class="size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none"
          :class="
            theme === 'dark'
              ? 'bg-black/20 text-white border border-white/20'
              : 'bg-slate-200 text-slate-700 border border-slate-300'
          "
          aria-label="User avatar placeholder"
        >
          {{ userInitials }}
        </div>

        <div class="flex flex-col min-w-0">
          <span
            class="text-sm font-semibold truncate leading-tight"
            :class="theme === 'dark' ? 'text-white' : 'text-slate-800'"
          >
            {{ fullName }}
          </span>
          <span
            class="text-xs truncate"
            :class="theme === 'dark' ? 'text-white/60' : 'text-slate-400'"
          >
            @{{ user.username }}
          </span>
        </div>
      </div>
    </td>

    <!-- Email -->
    <td
      class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap text-sm"
      :class="theme === 'dark' ? 'text-white/80' : 'text-slate-600'"
    >
      {{ user.email }}
    </td>

    <!-- Province -->
    <td
      class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap text-sm"
      :class="theme === 'dark' ? 'text-white/80' : 'text-slate-600'"
    >
      {{ user.province || '-' }}
    </td>

    <!-- Current Level Badge -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
      <span
        :class="[
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
          levelBadgeClass,
        ]"
      >
        Level {{ user.currentLevel }}: {{ levelName }}
      </span>
    </td>

    <!-- Account Status (Active / Deactivated) -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
      <span
        :class="[
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
          statusBadgeClasses,
        ]"
      >
        <span :class="['size-1.5 rounded-full', statusDotClass]" />
        {{ user.enabled ? 'Active' : 'Deactivated' }}
      </span>
    </td>

    <!-- Action Buttons -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm">
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          :class="[
            'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer border',
            theme === 'dark'
              ? 'text-white bg-white/10 hover:bg-white/20 border-white/20'
              : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
          ]"
          @click="handleViewDetails"
        >
          View Details
        </button>

        <button
          type="button"
          :class="[
            'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 cursor-pointer',
            user.enabled
              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 focus:ring-rose-500'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 focus:ring-emerald-500',
          ]"
          @click="handleToggleStatus"
        >
          {{ user.enabled ? 'Deactivate' : 'Reactivate' }}
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AdminUser } from '@/types/admin'
import { getLevelClasses, getLevelName } from '@/utils/levelDisplay'

const props = withDefaults(
  defineProps<{
    user: AdminUser
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'light',
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

const statusBadgeClasses = computed(() => {
  if (props.theme === 'dark') {
    return props.user.enabled
      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
  }
  return props.user.enabled
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-rose-50 text-rose-700 border border-rose-200'
})

const statusDotClass = computed(() => {
  if (props.theme === 'dark') {
    return props.user.enabled ? 'bg-emerald-400' : 'bg-rose-400'
  }
  return props.user.enabled ? 'bg-emerald-500' : 'bg-rose-500'
})

function handleViewDetails() {
  emit('view-details', props.user.id)
}

function handleToggleStatus() {
  emit('toggle-status', props.user)
}
</script>
