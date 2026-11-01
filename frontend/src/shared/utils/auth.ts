import type { User } from '@/types/User'

/**
 * Checks whether a user has admin privileges.
 * Supports legacy `role: 'admin'` as well as backend Spring Boot `roles: ['ROLE_ADMIN']`.
 */
export function isUserAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  if (user.role === 'admin' || (user.role as string) === 'ROLE_ADMIN') return true
  if (Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN')) return true
  return false
}

/**
 * Checks whether a user account is deactivated.
 * Supports legacy `isActive === false` as well as backend Spring Boot `enabled === false`.
 */
export function isUserDeactivated(user: User | null | undefined): boolean {
  if (!user) return false
  if (user.isActive === false) return true
  if (user.enabled === false) return true
  return false
}
