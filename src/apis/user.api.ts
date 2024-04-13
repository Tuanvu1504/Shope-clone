import User from 'src/types/user.type'
import { SuccessResponseAPI } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile
  extends Omit<User, '_id' | 'email' | 'createdAt' | 'updatedAt' | 'roles'> {
  password?: string
  new_password?: string
}

const userApi = {
  getProfile: () => {
    return http.get<SuccessResponseAPI<User>>('me')
  },
  updateProfile: (body: BodyUpdateProfile) => {
    return http.put<SuccessResponseAPI<User>>('user', body)
  },
  uploadAvatar: (body: FormData) => {
    return http.post<SuccessResponseAPI<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
