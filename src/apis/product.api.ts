import { Product, ProductConfig, ProductList } from 'src/types/product.type'
import { SuccessResponseAPI } from 'src/types/utils.type'
import http from 'src/utils/http'

const productApi = {
  getProductList: (params: ProductConfig) =>
    http.get<SuccessResponseAPI<ProductList>>('products', {
      params
    }),
  getProduct: (id: string) =>
    http.get<SuccessResponseAPI<Product>>(`products/${id}`)
}

export default productApi
