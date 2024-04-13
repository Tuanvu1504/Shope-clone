import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Input from 'src/components/Input'
import { registerSchema } from 'src/utils/rules'
import { InferType } from 'yup'
import authApi from 'src/apis/auth.api'
import omit from 'lodash/omit'
import { isUnprocessableEntityAxiosError } from 'src/utils/utils'
import { ErrorResponseAPI } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContextProvider } from 'src/contexts/AppContext'
import Button from 'src/components/Button'
import path from 'src/contance/path'
import { Helmet } from 'react-helmet-async'

type FormData = InferType<typeof registerSchema>

export default function Register() {
  const { setIsAuthenticated, setUser } = useContext(AppContextProvider)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) =>
      authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setUser(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (
          isUnprocessableEntityAxiosError<
            ErrorResponseAPI<Omit<FormData, 'confirm_password'>>
          >(error)
        ) {
          const formData = error.response?.data.data
          if (formData) {
            Object.keys(formData).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message:
                  formData[key as keyof Omit<FormData, 'confirm_password'>]
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Helmet prioritizeSeoTags>
        <title>Register | Shopee clone</title>
        <meta
          property='og:Register | Shopee clone'
          content='register an account'
        />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-24'>
          <div className='lg:col-span-2 lg:col-start-4 '>
            <form
              noValidate
              onSubmit={onSubmit}
              className='border-sm flex flex-col justify-center rounded border bg-white px-4 py-8 shadow-md'
            >
              <div className='text-3xl'>Đăng ký</div>
              <Input
                type='email'
                name='email'
                register={register}
                className='mt-8'
                message={errors.email?.message}
                placeholder='Email'
              />
              <Input
                type='password'
                name='password'
                register={register}
                className='mt-3'
                closeEyeClassName='right-4 top-4'
                openEyeClassName='right-4 top-3'
                message={errors.password?.message}
                placeholder='Password'
              />
              <Input
                type='password'
                name='confirm_password'
                register={register}
                className='mt-3'
                closeEyeClassName='right-4 top-4'
                openEyeClassName='right-4 top-3'
                message={errors.confirm_password?.message}
                placeholder='Confirm Password'
              />

              <Button
                isLoading={registerAccountMutation.isLoading}
                className='mt-4 flex w-full items-center justify-center rounded bg-red-500 p-3 text-white hover:bg-red-700'
              >
                Đăng ký
              </Button>
              <div className='mt-8 flex items-center justify-center'>
                <div className='text-gray-400'>Bạn đã có tài khoản?</div>
                <Link to={path.login} className='text-orange ml-1'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
