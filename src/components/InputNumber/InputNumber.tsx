import { forwardRef, useState } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  message?: string
  inputClassName?: string
  errorClassName?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputProps>(
  function InnerInput(
    {
      className,
      message,
      inputClassName = 'w-full p-3 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow text-sm',
      errorClassName = 'h-[1.25rem] text-red-500 mt-1',
      onChange,
      value = '',
      ...rest
    },
    ref
  ) {
    const [loacalValue, setLocalValue] = useState(value)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (/^\d+$/.test(value) || value === '') {
        onChange && onChange(event)
        setLocalValue(value)
      }
    }
    return (
      <div className={className}>
        <input
          ref={ref}
          onChange={handleChange}
          className={inputClassName}
          value={value === undefined ? loacalValue : value}
          {...rest}
        />
        <div className={errorClassName}>{message}</div>
      </div>
    )
  }
)

export default InputNumber
