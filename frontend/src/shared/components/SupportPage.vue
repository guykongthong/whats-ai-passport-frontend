<template>
  <div class="flex min-h-screen flex-col bg-[#EEF2F7]">
    <main class="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
      <div class="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
        <h1 class="text-3xl font-extrabold text-[#00385e] mb-6">Help & Support</h1>
        <div class="text-gray-700 leading-relaxed space-y-6 max-w-2xl mx-auto">
          <p class="text-lg">Need help with your account or have questions about the platform?</p>
          
          <div class="bg-gray-50 rounded-xl p-6 border border-gray-100 text-left">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <ul class="space-y-3 font-medium">
              <li class="flex gap-2">
                <span class="text-gray-500 w-24">Email:</span>
                <span class="text-[#00385e]">support@thecaatpassport.com</span>
              </li>
              <li class="flex gap-2">
                <span class="text-gray-500 w-24">Phone:</span>
                <span class="text-[#00385e]">+66 123 456 789</span>
              </li>
              <li class="flex gap-2">
                <span class="text-gray-500 w-24">Hours:</span>
                <span class="text-gray-800">Mon-Fri, 9:00 AM - 5:00 PM (ICT)</span>
              </li>
            </ul>
          </div>

          <p class="text-sm text-gray-500 mt-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
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
