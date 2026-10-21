<template>
  <UserPageLayout>
    <!-- Main content -->
    <main class="flex flex-1 justify-center bg-[#F8FAFC] px-6 py-16">
      <div class="w-full max-w-[1000px]">
        <h1 class="text-4xl font-extrabold text-[#00385A]">Badges</h1>
        <p class="pt-3 pb-4 text-base font-medium text-gray-500">
          Review your unlocked achievements.
        </p>

        <!-- Main Badges Component -->
        <UserBadges />
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import UserBadges from '@/user/components/UserBadges.vue'
</script>
