import { useState } from 'react'
import InputNumber from '../InputNumber'
import { InputProps } from '../InputNumber/InputNumber'

interface Props extends InputProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  wrapperClassName?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  wrapperClassName = 'ml-8',
  value,
  ...rest
}: Props) {
  const [loacalValue, setLocalValue] = useState(value || 0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max && _value > max) {
      _value = max
    } else if (_value <= 1) _value = 1
    onType && onType(_value)
    setLocalValue(_value)
  }

  const handleDecreaseClick = () => {
    let _value = Number(value || loacalValue)
    if (_value <= 1) {
      _value = 1
    } else _value -= 1
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleIncreaseClick = () => {
    let _value = Number(value || loacalValue)
    if (max && _value >= max) {
      _value = max
    } else _value += 1
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const _value = Number(event.target.value)
    onFocusOut && onFocusOut(_value)
  }

  return (
    <div className={'flex items-center ' + wrapperClassName}>
      <button
        onClick={handleDecreaseClick}
        className='flex h-8 max-h-full w-8 items-center justify-center border-y border-l border-y-gray-200 border-l-gray-200'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        errorClassName='hidden'
        inputClassName='border border-gray-200 h-8 w-14 max-w-full max-h-full outline-none text-center'
        value={value || loacalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
      <button
        onClick={handleIncreaseClick}
        className='flex h-8 max-h-full w-8 items-center justify-center border-y border-r border-y-gray-200 border-r-gray-200'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </div>
  )
}
