import { rest } from 'msw'
import config from 'src/contance/config'

const purchasesRes = {
  message: 'Lấy đơn mua thành công',
  data: []
}

const purchasesRequest = rest.get(
  `${config.baseURL}purchases`,
  (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(purchasesRes))
  }
)

const purchaseRequests = [purchasesRequest]
export default purchaseRequests
