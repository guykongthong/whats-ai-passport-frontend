<template>
  <UserPageLayout>
    <!-- Main content -->
    <main class="flex flex-1 justify-center bg-[#F8FAFC] px-6 py-16">
      <div class="w-full max-w-3xl">
        <h1 class="font-display text-3xl font-extrabold text-[#00385A]">Exam History</h1>
        <p class="mt-2 text-base font-medium text-gray-500 mb-8">
          Review your past certification attempts and status.
        </p>

        <!-- Use shared component, defaults to current user -->
        <ExamHistory />
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import ExamHistory from '@/shared/components/ExamHistory.vue'
</script>
