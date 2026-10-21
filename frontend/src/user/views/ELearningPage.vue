<template>
  <UserPageLayout>
    <!-- Main content: centered -->
    <main class="flex flex-1 justify-center bg-[#EEF2F7] px-6 py-10">
      <div class="w-full max-w-xl">
        <ELearningVideo />
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import ELearningVideo from '@/user/components/ELearningVideo.vue'
</script>
