export const LEVEL_NUMBERS = [1, 2, 3, 4] as const

export function getLevelClasses(level: number): string {
  switch (level) {
    case 1: return 'bg-[#C1D7AE] text-[#5A7447]' // Green
    case 2: return 'bg-[#F2D794] text-[#866D2B]' // Yellow
    case 3: return 'bg-[#E5A88B] text-[#7A4228]' // Orange
    case 4: return 'bg-[#DD898E] text-[#73292E]' // Red
    default: return 'bg-gray-200 text-gray-700'
  }
}

export function getLevelBadgeDark(level: number): string {
  switch (level) {
    case 1: return 'bg-[#5A7447]/80 text-white border-white/10'
    case 2: return 'bg-[#866D2B]/80 text-white border-white/10'
    case 3: return 'bg-[#7A4228]/80 text-white border-white/10'
    case 4: return 'bg-[#73292E]/80 text-white border-white/10'
    default: return ''
  }
}

export function getLevelName(level: number): string {
  switch (level) {
    case 1: return 'Explorer'
    case 2: return 'Achiever'
    case 3: return 'Innovator'
    case 4: return 'Master'
    default: return 'Unknown'
  }
}
