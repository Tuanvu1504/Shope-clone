import range from 'lodash/range'
import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  message?: string
}

export default function DateSelect({ onChange, value, message }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1900
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 0,
        year: value?.getFullYear() || 1900
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)

    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
      <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
        Ngày sinh
      </div>
      <div className='col-span-3 grid grid-cols-3 gap-3'>
        <div className='col-span-1'>
          <select
            value={value?.getDate() || date.date}
            onChange={handleChange}
            name='date'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow'
          >
            <option disabled value=''>
              Ngày
            </option>
            {range(1, 32).map((items, index) => (
              <option value={items} key={index}>
                {items}
              </option>
            ))}
          </select>
        </div>
        <div className='col-span-1'>
          <select
            value={value?.getMonth() || date.month}
            onChange={handleChange}
            name='month'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow'
          >
            <option disabled value=''>
              Tháng
            </option>
            {range(0, 12).map((items, index) => (
              <option value={items} key={index}>
                {items + 1}
              </option>
            ))}
          </select>
        </div>
        <div className='col-span-1'>
          <select
            value={value?.getFullYear() || date.year}
            onChange={handleChange}
            name='year'
            className='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow'
          >
            <option disabled value=''>
              Năm
            </option>
            {range(1900, new Date().getFullYear() + 1).map((items, index) => (
              <option value={items} key={index}>
                {items}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
        {message}
      </div>
    </div>
  )
}
