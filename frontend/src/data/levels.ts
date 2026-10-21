import type { Level } from '@/types/Level'

export const levels: Level[] = [
  { 
    id: '1', 
    name: 'Level 1',
    label: 'Explorer',
    passingScore: 70,
    description: 'A foundational level for new students and members, focusing on basic digital knowledge and workflows within CAMT.'
  },
  { 
    id: '2', 
    name: 'Level 2',
    label: 'Achiever',
    passingScore: 75,
    description: 'A level for students who have developed specialized skills and can apply digital tools and technologies to create real-world projects.'
  },
  { 
    id: '3', 
    name: 'Level 3',
    label: 'Innovator',
    passingScore: 80,
    description: 'A level for students who create innovative projects and advanced technologies, with opportunities to compete or build startups.'
  },
  { 
    id: '4', 
    name: 'Level 4',
    label: 'Master',
    passingScore: 85,
    description: 'The highest level of CAMT Passport, recognizing outstanding students and personnel with academic and professional expertise at an international level.'
  }
]
