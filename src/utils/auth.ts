import User from 'src/types/user.type'

export const getAccessTokenFromLS = () => {
  const accessToken = localStorage.getItem('access_token') ?? ''
  return accessToken
}

export const getRefreshTokenFromLS = () => {
  const refreshToken = localStorage.getItem('refresh_token') ?? ''
  return refreshToken
}

export const getUserFromLS = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : undefined
}

export const setAccessTokenAndUserToLS = (
  accessToken?: string,
  user?: User
) => {
  const userJson = JSON.stringify(user)
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
  }
  if (user) {
    localStorage.setItem('user', userJson)
  }
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken)
}

const removeLSEvent = new Event('removeLS')
export const removeLSEventTarget = new EventTarget()

export const removeLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  removeLSEventTarget.dispatchEvent(removeLSEvent)
}
