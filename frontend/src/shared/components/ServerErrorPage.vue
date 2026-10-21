<template>
  <div class="flex min-h-screen flex-col">

    <main class="flex flex-1 flex-col items-center justify-center bg-[#dbe2ea] px-4 pb-56 text-center">
      <h1 class="text-[8rem] leading-none text-[#003e6b] font-sarabun mb-4">๕๐๐</h1>
      <h2 class="text-4xl text-black font-js-chanok mb-4">Internal Server Error</h2>
      <p class="text-xl text-black font-js-chanchai mb-4">
        Check your Wi-Fi or mobile data connection, then try again.
      </p>
      <p class="text-xl text-black font-js-chanchai cursor-pointer hover:opacity-80 transition-opacity" @click="$emit('retry')">
        Re-runs the connection check <span class="underline underline-offset-4">"Retry"</span>
      </p>
    </main>

  </div>
</template>

<script setup lang="ts">


defineEmits<{
  (e: 'retry'): void
}>()


</script>

<style scoped>
.font-sarabun {
  font-family: 'Sarabun', sans-serif;
}
.font-js-chanok {
  font-family: 'Merriweather', 'JS Chanok', serif;
}
.font-js-chanchai {
  font-family: 'Merriweather', 'JS ChanChai', serif;
}
</style>
