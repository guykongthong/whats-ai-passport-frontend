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
    <td class="px-4 py-3.5 sm:px-6 sm:py-4">
      <div class="flex items-center gap-3">
        <!-- Avatar image with initials fallback -->
        <img
          v-if="user.profileImageUrl && !imageError"
          :src="user.profileImageUrl"
          :alt="fullName"
          class="size-10 rounded-full object-cover border border-white/20 shrink-0"
          @error="imageError = true"
        />
        <div
          v-else
          :class="[
            'size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border',
            theme === 'dark'
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-indigo-50 border-indigo-100 text-indigo-700',
          ]"
        >
          {{ userInitials }}
        </div>

        <!-- Name, Username, and Email (responsive layout) -->
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'text-sm font-semibold truncate',
                theme === 'dark' ? 'text-white' : 'text-slate-900',
              ]"
            >
              {{ fullName }}
            </span>
            <span class="text-xs text-slate-400 font-mono">
              @{{ user.username }}
            </span>
          </div>
          <span
            :class="[
              'text-xs truncate',
              theme === 'dark' ? 'text-white/60' : 'text-slate-500',
            ]"
          >
            {{ user.email }}
          </span>
        </div>
      </div>
    </td>

    <!-- Province -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
      <span :class="theme === 'dark' ? 'text-white/80' : 'text-slate-600'">
        {{ user.province || '-' }}
      </span>
    </td>

    <!-- Current Level Badge -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
      <span
        :class="[
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs',
          levelBadgeClass,
        ]"
      >
        Level {{ user.currentLevel }}: {{ levelName }}
      </span>
    </td>

    <!-- Account Status (Active / Deactivated) with StatusBadge -->
    <td class="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
      <StatusBadge :enabled="user.enabled" />
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

        <!-- Toggle Status Button (Criteria #13 & #14) -->
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
          {{ user.enabled ? 'Deactivate User' : 'Reactivate User' }}
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

function handleViewDetails() {
  emit('view-details', props.user.id)
}

function handleToggleStatus() {
  emit('toggle-status', props.user)
}
</script>
