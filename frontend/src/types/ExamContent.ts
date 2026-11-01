export interface ExamRecord {
  id: string
  userId: string
  level: string
  score: number
  completedAt: string
  questionsAsked: AnsweredQuestion[]
  passCriteria: number
  pass: boolean
}

export interface ExamQuestion {
  id: string
  question: string
  choices: string[]
  answerIndex: number
  description?: string
}


export interface AnsweredQuestion {
  questionID: string
  question: string
  choices: string[]
  answerIndex: number
  selectedIndex: number
}

export interface ELearningVideo {
  level: string
  title: string
  url: string
  description?: string
  duration?: string
}