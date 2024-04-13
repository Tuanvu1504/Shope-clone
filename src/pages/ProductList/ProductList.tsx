import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import productApi from 'src/apis/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductConfig } from 'src/types/product.type'
import Aside from './Aside'
import Pagination from './Pagitation'
import Product from './Product'
import SortBar from './SortBar'
import { Helmet } from 'react-helmet-async'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProductList(queryConfig as ProductConfig),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-100'>
      <Helmet prioritizeSeoTags>
        <title>Home | Shopee clone</title>
        <meta
          property='og:Home | Shopee clone'
          content='shopee clone home page'
        />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-12 gap-4 py-4'>
          <div className='col-span-3'>
            <Aside
              categories={categoryData?.data.data || []}
              queryConfig={queryConfig}
            />
          </div>
          {productsData && (
            <div className='col-span-9'>
              <SortBar
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
              <div className='my-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => {
                  return (
                    <div key={product._id} className='col-span-1'>
                      <Product product={product} />
                    </div>
                  )
                })}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
