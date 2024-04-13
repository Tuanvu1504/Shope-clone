import { Category } from 'src/types/category.type'
import { SuccessResponseAPI } from 'src/types/utils.type'
import http from 'src/utils/http'

const categoryApi = {
  getCategories: () => http.get<SuccessResponseAPI<Category[]>>('categories')
}

export default categoryApi
