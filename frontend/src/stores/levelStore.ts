import { defineStore } from 'pinia'
import { ref } from 'vue'
import { levels } from '@/data/levels'
import { benefits } from '@/data/benefits'
import { services } from '@/data/services'
import type { Level } from '@/types/Level'
import type { Benefit } from '@/types/Benefit'
import type { Service } from '@/types/Service'

export const useLevelStore = defineStore('level', () => {
  const allLevels = ref<Level[]>(levels)
  const allBenefits = ref<Benefit[]>(benefits)
  const allServices = ref<Service[]>(services)

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
