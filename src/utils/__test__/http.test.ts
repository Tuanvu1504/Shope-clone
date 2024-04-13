import { beforeEach } from 'node:test'
import HttpStatusCode from 'src/contance/httpStatusCode'
import { AuthResponse } from 'src/types/auth.type'
import { describe, expect, it } from 'vitest'
import http from '../http'
const body = { email: 'abc@gmail.com', password: '123456' }

describe('http service', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('normal request', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('auth request', async () => {
    await http.post('login', body)
    const res = await http.get('purchases')
    expect(res.status).toBe(HttpStatusCode.Ok)
    const logoutRes = await http.post('logout')
    expect(logoutRes.status).toBe(HttpStatusCode.Ok)
  })

  it('refresh token request', async () => {
    const loginRes = await http.post<AuthResponse>('login', body, {
      headers: {
        'expire-access-token': 1
      }
    })

    const res = await http.get('me')

    expect(res.status).toBe(HttpStatusCode.Ok)
    expect(
      loginRes.data.data.access_token === res.config.headers.Authorization
    ).toBe(false)
  })
})
