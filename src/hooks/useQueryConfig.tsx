import { ProductConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

export type QueryConfig = {
  [key in keyof ProductConfig]?: string
}
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      exclude: queryParams.exclude,
      limit: queryParams.limit || '20',
      name: queryParams.name,
      order: queryParams.order,
      page: queryParams.page || '1',
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      sort_by: queryParams.sort_by,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
