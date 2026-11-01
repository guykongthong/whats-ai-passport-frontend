import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Level } from '@/types/Level'
import type { Benefit } from '@/types/Benefit'
import type { Service } from '@/types/Service'

export const useLevelStore = defineStore('level', () => {
  const allLevels = ref<Level[]>([])
  const allBenefits = ref<Benefit[]>([])
  const allServices = ref<Service[]>([])

  function getBenefitsForLevel(level: string) {
    return allBenefits.value.filter((b) => b.level === level)
  }

  function getServicesForLevel(level: string) {
    return allServices.value.filter((s) => s.level === level)
  }

  function setPassCriteria(level: string, value: number) {
    const found = allLevels.value.find((l) => String(l.id) === String(level))
    if (!found) return undefined
    found.passingScore = value
    return found
  }

  return {
    allLevels,
    allBenefits,
    allServices,
    getBenefitsForLevel,
    getServicesForLevel,
    setPassCriteria,
  }
})
