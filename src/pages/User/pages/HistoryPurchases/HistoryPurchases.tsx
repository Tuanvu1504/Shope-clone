import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/contance/path'
import purchasesStatus from 'src/contance/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const statusTaps = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitingConfirm, name: 'Chờ xác nhận' },
  { status: purchasesStatus.getting, name: 'Đang lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang vận chuyển' },
  { status: purchasesStatus.delivered, name: 'Đã giao hàng' },
  { status: purchasesStatus.canceled, name: 'Đã hủy' }
]

export default function HistoryPurchases() {
  const params = useQueryParams() as { status: string }
  const status = Number(params.status) || purchasesStatus.all

  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', status],
    queryFn: () => purchaseApi.readPurchases(status as PurchaseListStatus)
  })
  const purchases = purchasesData?.data.data
  const renderTaps = () => {
    return statusTaps.map((tap) => (
      <Link
        key={tap.status}
        to={{
          pathname: path.historyPurchases,
          search: createSearchParams({
            status: String(tap.status)
          }).toString()
        }}
        className={classNames('flex-1 border-b-2 py-4 text-center', {
          'border-b-orange text-orange': status === tap.status,
          'border-b-gray-200 text-gray-700': status !== tap.status
        })}
      >
        {tap.name}
      </Link>
    ))
  }
  return (
    <div>
      <Helmet prioritizeSeoTags>
        <title>Purchase History | Shopee clone</title>
        <meta
          property='og:Purchase History | Shopee clone'
          content='your purchases history'
        />
      </Helmet>
      <div className='flex items-center rounded-sm bg-white shadow-sm'>
        {renderTaps()}
      </div>
      <div>
        {purchases &&
          purchases.length > 0 &&
          purchases.map((purchase) => (
            <div
              key={purchase._id}
              className='mt-4 rounded-sm bg-white p-4 shadow-sm'
            >
              <Link
                to={`/${generateNameId({
                  name: purchase.product.name,
                  id: purchase.product._id
                })}`}
                className='flex items-center border-b border-b-gray-200 pb-4 pt-2 text-sm'
              >
                <div className='border-orange h-20 w-20 shrink-0 overflow-hidden rounded-sm border'>
                  <img
                    src={purchase.product.image}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='ml-2 flex h-20 flex-1 flex-col items-start overflow-hidden py-2'>
                  <div className='line-clamp-1'>{purchase.product.name}</div>
                  <div className='mt-2'>x{purchase.buy_count}</div>
                </div>
                <div className='ml-6 flex items-center justify-center'>
                  <div className='mr-2 truncate text-gray-400 line-through'>
                    <span>₫</span>
                    <span>
                      {formatCurrency(purchase.product.price_before_discount)}
                    </span>
                  </div>
                  <div className='text-orange'>
                    <span>₫</span>
                    <span>{formatCurrency(purchase.product.price)}</span>
                  </div>
                </div>
              </Link>
              <div className='mt-6 flex items-center justify-end'>
                <svg
                  width={16}
                  height={17}
                  className='mr-1'
                  viewBox='0 0 253 263'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z'
                    fill='#ee4d2d'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z'
                    fill='#fff'
                  />
                </svg>
                <div className='mr-2 text-sm'>Thành tiền:</div>
                <div className='text-orange text-2xl'>
                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
