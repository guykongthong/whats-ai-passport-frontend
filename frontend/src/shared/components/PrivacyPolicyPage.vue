<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <main class="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 class="text-3xl font-extrabold text-[#00385e] mb-6">Privacy Policy</h1>
        <div class="text-gray-700 leading-relaxed space-y-4">
          <p>Last updated: {{ new Date().toLocaleDateString() }}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Your Information</h2>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        </div>
        <div class="mt-10 pt-6 border-t border-gray-100 text-center sm:text-left">
          <RouterLink to="/" class="text-[#00385e] hover:underline font-bold">← Back to Home</RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
