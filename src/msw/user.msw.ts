import { rest } from 'msw'
import config from 'src/contance/config'
import { accessToken1s } from './auth.msw'

export const meRes = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '60f792524b93c866d27f1c17',
    roles: ['User'],
    email: 'abc@gmail.com',
    createdAt: '2021-07-21T03:19:46.980Z',
    updatedAt: '2021-07-21T03:19:46.980Z'
  }
}

const meRequest = rest.get(`${config.baseURL}me`, (req, res, ctx) => {
  const accessToken = req.headers.get('Authorization')

  if (accessToken === accessToken1s)
    return res(
      ctx.status(401),
      ctx.json({
        message: 'Lỗi',
        data: {
          message: 'Token hết hạn',
          name: 'EXPIRED_TOKEN'
        }
      })
    )
  return res(ctx.status(200), ctx.json(meRes))
})

const userRequests = [meRequest]
export default userRequests
