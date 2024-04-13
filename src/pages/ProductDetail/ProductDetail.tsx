import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import {
  discountCalculator,
  formatCurrency,
  getIdFromNameId,
  isUnauthorizedAxiosError
} from 'src/utils/utils'
import RatingStars from '../ProductList/Product/RatingStars'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Product as ProductType, ProductConfig } from 'src/types/product.type'
import Product from '../ProductList/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { toast } from 'react-toastify'
import purchasesStatus from 'src/contance/purchase'
import path from 'src/contance/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export default function ProductDetail() {
  const { nameId } = useParams()
  const navigate = useNavigate()
  const id = getIdFromNameId(nameId as string)
  const { t } = useTranslation(['product'])
  const [activeImage, setActiveImage] = useState('')
  const [buyCount, setBuyCount] = useState(1)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const imageRef = useRef<HTMLImageElement>(null)
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id as string)
  })
  const product = data?.data.data
  const productsConfig: ProductConfig = {
    page: 1,
    limit: 20,
    category: product?.category._id
  }
  const { data: productsData } = useQuery({
    queryKey: ['products', productsConfig],
    queryFn: () => productApi.getProductList(productsConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const purchaseMutation = useMutation({
    mutationFn: purchaseApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['purchase', purchasesStatus.inCart]
      })
    },
    onError: (err) => {
      if (isUnauthorizedAxiosError(err)) navigate(path.login)
    }
  })

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const handleAndToCart = () => {
    purchaseMutation.mutate(
      {
        product_id: (product as ProductType)._id,
        buy_count: buyCount
      },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 2000 })
        },
        onError: (err) => {
          if (isUnauthorizedAxiosError(err)) navigate(path.login)
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await purchaseMutation.mutateAsync({
      product_id: (product as ProductType)._id,
      buy_count: buyCount
    })

    navigate(path.cart, {
      state: { purchaseId: res.data.data._id }
    })
  }

  useEffect(() => {
    if (product) setActiveImage(product.images[0])
  }, [product])

  const next = () => {
    if (product && currentIndexImages[1] < product.images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (product && currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const { offsetX, offsetY } = event.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height) + 'px'
    const left = offsetX * (1 - naturalWidth / rect.width) + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.width = naturalWidth + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top
    image.style.left = left
  }

  const handleClearZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return
  return (
    <div className='bg-gray-100 pb-10 pt-8 '>
      <Helmet prioritizeSeoTags>
        <title>{product.name}</title>
        <meta
          property={`og:${product.name}`}
          content={convert(product.description, {
            limits: { maxInputLength: 150 }
          })}
        />
      </Helmet>
      <div className='container rounded-sm bg-white py-4 shadow-sm'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-5'>
            <div
              className='relative w-full cursor-zoom-in overflow-hidden  rounded-sm pt-[100%]'
              onMouseMove={handleZoom}
              onMouseLeave={handleClearZoom}
            >
              <img
                ref={imageRef}
                src={activeImage || product.image}
                alt={product.name}
                className='pointer-events-none absolute left-0 top-0 h-full max-w-full object-cover'
              />
            </div>
            <div className='relative mt-3 grid select-none grid-cols-5 gap-3'>
              {product.images
                .slice(...currentIndexImages)
                .map((image, index) => (
                  <div
                    key={index}
                    className='relative col-span-1 cursor-pointer'
                    onMouseEnter={() => setActiveImage(image)}
                  >
                    <div className=' relative w-full overflow-hidden rounded-sm pt-[100%]'>
                      <img
                        src={image}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full object-cover'
                      />
                    </div>
                    <div
                      className={classNames(
                        ' absolute left-0 top-0 h-full w-full border-2 bg-transparent',
                        {
                          'border-orange': activeImage === image
                        }
                      )}
                    />
                  </div>
                ))}
              <button
                onClick={prev}
                className='absolute left-0 top-1/2 flex h-10 w-6 -translate-y-[50%] cursor-pointer items-center justify-center rounded-sm bg-black/10 hover:bg-black/20'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  className='h-6 w-6 stroke-gray-500 hover:stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </button>
              <button
                onClick={next}
                className='absolute right-0 top-1/2 flex h-10 w-6 -translate-y-[50%] cursor-pointer items-center justify-center rounded-sm bg-black/10 hover:bg-black/20'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  className='h-6 w-6 stroke-gray-500 hover:stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='col-span-7 p-2'>
            <h1 className='text-2xl'>{product.name}</h1>
            <div className='mt-3 flex items-center'>
              <div className='text-orange text-lg underline'>
                {product.rating}
              </div>
              <div className='ml-1 flex items-center'>
                {Array(5)
                  .fill(0)
                  .map((_, index) => {
                    const x = index + 1 - product.rating
                    let percent
                    if (x <= 0) {
                      percent = 100
                    } else if (x > 0 && x < 1) {
                      percent = (1 - x) * 100
                    } else percent = 0
                    return (
                      <RatingStars
                        mainStarClassName='h-4 w-4 fill-orange'
                        subStarClassName='h-4 w-4 fill-gray-300'
                        key={index}
                        percent={percent}
                      />
                    )
                  })}
              </div>
              <div className='mx-6 h-6 w-[1px] bg-gray-300'></div>
              <div className='text-lg'>{product.sold}</div>
              <div className='ml-1 text-gray-500'>Đã bán</div>
            </div>
            <div className='mt-4 flex items-center rounded-sm bg-gray-100 p-4'>
              <div className='tex-lg text-gray-500 line-through'>
                ₫{formatCurrency(product.price_before_discount)}
              </div>
              <div className='text-orange ml-2 text-3xl'>
                ₫{formatCurrency(product.price)}
              </div>
              <div className='bg-orange ml-3 rounded-sm px-1 py-[2px] text-xs text-white'>
                {discountCalculator(
                  product.price_before_discount,
                  product.price
                )}{' '}
                GIẢM
              </div>
            </div>
            <div className='mt-8 flex items-center'>
              <div className='text-md text-gray-500'>Số lượng</div>
              <QuantityController
                onDecrease={handleBuyCount}
                onIncrease={handleBuyCount}
                onType={handleBuyCount}
                value={buyCount}
                max={product.quantity}
              />
              <div className='ml-4 flex items-center text-sm text-gray-500'>
                {product.quantity}{' '}
                <span className='ml-1'>{t('available products')}</span>
              </div>
            </div>
            <div className='mt-6 flex items-center justify-start gap-3'>
              <Button
                onClick={handleAndToCart}
                className='border-orange bg-orange/10 hover:bg-orange/5 text-orange flex h-12 items-center rounded-sm border px-6'
              >
                <svg
                  enableBackground='new 0 0 15 15'
                  viewBox='0 0 15 15'
                  x={0}
                  y={0}
                  className='text-orange stroke-orange mr-2 h-6 w-6 fill-current'
                >
                  <g>
                    <g>
                      <polyline
                        fill='none'
                        points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeMiterlimit={10}
                      />
                      <circle cx={6} cy='13.5' r={1} stroke='none' />
                      <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                    </g>
                    <line
                      fill='none'
                      strokeLinecap='round'
                      strokeMiterlimit={10}
                      x1='7.5'
                      x2='10.5'
                      y1={7}
                      y2={7}
                    />
                    <line
                      fill='none'
                      strokeLinecap='round'
                      strokeMiterlimit={10}
                      x1={9}
                      x2={9}
                      y1='8.5'
                      y2='5.5'
                    />
                  </g>
                </svg>
                Thêm vào giỏ hàng
              </Button>
              <Button
                onClick={buyNow}
                className='bg-orange hover:bg-orange/90 h-12 rounded-sm px-6 text-white'
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='container mt-6 rounded-sm bg-white shadow-sm'>
        <div className='px-4 py-8'>
          <div className='text-xl uppercase'>Chi tiết sản phẩm</div>
          <div className='mb-4 mt-10 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className='container mt-6 rounded-sm bg-white py-6 shadow-sm'>
        <h1 className='text-xl uppercase text-gray-600'>
          Có thể bạn cũng thích
        </h1>
        <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {productsData &&
            productsData.data.data.products.map((product) => {
              return (
                <div key={product._id} className='col-span-1'>
                  <Product product={product} />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
