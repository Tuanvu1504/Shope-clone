type Roles = 'User' | 'Admin'

export default interface User {
  _id: string
  roles: Roles[]
  email: string
  name?: string
  date_of_birth?: Date
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
