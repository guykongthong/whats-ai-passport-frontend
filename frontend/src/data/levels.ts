import type { Level } from '@/types/Level'

export const levels: Level[] = [
  { 
    id: '1', 
    name: 'Level 1',
    label: 'Explorer',
    passingScore: 70,
    description: 'Foundational tier for registered students, introducing core AI literacy, responsible prompt writing, and university academic integrity guidelines under The CA?T Passport.'
  },
  { 
    id: '2', 
    name: 'Level 2',
    label: 'Achiever',
    passingScore: 75,
    description: 'Applied competency tier unlocking intermediate AI services, dataset preprocessing, and machine learning tools for academic coursework.'
  },
  { 
    id: '3', 
    name: 'Level 3',
    label: 'Innovator',
    passingScore: 80,
    description: 'Advanced tier providing specialized GPU cluster resources (NVIDIA A100), fine-tuning capabilities, and project mentorship for student AI capstones.'
  },
  { 
    id: '4', 
    name: 'Level 4',
    label: 'Master',
    passingScore: 85,
    description: 'Highest mastery tier recognizing expertise in AI architecture, system governance, red-teaming, and campus-wide AI community leadership.'
  }
]
