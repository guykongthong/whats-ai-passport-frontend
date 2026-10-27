<template>
  <UserLayoutView>
    <template #toast>
      <slot name="toast" />
    </template>
    <slot />
  </UserLayoutView>
</template>

<script setup lang="ts">
import UserLayoutView from '@/views/user/UserLayoutView.vue'
</script>
