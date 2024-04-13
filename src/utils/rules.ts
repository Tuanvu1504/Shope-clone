import * as yup from 'yup'

import { type RegisterOptions, UseFormGetValues } from 'react-hook-form'
type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      // eslint-disable-next-line no-useless-escape
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Email không đúng định dạng'
    },
    minLength: {
      value: 5,
      message: 'Độ dài email từ 5 đến 160 ký tự'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài email từ 5 đến 160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Độ dài password từ 6 đến 160 ký tự'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài password từ 6 đến 160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại Password là bắt buộc'
    },
    minLength: {
      value: 6,
      message: 'Độ dài password từ 6 đến 160 ký tự'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài password từ 6 đến 160 ký tự'
    },
    validate:
      typeof getValues === 'function'
        ? (value) =>
            value === getValues('password') ||
            'Nhập lại password không chính xác'
        : undefined
  }
})

const confirmPasswordRule = (ref: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 đến 160 ký tự')
    .max(160, 'Độ dài từ 6 đến 160 ký tự')
    .oneOf([yup.ref(ref)], 'Nhập lại password không chính xác')
}

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 đến 160 ký tự')
    .max(160, 'Độ dài từ 5 đến 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 đến 160 ký tự')
    .max(160, 'Độ dài từ 6 đến 160 ký tự'),
  confirm_password: confirmPasswordRule('password')
})

export const loginSchema = registerSchema.omit(['confirm_password'])

export const searchNameSchema = yup.object({
  name: yup.string().trim().required()
})

function priceMinMaxRule(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as {
    price_min: string
    price_max: string
  }
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

export const filterPriceSchema = yup.object({
  price_min: yup.string().test({
    name: 'price_rule',
    message: 'Giá nhập vào không hợp lệ',
    test: priceMinMaxRule
  }),
  price_max: yup.string().test({
    name: 'price_rule',
    message: 'Giá nhập vào không hợp lệ',
    test: priceMinMaxRule
  })
})

export const profileSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Vui lòng nhập ngày trong quá khứ'),
  password: registerSchema.fields['password'] as yup.StringSchema<
    string,
    yup.AnyObject,
    undefined,
    ''
  >,
  new_password: registerSchema.fields['password'] as yup.StringSchema<
    string,
    yup.AnyObject,
    undefined,
    ''
  >,
  confirm_password: confirmPasswordRule('new_password') as yup.StringSchema<
    string,
    yup.AnyObject,
    undefined,
    ''
  >
})
