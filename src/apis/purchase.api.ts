import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponseAPI } from 'src/types/utils.type'
import http from 'src/utils/http'

const purchaseApi = {
  addToCart: (body: { product_id: string; buy_count: number }) => {
    return http.post<SuccessResponseAPI<Purchase>>(
      'purchases/add-to-cart',
      body
    )
  },
  readPurchases: (status: PurchaseListStatus) => {
    return http.get<SuccessResponseAPI<Purchase[]>>('purchases', {
      params: {
        status
      }
    })
  },
  updatePurchase: (body: { product_id: string; buy_count: number }) => {
    return http.put<SuccessResponseAPI<Purchase>>(
      'purchases/update-purchase',
      body
    )
  },
  deletePurchase: (body: string[]) => {
    return http.delete<SuccessResponseAPI<{ deleted_count: number }>>(
      'purchases',
      { data: body }
    )
  },
  buyPurchases: (body: { product_id: string; buy_count: number }[]) => {
    return http.post<SuccessResponseAPI<Purchase[]>>(
      'purchases/buy-products',
      body
    )
  }
}

export default purchaseApi
