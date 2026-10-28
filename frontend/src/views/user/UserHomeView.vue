<template>
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-8 sm:gap-10">
    <!-- Hero Banner (FE-USER-08): Current Level, Progress toward next level, CTA "Take Upgrade Exam" -->
    <UserHeroBanner
      :current-level="currentLevel"
      :level-title="levelTitle"
      :passing-score="passingScore"
      :custom-description="levelDescription"
      exam-route="/dashboard/exam"
    />

    <!-- Two-column grid / Cards: Benefits Card & Services Card -->
    <section
      aria-label="Level Privileges and Campus Services"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch"
    >
      <!-- Benefits Card: Active perks & discounts -->
      <UserBenefitsCard
        :current-level="currentLevel"
        :benefits="currentBenefits"
        :loading="loading"
      />

      <!-- Services Card: Available facilities & services -->
      <UserServicesCard
        :current-level="currentLevel"
        :loading="loading"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores'
import { useLevelStore } from '@/stores/levelStore'
import UserService, { type UserLevelDetails } from '@/services/UserService'
import UserHeroBanner from '@/components/user/UserHeroBanner.vue'
import UserBenefitsCard from '@/components/user/UserBenefitsCard.vue'
import UserServicesCard from '@/components/user/UserServicesCard.vue'
import { getLevelName } from '@/utils/levelDisplay'

const authStore = useAuthStore()
const levelStore = useLevelStore()

const loading = ref(true)
const levelDetails = ref<UserLevelDetails | null>(null)

const currentLevel = computed<number>(() => {
  if (levelDetails.value?.level) {
    const parsed = Number(levelDetails.value.level)
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  const userLvl = Number(authStore.currentUser?.level || 1)
  return isNaN(userLvl) || userLvl < 1 ? 1 : userLvl
})

const levelTitle = computed<string>(() => {
  if (levelDetails.value?.label && levelDetails.value.label.trim() !== '') {
    return levelDetails.value.label
  }
  return getLevelName(currentLevel.value)
})

const passingScore = computed<number>(() => {
  return levelDetails.value?.passingScore ?? 70
})

const levelDescription = computed<string>(() => {
  return levelDetails.value?.description || ''
})

const currentBenefits = computed(() => {
  if (levelDetails.value?.benefits && levelDetails.value.benefits.length > 0) {
    return levelDetails.value.benefits
  }
  return levelStore.getBenefitsForLevel(String(currentLevel.value))
})

async function fetchLevelDetails() {
  loading.value = true
  try {
    const res = await UserService.getUserLevelDetails()
    if (res?.data) {
      levelDetails.value = res.data
    }
  } catch (err: unknown) {
    // If backend endpoint is offline or unavailable, fallback smoothly to local store data
    console.info('Backend level-details endpoint unavailable, fallback to local store data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLevelDetails()
})
</script>
