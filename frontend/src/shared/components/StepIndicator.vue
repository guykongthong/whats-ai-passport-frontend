<template>
  <div class="flex items-center justify-center">
    <template v-for="step in totalSteps" :key="step">
      <div
        class="flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold"
        :class="
          step <= currentStep
            ? 'border-button-primary bg-button-primary text-white'
            : 'border-gray-300 text-gray-400'
        "
      >
        {{ step }}
      </div>
      <div
        v-if="step < totalSteps"
        class="h-0.5 w-10"
        :class="step < currentStep ? 'bg-button-primary' : 'bg-gray-300'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  totalSteps: number
}

defineProps<Props>()
</script>
