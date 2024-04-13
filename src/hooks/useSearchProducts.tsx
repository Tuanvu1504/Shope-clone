import { createSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { InferType } from 'yup'
import { searchNameSchema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import path from 'src/contance/path'
import omit from 'lodash/omit'
import useQueryConfig from './useQueryConfig'

type FormData = InferType<typeof searchNameSchema>

export default function useSearchProducts() {
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(searchNameSchema)
  })

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.products,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['category', 'rating_filter', 'price_min', 'price_max']
        )
      ).toString()
    })
  })
  return { register, onSubmit }
}
