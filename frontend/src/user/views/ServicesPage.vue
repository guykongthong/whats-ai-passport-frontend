<template>
  <UserPageLayout>
    <!-- Main content -->
    <main class="flex flex-1 justify-center bg-[#F8FAFC] px-6 py-16">
      <div class="w-full max-w-[1000px]">
        <h1 class="text-4xl font-extrabold text-[#00385A]">Services</h1>
        <p class="py-3 text-base font-medium text-gray-500">
          Review your authorized institutional services.
        </p>

        <!-- Main Services Component -->
        <UserService />
      </div>
    </main>
  </UserPageLayout>
</template>

<script setup lang="ts">
import UserPageLayout from '@/shared/components/UserPageLayout.vue'
import UserService from '@/user/components/UserService.vue'
</script>
