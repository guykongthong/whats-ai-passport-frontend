<template>
  <UserEditForm v-bind="$attrs" />
</template>

<script setup lang="ts">
import UserEditForm from '@/components/common/UserEditForm.vue'
</script>

<script lang="ts">
export type { UserFormData as UserEditFormData } from '@/components/common/UserEditForm.vue'
</script>
