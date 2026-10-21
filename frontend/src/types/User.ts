export interface User {
  id: string
  email: string
  name: string
  surname: string
  nameTh?: string
  surnameTh?: string
  level: string
  province: string
  role: 'admin' | 'user'
  isActive: boolean
}
