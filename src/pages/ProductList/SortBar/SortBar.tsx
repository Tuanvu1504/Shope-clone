import { ProductConfig } from 'src/types/product.type'
import { order as orderConstant, sortBy } from 'src/contance/sort'
import classNames from 'classnames'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/contance/path'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortBar({ pageSize, queryConfig }: Props) {
  const navigate = useNavigate()
  const { sort_by = sortBy.view, order = '', page = '1' } = queryConfig
  const currentPage = Number(page)

  const isActiveSortBy = (
    sortByValue: Exclude<ProductConfig['sort_by'], undefined>
  ) => {
    return sortByValue === sort_by
  }

  const handleSortBy = (
    sortByValue: Exclude<ProductConfig['sort_by'], undefined>
  ) => {
    navigate({
      pathname: path.products,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue,
            page: '1'
          },
          ['order']
        )
      ).toString()
    })
  }

  const handleOrder = (
    orderValue: Exclude<ProductConfig['order'], undefined>
  ) => {
    navigate({
      pathname: path.products,
      search: createSearchParams({
        ...queryConfig,
        order: orderValue,
        sort_by: sortBy.price,
        page: '1'
      }).toString()
    })
  }

  return (
    <div className='rounded-sm bg-gray-200 p-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center justify-start gap-2'>
          <div className=''>Sắp xếp theo</div>
          <button
            className={classNames('h-8 rounded-sm border px-4 capitalize', {
              'bg-orange hover:bg-orange/60 text-white': isActiveSortBy(
                sortBy.view as Exclude<ProductConfig['sort_by'], undefined>
              ),
              'bg-white text-black hover:bg-gray-100': !isActiveSortBy(
                sortBy.view as Exclude<ProductConfig['sort_by'], undefined>
              )
            })}
            onClick={() =>
              handleSortBy(
                sortBy.view as Exclude<ProductConfig['sort_by'], undefined>
              )
            }
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 rounded-sm border px-4 capitalize', {
              'bg-orange hover:bg-orange/60 text-white': isActiveSortBy(
                sortBy.createdAt as Exclude<ProductConfig['sort_by'], undefined>
              ),
              'bg-white text-black hover:bg-gray-100': !isActiveSortBy(
                sortBy.createdAt as Exclude<ProductConfig['sort_by'], undefined>
              )
            })}
            onClick={() =>
              handleSortBy(
                sortBy.createdAt as Exclude<ProductConfig['sort_by'], undefined>
              )
            }
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 rounded-sm border px-4 capitalize', {
              'bg-orange hover:bg-orange/60 text-white': isActiveSortBy(
                sortBy.sold as Exclude<ProductConfig['sort_by'], undefined>
              ),
              'bg-white text-black hover:bg-gray-100': !isActiveSortBy(
                sortBy.sold as Exclude<ProductConfig['sort_by'], undefined>
              )
            })}
            onClick={() =>
              handleSortBy(
                sortBy.sold as Exclude<ProductConfig['sort_by'], undefined>
              )
            }
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'h-8 cursor-pointer rounded px-2 outline-none',
              {
                'bg-orange hover:bg-orange/60 text-white': isActiveSortBy(
                  sortBy.price as Exclude<ProductConfig['sort_by'], undefined>
                ),
                'bg-white text-black hover:bg-gray-100': !isActiveSortBy(
                  sortBy.price as Exclude<ProductConfig['sort_by'], undefined>
                )
              }
            )}
            value={order}
            onChange={(event) =>
              handleOrder(
                event.target.value as Exclude<ProductConfig['order'], undefined>
              )
            }
          >
            <option className='bg-white text-black' value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black' value={orderConstant.asc}>
              Từ thấp đến cao
            </option>
            <option className='bg-white text-black' value={orderConstant.desc}>
              Từ cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center justify-center gap-2'>
          <div>
            <span className='text-orange'>{page}</span>
            <span className='text-black'>/{pageSize}</span>
          </div>
          <div className='flex items-center'>
            {currentPage === 1 ? (
              <span className='rouneded-tl-sm flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-bl-sm border bg-gray-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.products,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currentPage - 1).toString()
                  }).toString()
                }}
                className='rouneded-tl-sm flex h-8 w-8 items-center justify-center rounded-bl-sm border bg-white hover:bg-gray-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </Link>
            )}
            {currentPage === pageSize ? (
              <span className='rouneded-tl-sm flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-bl-sm border bg-gray-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.products,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currentPage + 1).toString()
                  }).toString()
                }}
                className='rouneded-tl-sm flex h-8 w-8 items-center justify-center rounded-bl-sm border bg-white hover:bg-gray-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
