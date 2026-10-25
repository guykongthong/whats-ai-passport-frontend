<template>
  <UserPageLayout>
    <!-- Main content: gray bg, content centered -->
    <main class="flex flex-1 justify-center bg-[#EEF2F7] px-6 py-10">
      <div class="flex w-full max-w-xl flex-col gap-8">

        <!-- User Profile section -->
        <div>
          <h2 class="mb-4 text-xl font-extrabold text-button-primary">User Profile</h2>
          <UserProfile />
        </div>

        <!-- Your Status section (from UI Mockup) -->
        <div>
          <h2 class="mb-4 text-xl font-extrabold text-button-primary">Your Status</h2>
          
          <div class="flex flex-col gap-4">
            <!-- Level row -->
            <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div class="flex items-center gap-3">
                <LockIcon class="size-5 text-button-primary" />
                <span class="text-sm font-medium text-gray-700">Level: {{ levelName }}</span>
              </div>
              <CheckCircleMiniIcon class="size-5 text-gray-300" />
            </div>

            <!-- Account Status row -->
            <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div class="flex items-center gap-3">
                <UserCircleIcon class="size-5 text-button-primary" />
                <span class="text-sm font-medium text-gray-700">Account: {{ accountLabel }}</span>
              </div>
              <span
                class="rounded-full px-3 py-0.5 text-xs font-semibold"
                :class="isActive ? 'bg-button-primary text-white' : 'bg-gray-200 text-gray-500'"
              >
                {{ accountLabel }}
              </span>
            </div>
          </div>
        </div>

        <!-- Level Benefits section (Issue #17) -->
        <div>
          <h2 class="mb-4 text-xl font-extrabold text-button-primary">Level Benefits</h2>
          <LevelBenefits v-if="currentUserLevel" :level="currentUserLevel" />
        </div>

      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLevelStore } from '@/stores/levelStore'
import { useToast } from '@/composables/useToast'
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import UserProfile from '@/shared/components/UserProfile.vue'
import LevelBenefits from '@/shared/components/LevelBenefits.vue'
import LockIcon from '@/shared/components/icons/LockIcon.vue'
import CheckCircleMiniIcon from '@/shared/components/icons/CheckCircleMiniIcon.vue'
import UserCircleIcon from '@/shared/components/icons/UserCircleIcon.vue'

const authStore = useAuthStore()
const levelStore = useLevelStore()
const route = useRoute()
const { triggerToast } = useToast()

onMounted(() => {
  if (route.query.error === 'unauthorized') {
    triggerToast('Access denied: Administrator privileges required.')
  }
})

const currentUserLevel = computed(() => authStore.currentUser?.level ?? null)

const levelName = computed(() => {
  if (!currentUserLevel.value) return 'Loading...'
  const found = levelStore.allLevels.find((l) => l.id === String(currentUserLevel.value))
  return found?.name ?? `Level ${currentUserLevel.value}`
})

const isActive = computed(() => authStore.currentUser?.isActive ?? false)
const accountLabel = computed(() => (isActive.value ? 'Active' : 'Inactive'))
</script>
