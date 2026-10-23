/**
 * Admin-specific interfaces and DTOs
 * Used for communicating with Spring Boot Backend Admin APIs
 */

export interface AdminUser {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl: string
  currentLevel: number
  enabled: boolean
  roles: string[]
}

export interface LevelAdmin {
  id: number
  levelNumber: number
  name: string
  passCriteria: number
  benefits: string[]
  services: string[]
  badge: {
    name: string
    imageUrl: string
  }
}

export interface QuestionAdmin {
  id: number
  levelNumber: number
  questionText: string
  choices: string[]
  correctAnswer: number
}

export interface ExamHistoryItem {
  id: number
  levelNumber: number
  score: number
  totalScore: number
  passed: boolean
  attemptDateTime: string
  badgeName: string | null
}
