export interface User {
  id: string
  username?: string
  email: string
  name: string
  surname: string
  nameTh?: string
  surnameTh?: string
  level: string
  province: string
  profileImageUrl?: string
  role: 'admin' | 'user'
  isActive: boolean
}

// Request body for POST /auth/register (see API contract)
export interface RegisterPayload {
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
  province: string
  profileImageUrl: string
}
