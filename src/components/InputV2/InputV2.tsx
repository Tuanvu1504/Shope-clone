import { useState } from 'react'
import {
  useController,
  UseControllerProps,
  FieldValues,
  FieldPath
} from 'react-hook-form'

export type InputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = React.InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName> & {
    message?: string
    inputClassName?: string
    errorClassName?: string
  }

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: InputProps<TFieldValues, TName>) {
  const {
    className,
    inputClassName = 'w-full p-3 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow text-sm',
    errorClassName = 'h-[1.25rem] text-red-500 mt-1',
    onChange,
    type,
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [loacalValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const isInputNumber =
      type === 'number' && (/^\d+$/.test(inputValue) || inputValue === '')
    if (isInputNumber || type !== 'number') {
      onChange && onChange(event)
      setLocalValue(inputValue)
      field.onChange(event)
    }
  }
  return (
    <div className={className}>
      <input
        {...field}
        {...rest}
        onChange={handleChange}
        className={inputClassName}
        value={value === undefined ? loacalValue : value}
      />
      <div className={errorClassName}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
