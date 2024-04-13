import { Link, createSearchParams } from 'react-router-dom'
import className from 'classnames'
import path from 'src/contance/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

const RANGE = 2

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function Pagination({ pageSize, queryConfig }: Props) {
  const currentPage = Number(queryConfig.page)
  const RenderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const page = index + 1
        if (
          currentPage <= RANGE * 2 + 1 &&
          page > currentPage + RANGE &&
          page <= pageSize - RANGE
        ) {
          if (!dotAfter) {
            dotAfter = true
            return <span key={index}>...</span>
          }
          return null
        } else if (
          currentPage > pageSize - RANGE * 2 - 1 &&
          page > RANGE &&
          page <= currentPage - RANGE - 1
        ) {
          if (!dotBefore) {
            dotBefore = true
            return <span key={index}>...</span>
          }
          return null
        } else if (
          currentPage > RANGE * 2 + 1 &&
          currentPage < pageSize - RANGE * 2
        ) {
          if (page > RANGE && page <= currentPage - RANGE - 1) {
            if (!dotBefore) {
              dotBefore = true
              return <span key={index}>...</span>
            }
            return null
          }
          if (page > currentPage + RANGE && page <= pageSize - RANGE) {
            if (!dotAfter) {
              dotAfter = true
              return <span key={index}>...</span>
            }
            return null
          }
        }

        return (
          <Link
            to={{
              pathname: path.products,
              search: createSearchParams({
                ...queryConfig,
                page: page.toString()
              }).toString()
            }}
            key={index}
            className={className(
              'hover:border-orange rounded border px-3 py-2 text-center',
              {
                'border-orange text-orange': page === currentPage
              }
            )}
          >
            {page}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {currentPage === 1 ? (
        <button className='cursor-not-allowed rounded border px-3 py-2 text-center'>
          Prev
        </button>
      ) : (
        <Link
          to={{
            pathname: path.products,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className='hover:border-orange rounded border px-3 py-2 text-center'
        >
          Prev
        </Link>
      )}
      <RenderPagination />
      {currentPage === pageSize ? (
        <button className='cursor-not-allowed rounded border px-3 py-2 text-center'>
          Next
        </button>
      ) : (
        <Link
          to={{
            pathname: path.products,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className='hover:border-orange rounded border px-3 py-2 text-center'
        >
          Next
        </Link>
      )}
    </div>
  )
}
