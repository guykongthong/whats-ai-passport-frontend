import type { Level } from '@/types/Level'

export const levels: Level[] = [
  { 
    id: '1', 
    name: 'Level 1',
    label: 'Explorer',
    passingScore: 70,
    description: 'Learn basic AI tools, prompt writing, and ethical AI usage.'
  },
  { 
    id: '2', 
    name: 'Level 2',
    label: 'Achiever',
    passingScore: 75,
    description: 'Build intermediate AI skills, data preparation, and practical project tools.'
  },
  { 
    id: '3', 
    name: 'Level 3',
    label: 'Innovator',
    passingScore: 80,
    description: 'Access high-performance GPU resources and build advanced AI projects.'
  },
  { 
    id: '4', 
    name: 'Level 4',
    label: 'Master',
    passingScore: 85,
    description: 'Expert level with full access to all AI tools, certifications, and mentoring.'
  }
]
