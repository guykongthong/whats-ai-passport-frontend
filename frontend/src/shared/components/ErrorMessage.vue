<template>
    <p v-if="message" class="text-sm text-red-500 mt-1 min-h-[1.25rem]">{{ message }}</p>
</template>

<script setup lang="ts">
defineProps<{ message?: string}>()
</script>