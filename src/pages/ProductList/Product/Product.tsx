import { Product as ProductType } from 'src/types/product.type'
import RatingStars from './RatingStars'
import {
  convertNumbertoSocialStyle,
  formatCurrency,
  generateNameId
} from 'src/utils/utils'
import { Link } from 'react-router-dom'
interface ProductProps {
  product: ProductType
}

export default function Product({ product }: ProductProps) {
  const { _id, name } = product
  const nameId = generateNameId({ name, id: _id })
  return (
    <Link
      to={`/${nameId}`}
      className='hover:border-orange block overflow-hidden rounded-sm border bg-white shadow transition-transform duration-100 hover:translate-y-[-0.1rem] hover:shadow-md'
    >
      <div className='relative w-full pt-[100%]'>
        <img
          src={product.image}
          alt={product.name}
          className='absolute left-0 top-0 h-full w-full object-cover'
        />
      </div>
      <div className='overflow-hidden p-2'>
        <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
        <div className='mt-3 flex items-center justify-start text-sm'>
          <div className='mr-2 max-w-[58%] truncate text-gray-500 line-through'>
            <span>₫</span>
            <span>{formatCurrency(product.price_before_discount)}</span>
          </div>
          <div className='text-orange truncate '>
            <span>₫</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>
        <div className='mt-3 flex items-center'>
          <div className='mr-2 flex items-center'>
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
                return <RatingStars key={index} percent={percent} />
              })}
          </div>
          <div className='mr-1 text-xs text-gray-500'>Đã bán</div>
          <div className='text-sm text-gray-500'>
            {convertNumbertoSocialStyle(product.sold)}
          </div>
        </div>
      </div>
    </Link>
  )
}
