import type { NavLink } from '@/types/NavLink'

export const adminNavLinks: NavLink[] = [
  { label: 'User Management', to: '/admin' },
  { label: 'Criteria of Levels', to: '/admin/levels' },
  { label: 'Exam Management', to: '/admin/exams' },
  { label: 'e-Learning', to: '/admin/elearning' },
]

export const adminFooterLinks: NavLink[] = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Help & Support', to: '/support' },
]

export const userNavLinks: NavLink[] = [
  { label: 'Service Levels', to: '/dashboard/services' },
  { label: 'Badges', to: '/dashboard/badges'},
  { label: 'E-Learning', to: '/dashboard/elearning' },
]

export const userFooterLinks: NavLink[] = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Support', to: '/support' },
]
