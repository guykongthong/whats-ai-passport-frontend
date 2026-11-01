<template>
  <AdminPageLayout title="Level Details" class="font-display">
    <BaseCard v-if="level" class="p-8 w-full max-w-[800px] mx-auto">
        <!-- Details Content -->
        <div class="flex flex-col gap-5 text-white">
          <!-- Level Row -->
          <FormFieldRow label="Level:">
            <div class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-2.5">
              <span :class="['px-2.5 py-1 rounded-md text-xs font-semibold', getLevelClasses(Number(level.id))]">
                Level {{ level.id }} - {{ level.label ?? level.name }}
              </span>
            </div>
          </FormFieldRow>

          <!-- Description Row -->
          <FormFieldRow label="Description:" align-top>
            <div class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-3 flex flex-col gap-2">
              <p class="text-white font-black text-[15px]">
                [Passing Score: {{ level.passingScore }}%]
              </p>
              <p class="text-white/80 text-[15px] font-semibold leading-relaxed">
                {{ level.description }}
              </p>
            </div>
          </FormFieldRow>

          <!-- Benefits Row -->
          <FormFieldRow label="Benefits:" align-top>
            <div class="flex-1">
              <LevelBenefits :level="level.id" />
            </div>
          </FormFieldRow>

          <!-- Services Row -->
          <FormFieldRow label="Services:" align-top>
            <div class="flex-1">
              <LevelServices :level="level.id" />
            </div>
          </FormFieldRow>
        </div>

        <!-- Footer -->
        <div class="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <BackLink to="/admin/levels" label="← Back to Levels" />

          <BaseButton 
            variant="secondary"
            class="bg-white text-[#00385e] hover:bg-white/90 rounded-xl px-6 py-2.5 font-extrabold w-full sm:w-auto"
            @click="router.push(`/admin/levels/${level.id}/edit`)"
          >
            Edit Criteria
          </BaseButton>
        </div>
      </BaseCard>
      <div v-else class="text-center text-white py-12">
        <p class="text-xl font-bold">Level not found</p>
      </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BackLink from '@/shared/components/BackLink.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import LevelBenefits from '@/shared/components/LevelBenefits.vue'
import LevelServices from '@/shared/components/LevelServices.vue'
import FormFieldRow from '@/shared/components/FormFieldRow.vue'
import { useLevelStore } from '@/stores/levelStore'
import type { Level } from '@/types/Level'
import { getLevelClasses } from '@/utils/levelDisplay'

const route = useRoute()
const router = useRouter()
const levelStore = useLevelStore()

const level = ref<Level | null>(null)

onMounted(() => {
  const levelId = route.params.id as string
  const foundLevel = levelStore.allLevels.find(l => l.id === levelId)
  if (foundLevel) {
    level.value = foundLevel
  }
})

</script>
