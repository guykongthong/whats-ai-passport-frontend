<template>
  <div class="flex flex-col md:flex-row justify-start items-stretch md:items-end gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/30 w-full">
    <div class="w-full md:flex-1 md:max-w-[400px]">
      <BaseInput 
        v-model="searchQuery" 
        placeholder="e.g. Search by name or email" 
        class="w-full [&>input]:bg-white/40 [&>input]:border-none [&>input]:rounded-xl [&>input]:py-3 [&>input]:text-[17px] [&>input]:text-[#4F6C83] [&>input]:placeholder-[#4F6C83]/70"
      />
    </div>

    <div class="relative w-full md:w-48">
      <LevelSelect 
        v-model="selectedLevel"
        :show-all-option="true"
        default-bg-class="bg-white/40 text-[#4F6C83] border-none"
        class="w-full appearance-none rounded-xl py-3 pl-5 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 text-[17px] font-medium cursor-pointer"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <FilterIcon class="w-6 h-6 text-[#4F6C83]" />
      </div>
    </div>

    <div class="relative w-full md:w-48">
      <select 
        v-model="selectedProvince"
        class="w-full appearance-none bg-white/40 border-none rounded-xl py-3 pl-5 pr-10 text-[#4F6C83] focus:outline-none focus:ring-2 focus:ring-white/50 text-[17px] font-medium cursor-pointer"
      >
        <option value="">All Province</option>
        <option value="Chiang Mai">Chiang Mai</option>
        <option value="Bangkok">Bangkok</option>
        <option value="Chiang Rai">Chiang Rai</option>
        <option value="Phuket">Phuket</option>
        <option value="Khon Kaen">Khon Kaen</option>
        <option value="Songkhla">Songkhla</option>
        <option value="Nakhon Ratchasima">Nakhon Ratchasima</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <FilterIcon class="w-6 h-6 text-[#4F6C83]" />
      </div>
    </div>

    <BaseButton 
      variant="secondary" 
      size="lg" 
      class="w-full md:w-auto bg-white/40 hover:bg-white/60 text-[#4F6C83] border-none rounded-xl py-3"
      @click="resetFilters"
    >
      Reset
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import FilterIcon from '@/shared/components/icons/FilterIcon.vue'
import LevelSelect from '@/shared/components/LevelSelect.vue'

const searchQuery = ref('')
const selectedLevel = ref('')
const selectedProvince = ref('')

const emit = defineEmits<{
  'filter-change': [filters: { search: string; level: string; province: string }]
}>()

watch([searchQuery, selectedLevel, selectedProvince], () => {
  emit('filter-change', {
    search: searchQuery.value,
    level: selectedLevel.value,
    province: selectedProvince.value,
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedLevel.value = ''
  selectedProvince.value = ''
}
</script>
