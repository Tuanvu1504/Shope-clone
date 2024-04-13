import { rest } from 'msw'
import config from 'src/contance/config'

export const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjc5MjUyNGI5M2M4NjZkMjdmMWMxNyIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMjJUMDg6Mzk6MjEuODU5WiIsImlhdCI6MTY5MDAxNTE2MSwiZXhwIjoxNjkwMDE1MTYyfQ.y0tefeOIWOTwlDuM5ssVRxepftGG4adWcO9X5LDzw74'
export const accessToken1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjc5MjUyNGI5M2M4NjZkMjdmMWMxNyIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMjJUMTA6Mjg6MDcuNjUwWiIsImlhdCI6MTY5MDAyMTY4NywiZXhwIjoxNjkwMDIxNjg4fQ.Wjgb2Dvxo-m2fRlD-0cxD6EvVZJhvdQVas7PTmsGBrE'

const userRes = (accessToken: string) => {
  return {
    message: 'Đăng nhập thành công',
    data: {
      access_token: accessToken,
      expires: 100000,
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjc5MjUyNGI5M2M4NjZkMjdmMWMxNyIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMjJUMDg6Mzk6MjEuODU5WiIsImlhdCI6MTY5MDAxNTE2MSwiZXhwIjoxMTY5MDAxNTE2MH0.yjycHgygQL0ww5nhLGTQ4BqJm0GiqGfyczrQfQ0IPyI',
      expires_refresh_token: 9999999999,
      user: {
        _id: '60f792524b93c866d27f1c17',
        roles: ['User'],
        email: 'abc@gmail.com',
        createdAt: '2021-07-21T03:19:46.980Z',
        updatedAt: '2021-07-21T03:19:46.980Z',
        __v: 0
      }
    }
  }
}

const logoutRes = {
  message: 'Đăng xuất thành công'
}

const refreshTokenRes = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjc5MjUyNGI5M2M4NjZkMjdmMWMxNyIsImVtYWlsIjoiYWJjQGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMDctMjJUMDg6MzI6NTAuMTcxWiIsImlhdCI6MTY5MDAxNDc3MCwiZXhwIjoxNjkwNjE5NTcwfQ.iFxkX_Sb2sBGcUhVGod6q5jJAJraegd6YQo-RClF9Ks'
  }
}

const loginRequest = rest.post(`${config.baseURL}login`, (req, res, ctx) => {
  if (
    req.headers.get('expire-access-token') &&
    Number(req.headers.get('expire-access-token')) === 1
  )
    return res(ctx.status(200), ctx.json(userRes(accessToken1s)))
  return res(ctx.status(200), ctx.json(userRes(accessToken)))
})

const logoutRequest = rest.post(`${config.baseURL}logout`, (_, res, ctx) => {
  return res(ctx.status(200), ctx.json(logoutRes))
})

const refreshTokenRequest = rest.post(
  `${config.baseURL}refresh-access-token`,
  (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(refreshTokenRes))
  }
)

const authRequests = [loginRequest, logoutRequest, refreshTokenRequest]
export default authRequests
