<template>
  <AdminPageLayout title="Levels Criteria" class="font-display">
    <template #toast>
      <Toast :show="showToast" :message="toastMessage" variant="dark" class="sticky top-[72px] backdrop-blur-sm" />
    </template>

    <BaseCard v-if="level" class="p-8 w-full max-w-[800px] mx-auto">
        <!-- Form Content -->
        <div class="flex flex-col gap-5 text-white">
          <!-- Level Row -->
          <FormFieldRow label="Level:">
            <div class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-2.5">
              <span :class="['px-3 py-1 rounded-full text-sm font-black', getLevelClasses(Number(level.id))]">
                Level {{ level.id }}: {{ level.label ?? level.name }}
              </span>
            </div>
          </FormFieldRow>

          <!-- Description Row -->
          <FormFieldRow label="Description:" align-top>
            <div class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-3 flex flex-col gap-3">
              <PassCriteriaForm v-model="editForm.passingScore" />
              <textarea 
                v-model="editForm.description" 
                rows="3"
                class="w-full bg-transparent border-none text-white focus:outline-none text-[15px] font-semibold leading-relaxed resize-none"
              ></textarea>
            </div>
          </FormFieldRow>

          <!-- Benefits Row -->
          <FormFieldRow label="Benefits:" align-top>
            <textarea
              v-model="editForm.benefitsText"
              rows="6"
              class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none text-[15px] font-semibold leading-relaxed resize-none"
            ></textarea>
          </FormFieldRow>

          <!-- Services Row -->
          <FormFieldRow label="Services:" align-top>
            <textarea
              v-model="editForm.servicesText"
              rows="6"
              class="flex-1 bg-white/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none text-[15px] font-semibold leading-relaxed resize-none"
            ></textarea>
          </FormFieldRow>
        </div>

        <!-- Back & Update Buttons Footer -->
        <div class="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <BackLink to="/admin/levels" label="← Back to Criterias" />

          <BaseButton 
            variant="secondary"
            class="bg-white text-[#00385e] hover:bg-white/90 rounded-xl px-6 py-2.5 font-extrabold w-full sm:w-auto"
            @click="saveCriteria"
          >
            Update Criteria
          </BaseButton>
        </div>
      </BaseCard>
      <div v-else class="text-center text-white py-12">
        <p class="text-xl font-bold">Level not found</p>
      </div>
  </AdminPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageLayout from '@/shared/components/AdminPageLayout.vue'
import Toast from '@/shared/components/Toast.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BackLink from '@/shared/components/BackLink.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import PassCriteriaForm from '@/admin/components/PassCriteriaForm.vue'
import FormFieldRow from '@/shared/components/FormFieldRow.vue'
import { useLevelStore } from '@/stores/levelStore'
import type { Level } from '@/types/Level'
import { useToast } from '@/composables/useToast'
import { getLevelClasses } from '@/utils/levelDisplay'

const route = useRoute()
const router = useRouter()
const levelStore = useLevelStore()
const { showToast, toastMessage, triggerToast } = useToast()

const level = ref<Level | null>(null)
const editForm = reactive({
  passingScore: 70,
  description: '',
  benefitsText: '',
  servicesText: ''
})

onMounted(() => {
  const levelId = route.params.id as string
  const foundLevel = levelStore.allLevels.find(l => l.id === levelId)
  if (foundLevel) {
    level.value = foundLevel
    editForm.passingScore = foundLevel.passingScore ?? 70
    editForm.description = foundLevel.description ?? ''
    const relatedBenefits = levelStore.allBenefits.filter(b => String(b.level) === String(levelId))
    editForm.benefitsText = relatedBenefits.map(b => b.description).join('\n')
    const relatedServices = levelStore.allServices.filter(s => String(s.level) === String(levelId))
    editForm.servicesText = relatedServices.map(s => s.name).join('\n')
  }
})

async function saveCriteria() {
  if (level.value) {
    level.value.passingScore = editForm.passingScore
    level.value.description = editForm.description

    levelStore.allBenefits = levelStore.allBenefits.filter(b => String(b.level) !== String(level.value?.id))
    
    const newDescriptions = editForm.benefitsText
      .split('\n')
      .map(desc => desc.trim())
      .filter(desc => desc.length > 0)
      
    newDescriptions.forEach(desc => {
      levelStore.allBenefits.push({
        level: level.value?.id ?? '1',
        description: desc
      })
    })

    levelStore.allServices = levelStore.allServices.filter(s => String(s.level) !== String(level.value?.id))

    const newServiceNames = editForm.servicesText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)

    newServiceNames.forEach(name => {
      levelStore.allServices.push({
        level: level.value?.id ?? '1',
        name
      })
    })

    await triggerToast('This criteria has been updated.')
    router.push('/admin/levels')
  }
}

</script>
