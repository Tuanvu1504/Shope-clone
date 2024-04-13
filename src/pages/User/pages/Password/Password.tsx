import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { InferType } from 'yup'
import { profileSchema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import omit from 'lodash/omit'
import { isUnprocessableEntityAxiosError } from 'src/utils/utils'
import { ErrorResponseAPI } from 'src/types/utils.type'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<
  InferType<typeof profileSchema>,
  'confirm_password' | 'new_password' | 'password'
>
const passwordSchema = profileSchema.pick([
  'new_password',
  'password',
  'confirm_password'
])

export default function Password() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      confirm_password: '',
      new_password: '',
      password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation(userApi.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(
        omit(data, 'confirm_password')
      )
      reset()
      toast.success(res.data.message)
    } catch (error) {
      if (isUnprocessableEntityAxiosError<ErrorResponseAPI<FormData>>(error)) {
        const formData = error.response?.data.data
        if (formData) {
          Object.keys(formData).forEach((key) => {
            setError(key as keyof FormData, {
              message: formData[key as keyof FormData]
            })
          })
        }
      }
    }
  })
  return (
    <div className='rounded-sm border border-gray-200 bg-white px-6 pb-6 text-sm shadow-sm'>
      <Helmet prioritizeSeoTags>
        <title>Change Password | Shopee clone</title>
        <meta
          property='og:Change Password | Shopee clone'
          content='change your password'
        />
      </Helmet>
      <div className='border-b border-b-gray-200 py-4'>
        <div className='text-xl capitalize'>Đổi mật khẩu</div>
        <div className='mt-1 text-gray-500'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form onSubmit={onSubmit} className='flex justify-center py-8'>
        <div className='flex w-full flex-col md:w-[70%]'>
          <div className='mt-6 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Mật khẩu cũ
            </div>
            <div className='col-span-3'>
              <Input
                type='password'
                className='relative'
                name='password'
                register={register}
                errorClassName='hidden'
                inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.password?.message}
            </div>
          </div>
          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Mật khẩu mới
            </div>
            <div className='col-span-3'>
              <Input
                type='password'
                className='relative'
                name='new_password'
                register={register}
                errorClassName='hidden'
                inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.new_password?.message}
            </div>
          </div>
          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Nhập lại mật khẩu
            </div>
            <div className='col-span-3'>
              <Input
                type='password'
                className='relative'
                name='confirm_password'
                register={register}
                errorClassName='hidden'
                inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.confirm_password?.message}
            </div>
          </div>
          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-3 col-start-2'>
              <Button
                type='submit'
                className='bg-orange hover:bg-orange/80 rounded-sm px-5 py-2 text-white outline-none'
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
