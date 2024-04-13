import { describe, expect, it, beforeEach } from 'vitest'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getUserFromLS,
  removeLS,
  setAccessTokenAndUserToLS,
  setRefreshTokenToLS
} from '../auth'
import User from 'src/types/user.type'

const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OWI5Nzg5MWFmYzJlMWExZjk2YTNjOSIsImVtYWlsIjoicGF5dmVydGllQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMThUMDg6MjE6MzIuODAxWiIsImlhdCI6MTY4OTY2ODQ5MiwiZXhwIjoxNjg5NjY4NDk3fQ.xGikuOUK8nBC6vxh_hjwVewiz7JuZgtBEXBE4evlcJY'
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OWI5Nzg5MWFmYzJlMWExZjk2YTNjOSIsImVtYWlsIjoicGF5dmVydGllQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMThUMDg6MjE6MzIuODAxWiIsImlhdCI6MTY4OTY2ODQ5MiwiZXhwIjoxNjg5NjcyMDkyfQ.bBfywkxNrmLs03oM_rtmtKsHFNejnj7UU5BtcXJWx5o'
const user = {
  _id: '649b97891afc2e1a1f96a3c9',
  roles: ['User'],
  email: 'payvertie@gmail.com',
  createdAt: '2023-06-28T02:14:33.585Z',
  updatedAt: '2023-07-17T12:57:07.466Z',
  address: 'Thai Binh',
  name: 'Pham Van Tiep',
  phone: '0451141423',
  avatar: '40919b30-0fdb-49ac-b811-4896bdd85dd1.jpg'
}

beforeEach(() => {
  localStorage.clear()
})

describe('access-token and user', () => {
  it('set and get access token and user from local storage', () => {
    setAccessTokenAndUserToLS(accessToken, user as User)
    expect(getAccessTokenFromLS()).toBe(accessToken)
    expect(getUserFromLS()).toEqual(user)
  })
})

describe('refresh-token', () => {
  it('set and get refresh token from local storage', () => {
    setRefreshTokenToLS(refreshToken)
    expect(getRefreshTokenFromLS()).toBe(refreshToken)
  })
})

describe('clear local storage', () => {
  it('clear local storage', () => {
    setAccessTokenAndUserToLS(accessToken, user as User)
    setRefreshTokenToLS(refreshToken)
    removeLS()
    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
    expect(getUserFromLS()).toBe(undefined)
  })
})
