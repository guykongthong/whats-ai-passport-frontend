<template>
  <AdminPageLayout title="Levels Criteria">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <div class="flex flex-wrap justify-center gap-6">
      <BaseCard
        v-for="level in levelCards"
        :key="level.id"
        class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] p-6 flex flex-col justify-between cursor-pointer hover:bg-white/25 transition-colors"
        @click="router.push(`/admin/levels/${level.id}`)"
      >
        <!-- Level Title & Info -->
        <div>
          <h2 :class="['text-2xl font-black mb-3 underline decoration-2', getLevelTitleColor(Number(level.id))]">
            Level {{ level.id }}: {{ level.label }}
          </h2>

          <!-- Passing Score -->
          <p class="text-white font-black text-[15px] mb-2">
            [Passing Score: {{ level.passingScore }}%]
          </p>

          <!-- Description -->
          <p class="text-white/80 text-[14px] font-semibold mb-4 leading-relaxed pb-4 border-b border-white/10">
            {{ level.description }}
          </p>

          <!-- Benefits -->
          <div class="mb-4">
            <p class="text-white font-black text-[16px] mb-2">Benefits:</p>
            <ul class="list-disc list-inside text-white/80 text-[13px] font-semibold space-y-2">
              <li v-for="(benefit, i) in getLevelBenefits(level.id)" :key="i">
                {{ benefit.description }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Edit Button -->
        <div class="border-t border-white/20 pt-4 mt-4">
          <button
            class="w-full text-center text-white font-black text-[15px] hover:text-[#d0dbed] transition-colors"
            @click.stop="router.push(`/admin/levels/${level.id}/edit`)"
          >
            Edit
          </button>
        </div>
      </BaseCard>
    </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import { useLevelStore } from '@/stores/levelStore'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const levelStore = useLevelStore()
const { showToast, toastMessage } = useToast()

const levelCards = computed(() => {
  return levelStore.allLevels.map(level => ({
    id: level.id,
    name: level.name,
    label: level.label ?? level.name,
    passingScore: level.passingScore ?? 70,
    description: level.description ?? '',
  }))
})

function getLevelBenefits(levelId: string) {
  return levelStore.allBenefits.filter(b => String(b.level) === String(levelId))
}

function getLevelTitleColor(level: number): string {
  switch (level) {
    case 1: return 'text-[#C1D7AE]'
    case 2: return 'text-[#F2D794]'
    case 3: return 'text-[#E5A88B]'
    case 4: return 'text-[#DD898E]'
    default: return 'text-white'
  }
}

</script>
