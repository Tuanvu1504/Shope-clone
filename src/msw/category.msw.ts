import { rest } from 'msw'
import config from 'src/contance/config'

const categoriesRes = {
  message: 'Lấy categories thành công',
  data: [
    {
      _id: '60afacca6ef5b902180aacaf',
      name: 'Đồng hồ'
    },
    {
      _id: '60aba4e24efcc70f8892e1c6',
      name: 'Áo thun'
    },
    {
      _id: '60afafe76ef5b902180aacb5',
      name: 'Điện thoại'
    }
  ]
}

const categoriesRequest = rest.get(
  `${config.baseURL}categories`,
  (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(categoriesRes))
  }
)

const categoryRequests = [categoriesRequest]
export default categoryRequests
