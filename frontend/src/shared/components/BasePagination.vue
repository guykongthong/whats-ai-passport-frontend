<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1">
    <button
      type="button"
      class="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 text-button-primary disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="props.currentPage <= 1"
      @click="goTo(props.currentPage - 1)"
    >
      <ArrowLeftIcon class="size-3" />
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      type="button"
      class="inline-flex size-8 items-center justify-center rounded-md text-sm font-semibold"
      :class="
        page === props.currentPage
          ? 'bg-button-primary text-white'
          : 'text-button-primary hover:bg-button-secondary'
      "
      @click="goTo(page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      class="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 text-button-primary disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="props.currentPage >= totalPages"
      @click="goTo(props.currentPage + 1)"
    >
      <ArrowRightIcon class="size-3" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue'
import ArrowRightIcon from './icons/ArrowRightIcon.vue'

interface Props {
  totalItems: number
  pageSize?: number
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  currentPage: 1,
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))

function goTo(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('page-change', page)
}
</script>
