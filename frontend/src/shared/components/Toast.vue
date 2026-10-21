<template>
  <transition name="fade">
    <div
      v-if="show"
      :class="[
        'w-full text-center py-3 font-bold text-[16px] border-b z-40',
        variant === 'dark'
          ? 'bg-[#d0dbec]/30 text-white border-[#d0dbec]/20'
          : 'bg-[#99c5e0]/50 text-white border-[#99c5e0]/60'
      ]"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  message: string
  variant?: 'light' | 'dark'
}

withDefaults(defineProps<Props>(), {
  variant: 'light',
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, max-height 0.5s ease, padding 0.5s ease;
  overflow: hidden;
  max-height: 60px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
