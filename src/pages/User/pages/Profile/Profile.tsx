import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import avatar from 'src/assets/images/avatar-svgrepo-com.svg'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputFile from 'src/components/InputFile'
import InputNumber from 'src/components/InputNumber'
import { AppContextProvider } from 'src/contexts/AppContext'
import { ErrorResponseAPI } from 'src/types/utils.type'
import { setAccessTokenAndUserToLS } from 'src/utils/auth'
import { profileSchema } from 'src/utils/rules'
import { getAvatarUrl, isUnprocessableEntityAxiosError } from 'src/utils/utils'
import DateSelect from '../../components/DateSelect'
import { Helmet } from 'react-helmet-async'

type UpdateFormData = {
  address: string | undefined
  name: string | undefined
  phone: string | undefined
  avatar: string | undefined
  date_of_birth: Date | undefined
}

type ErrorUpdateFormData = Omit<UpdateFormData, 'date_of_birth'> & {
  date_of_birth: string
}

const updateProfileSchema = profileSchema.pick([
  'name',
  'avatar',
  'address',
  'date_of_birth',
  'phone'
])

export default function Profile() {
  const { setUser } = useContext(AppContextProvider)
  const [file, setFile] = useState<File>()
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
  }, [file])

  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
    setValue
  } = useForm<UpdateFormData>({
    defaultValues: {
      address: '',
      avatar: '',
      date_of_birth: new Date(1900, 0, 1),
      name: '',
      phone: ''
    },
    resolver: yupResolver(updateProfileSchema)
  })

  useEffect(() => {
    if (profile) {
      setValue('address', profile.address || '')
      setValue('avatar', profile.avatar || '')
      setValue('name', profile.name || '')
      setValue('phone', profile.phone || '')
      setValue(
        'date_of_birth',
        profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : new Date(1990, 0, 1)
      )
    }
  }, [profile, setValue])

  const handleFileInputChange = (file?: File) => {
    if (file) setFile(file)
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        avatar: avatarName
      })
      refetch()
      setValue('avatar', res.data.data.avatar || avatar)
      setAccessTokenAndUserToLS(undefined, res.data.data)
      setUser(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      if (
        isUnprocessableEntityAxiosError<ErrorResponseAPI<ErrorUpdateFormData>>(
          error
        )
      ) {
        const formData = error.response?.data.data
        if (formData) {
          Object.keys(formData).forEach((key) => {
            setError(key as keyof ErrorUpdateFormData, {
              message: formData[key as keyof ErrorUpdateFormData]
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm border border-gray-200 bg-white px-6 pb-6 text-sm shadow-sm'>
      <Helmet prioritizeSeoTags>
        <title>Profile | Shopee clone</title>
        <meta
          property='og:Profile | Shopee clone'
          content='your shopee clone profile'
        />
      </Helmet>
      <div className='border-b border-b-gray-200 py-4'>
        <div className='text-xl capitalize'>Hồ sơ của tôi</div>
        <div className='mt-1 text-gray-500'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form
        onSubmit={onSubmit}
        className='flex flex-col-reverse py-8 md:flex-row'
      >
        <div className='flex w-full flex-col md:w-[60%]'>
          <div className='mt-3 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Email
            </div>
            <div className='col-span-3 items-center justify-start'>
              {profile?.email}
            </div>
          </div>
          <div className='mt-6 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Tên
            </div>
            <div className='col-span-3'>
              <Input
                name='name'
                register={register}
                errorClassName='hidden'
                inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.name?.message}
            </div>
          </div>

          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Số điện thoại
            </div>
            <div className='col-span-3'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value}
                    errorClassName='hidden'
                    onChange={field.onChange}
                    inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
                  />
                )}
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.phone?.message}
            </div>
          </div>
          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-1 flex items-center justify-end text-right text-gray-500'>
              Địa chỉ
            </div>
            <div className='col-span-3'>
              <Input
                name='address'
                register={register}
                errorClassName='hidden'
                inputClassName='w-full px-3 py-2 border rounded outline-none border-gray-300 focus:border-gray-500 focus:shadow'
              />
            </div>
            <div className='col-span-3 col-start-2 mt-1 h-[1.25rem] text-red-500'>
              {errors.address?.message}
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect
                message={errors.date_of_birth?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className='mt-2 grid w-full grid-cols-4 items-center justify-center gap-x-6'>
            <div className='col-span-3 col-start-2'>
              <Button
                type='submit'
                className='bg-orange hover:bg-orange/80 rounded-sm px-5 py-2 text-white outline-none'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='mx-10 hidden h-[200px] w-[1px] bg-gray-200 md:block'></div>
        <div className='flex flex-grow flex-col items-center py-6'>
          <div className='flex h-24 w-24 items-center justify-center overflow-hidden'>
            <img
              src={previewAvatar || getAvatarUrl(profile?.avatar)}
              alt=''
              className='h-full w-full rounded-full object-cover'
            />
          </div>
          <InputFile onChange={handleFileInputChange} />
          <div className='w-fit'>
            <div className='mt-3 text-left text-gray-400'>
              Dung lượng file tối đa 1 MB
            </div>
            <div className='text-left text-gray-400'>Định dạng:.JPEG, .PNG</div>
          </div>
        </div>
      </form>
    </div>
  )
}
