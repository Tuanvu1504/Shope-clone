import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/contance/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.type'
import { filterPriceSchema } from 'src/utils/rules'
import RatingStarFilter from './RatingStarsFilter'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

export type FormPriceState = {
  price_min: string | undefined
  price_max: string | undefined
}

export default function Aside({ categories, queryConfig }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation(['home'])
  const { category: categoryParam } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormPriceState>({
    defaultValues: {
      price_max: '',
      price_min: ''
    },
    resolver: yupResolver(filterPriceSchema)
  })

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.products,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min || '',
        price_max: data.price_max || ''
      }).toString()
    })
  })

  const handleClearAllFilter = () => {
    navigate({
      pathname: path.products,
      search: createSearchParams(
        omit(queryConfig, [
          'price_min',
          'price_max',
          'rating_filter',
          'category'
        ])
      ).toString()
    })
    reset()
  }

  return (
    <div className='py-4 pr-4'>
      <Link
        to={path.products}
        className={classNames(' flex items-center font-bold uppercase', {
          'text-orange': !categoryParam
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside.all categories')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((category) => (
          <li key={category._id} className='rounded py-2 pl-2 '>
            <Link
              to={{
                pathname: path.products,
                search: createSearchParams({
                  ...queryConfig,
                  category: category._id
                }).toString()
              }}
              className={classNames('relative px-2 font-semibold', {
                'text-orange': category._id === categoryParam
              })}
            >
              {category._id === categoryParam && (
                <svg
                  viewBox='0 0 4 7'
                  className='fill-orange absolute left-[-10px] top-1 mr-2 h-2 w-2'
                >
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside.filter search')}
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div className='mb-4 font-semibold'>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    placeholder='₫ TỪ'
                    inputClassName='px-1 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    errorClassName='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            {/* <InputV2
              type='number'
              control={control}
              name='price_min'
              placeholder='₫ TỪ'
              inputClassName='px-1 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              errorClassName='hidden'
              onChange={() => {
                trigger('price_max')
              }}
            /> */}

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    placeholder='₫ ĐẾN'
                    inputClassName='px-1 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    errorClassName='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mb-2 mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>
            {errors.price_min?.message}
          </div>
          <Button className='bg-orange hover:bg-orange/80 flex w-full items-center justify-center rounded-sm p-2 text-sm uppercase text-white'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='mb-4 text-sm font-semibold'>Đánh giá</div>
      <RatingStarFilter queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleClearAllFilter}
        className='bg-orange hover:bg-orange/80 flex w-full items-center justify-center rounded-sm p-2 text-sm uppercase text-white'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
