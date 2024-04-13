import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { toast } from 'react-toastify'
import keyBy from 'lodash/keyBy'
import { useContext, useEffect, useMemo, useRef } from 'react'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import purchasesStatus from 'src/contance/purchase'
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, handleStickyElement } from 'src/utils/utils'
import { Link, useLocation } from 'react-router-dom'
import { AppContextProvider } from 'src/contexts/AppContext'
import noCartImg from 'src/assets/images/no-cart.png'
import path from 'src/contance/path'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  const elemenRef = useRef<HTMLDivElement>(null)
  const { extraPurchaseList, setExtraPurchaseList } =
    useContext(AppContextProvider)
  const location = useLocation()

  const purchaseIdLocation =
    (location.state as { purchaseId: string })?.purchaseId || null

  const { data: purchaseListData, refetch } = useQuery({
    queryKey: ['purchase', purchasesStatus.inCart],
    queryFn: () =>
      purchaseApi.readPurchases(purchasesStatus.inCart as PurchaseListStatus)
  })
  const purchaseList = purchaseListData?.data.data

  useEffect(() => {
    if (!purchaseList) return
    setExtraPurchaseList((prev) => {
      const purchasesObj = keyBy(prev, '_id')
      return purchaseList.map((purchase) => {
        const isCheckedPurchaseFromLocation =
          purchaseIdLocation === purchase._id
        return {
          ...purchase,
          isChecked:
            isCheckedPurchaseFromLocation ||
            Boolean(purchasesObj[purchase._id]?.isChecked),
          isDisabled: false
        }
      })
    })
  }, [purchaseList, purchaseIdLocation, setExtraPurchaseList])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const isCheckedAll = extraPurchaseList.every(
    (purchase) => purchase.isChecked === true
  )

  const checkedPurchaseList = useMemo(() => {
    const list = extraPurchaseList.filter(
      (purchase) => purchase.isChecked === true
    )
    const currentTotal = list.reduce(
      (result, curr) => result + curr.product.price * curr.buy_count,
      0
    )
    const originTotal = list.reduce(
      (result, curr) =>
        result + curr.product.price_before_discount * curr.buy_count,
      0
    )
    return { list, originTotal, currentTotal }
  }, [extraPurchaseList])

  const handleCkeckedPurchase =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setExtraPurchaseList((prev) =>
        produce(prev, (draft) => {
          draft[index].isChecked = event.target.checked
        })
      )
    }

  const handleCheckedAll = () => {
    setExtraPurchaseList((prev) =>
      prev.map((purchase) => {
        return { ...purchase, isChecked: !isCheckedAll }
      })
    )
  }

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => refetch()
  })

  const handleUpdatePurchase =
    (index: number, max: number) => (value: number) => {
      const prevBuyCount = (purchaseList as Purchase[])[index].buy_count
      if (
        (prevBuyCount === 1 && value === 1) ||
        (prevBuyCount === max && value === max) ||
        prevBuyCount === value
      )
        return
      setExtraPurchaseList((prev) =>
        produce(prev, (draft) => {
          draft[index].isDisabled = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: extraPurchaseList[index].product._id,
        buy_count: value
      })
    }

  const handleChangePurchaseQuantity = (index: number) => (value: number) => {
    setExtraPurchaseList((prev) =>
      produce(prev, (draft) => {
        draft[index].buy_count = value
      })
    )
  }

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyPurchasesMutation = useMutation({
    mutationFn: purchaseApi.buyPurchases,
    onSuccess: (data) => {
      refetch(), toast.success(data.data.message)
    }
  })

  const handleDeletePurchase = (id: string) => {
    deletePurchasesMutation.mutate([id])
  }

  const handleDeleteManyPurchases = () => {
    const purchasesId = checkedPurchaseList.list.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchasesId)
  }

  const handleBuyPurchases = () => {
    const payload = checkedPurchaseList.list.map((purchase) => {
      return { product_id: purchase.product._id, buy_count: purchase.buy_count }
    })
    buyPurchasesMutation.mutate(payload)
  }

  elemenRef.current && handleStickyElement(elemenRef.current)

  if (!purchaseList) return
  return (
    <div className='bg-gray-100 py-8'>
      <Helmet prioritizeSeoTags>
        <title>Cart | Shopee clone</title>
        <meta
          property={`og:Cart | Shopee clone`}
          content='your shopee clone cart'
        />
      </Helmet>
      {extraPurchaseList.length > 0 ? (
        <div className='container'>
          <div className=' grid grid-cols-12 rounded-sm bg-white px-10 py-5 capitalize shadow-sm'>
            <div className='col-span-5 flex items-center'>
              <input
                type='checkbox'
                checked={isCheckedAll}
                onChange={handleCheckedAll}
                className='accent-orange h-5 w-5 shrink-0'
              />
              <span className='ml-4 text-sm'>Sản phẩm</span>
            </div>
            <div className=' col-span-7 grid grid-cols-5 items-center text-sm text-gray-400'>
              <div className='col-span-2'>
                <div className='text-center'>Đơn giá</div>
              </div>
              <div className='col-span-1'>
                <div className='text-center'>Số lượng</div>
              </div>
              <div className='col-span-1'>
                <div className='text-center'>Số tiền</div>
              </div>
              <div className='col-span-1'>
                <div className='text-center'>Thao tác</div>
              </div>
            </div>
          </div>
          {extraPurchaseList && (
            <div className='overflow-auto'>
              <div className='min-w-[1000px] border-l border-r border-l-gray-200 border-r-gray-200'>
                {extraPurchaseList.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='my-3 grid grid-cols-12 rounded-sm bg-white px-10 py-5 capitalize shadow-sm'
                  >
                    <div className='col-span-5 flex items-center'>
                      <input
                        type='checkbox'
                        className='accent-orange h-5 w-5 shrink-0'
                        checked={purchase.isChecked}
                        onChange={handleCkeckedPurchase(index)}
                      />
                      <div className='flex items-start'>
                        <div className='ml-4 h-20 w-20 shrink-0 overflow-hidden rounded-sm border'>
                          <img
                            src={purchase.product.image}
                            alt={purchase.product.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='ml-2 line-clamp-2 flex-1 pt-2 text-sm'>
                          {purchase.product.name}
                        </div>
                      </div>
                    </div>
                    <div className='col-span-7 grid grid-cols-5 items-center text-sm '>
                      <div className='col-span-2'>
                        <div className='text-center text-sm'>
                          <span className='text-gray-400 line-through'>
                            ₫
                            {formatCurrency(
                              purchase.product.price_before_discount
                            )}
                          </span>
                          <span className='ml-2'>
                            ₫{formatCurrency(purchase.product.price)}
                          </span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <div className='text-center'>
                          <QuantityController
                            disabled={purchase.isDisabled}
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            onDecrease={handleUpdatePurchase(
                              index,
                              purchase.product.quantity
                            )}
                            onIncrease={handleUpdatePurchase(
                              index,
                              purchase.product.quantity
                            )}
                            onFocusOut={handleUpdatePurchase(
                              index,
                              purchase.product.quantity
                            )}
                            onType={handleChangePurchaseQuantity(index)}
                            wrapperClassName='ml-0 cursor-not-allowed'
                          />
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <div className='text-center'>
                          <span className='text-orange'>
                            ₫
                            {formatCurrency(
                              purchase.product.price * purchase.buy_count
                            )}
                          </span>
                        </div>
                      </div>
                      <div className='col-span-1'>
                        <div className='text-center'>
                          <Button
                            className='hover:text-orange'
                            onClick={() => handleDeletePurchase(purchase._id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            ref={elemenRef}
            className=' sticky bottom-[-1px] left-0 z-10 mt-2 flex flex-col justify-between bg-white px-6 py-6 shadow-sm md:flex-row md:items-center'
          >
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={isCheckedAll}
                onChange={handleCheckedAll}
                className='accent-orange h-5 w-5 shrink-0'
              />
              <Button className='ml-4 capitalize' onClick={handleCheckedAll}>
                Chọn tất cả ({extraPurchaseList.length})
              </Button>
              <Button
                disabled={deletePurchasesMutation.isLoading}
                className='ml-4'
                onClick={handleDeleteManyPurchases}
              >
                Xóa
              </Button>
            </div>
            <div className='lg:item-center mt-3 flex flex-col items-end justify-end md:mt-0 lg:flex-row lg:items-center '>
              <div className='flex flex-col justify-end'>
                <div className='flex items-center'>
                  <span className='text-sm'>
                    Tổng thanh toán ({checkedPurchaseList.list.length} sản
                    phẩm):
                  </span>
                  <span className='text-orange ml-1 text-2xl'>
                    ₫{formatCurrency(checkedPurchaseList.currentTotal)}
                  </span>
                </div>
                <div className='flex justify-end text-sm'>
                  <span>Tiết kiệm</span>
                  <span className='text-orange ml-6'>
                    ₫
                    {formatCurrency(
                      checkedPurchaseList.originTotal -
                        checkedPurchaseList.currentTotal
                    )}
                  </span>
                </div>
              </div>
              <div className='flex w-full items-center md:w-auto'>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyPurchasesMutation.isLoading}
                  className='ml-3 mt-3 w-full rounded bg-red-500 px-14 py-[10px] capitalize text-white hover:bg-red-700 lg:mt-0'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='container py-10'>
          <div className='text-center'>
            <img src={noCartImg} alt='noCart' className='mx-auto h-32 w-32' />
            <div className='mt-5 text-center font-medium text-gray-400'>
              Giỏ hàng của bạn còn trống
            </div>
            <div className='mt-5'>
              <Link
                to={path.products}
                className='bg-orange hover:bg-orange/80 rounded-sm px-12 py-[10px] uppercase text-white outline-none transition-all'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
