export interface User {
  id: string
  email: string
  name: string
  surname: string
  firstname?: string
  lastname?: string
  username?: string
  profileImageUrl?: string
  nameTh?: string
  surnameTh?: string
  level: string
  province: string
  role: 'admin' | 'user'
  roles?: readonly string[] | string[]
  isActive: boolean
  enabled?: boolean
}
