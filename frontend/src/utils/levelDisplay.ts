export const LEVEL_NUMBERS = [1, 2, 3, 4] as const

export function getLevelClasses(level: number | string): string {
  const lvl = Number(level)
  switch (lvl) {
    case 1:
      return 'bg-slate-100 text-slate-700 border border-slate-200'
    case 2:
      return 'bg-sky-100 text-sky-800 border border-sky-200'
    case 3:
      return 'bg-blue-200 text-blue-900 border border-blue-300'
    case 4:
      return 'bg-blue-900 text-white border border-blue-700'
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200'
  }
}

export function getLevelBadgeDark(level: number | string): string {
  const lvl = Number(level)
  switch (lvl) {
    case 1: return 'bg-slate-700/80 text-white border-white/10'
    case 2: return 'bg-sky-700/80 text-white border-white/10'
    case 3: return 'bg-blue-700/80 text-white border-white/10'
    case 4: return 'bg-blue-900/80 text-white border-white/10'
    default: return ''
  }
}

export function getLevelName(level: number | string): string {
  const lvl = Number(level)
  switch (lvl) {
    case 1:
      return 'Explorer'
    case 2:
      return 'Achiever'
    case 3:
      return 'Innovator'
    case 4:
      return 'Master'
    default:
      return 'Unknown'
  }
}
