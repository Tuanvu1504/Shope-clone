import axios, { type AxiosError } from 'axios'
import config from 'src/contance/config'
import avatar from 'src/assets/images/avatar-svgrepo-com.svg'
import HttpStatusCode from 'src/contance/httpStatusCode'
import { ErrorResponseAPI } from 'src/types/utils.type'

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export const isUnprocessableEntityAxiosError = <T>(
  error: unknown
): error is AxiosError<T> => {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  )
}

export const isUnauthorizedAxiosError = <T>(
  error: unknown
): error is AxiosError<T> => {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Unauthorized
  )
}

export const isExpireTokenError = <T>(
  error: unknown
): error is AxiosError<T> => {
  return (
    isUnauthorizedAxiosError<
      ErrorResponseAPI<{ name: string; message: string }>
    >(error) && error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function convertNumbertoSocialStyle(number: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
    .toLowerCase()
}

export function discountCalculator(original: number, price: number) {
  return `${Math.round(((original - price) / original) * 100)}%`
}

export const removeSpecialCharacter = (str: string) =>
  str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s+/g, '-') + '-i-' + id
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export function handleStickyElement(element: HTMLElement) {
  const observer = new IntersectionObserver(
    function ([e]) {
      if (e.intersectionRatio < 1 && element)
        element.classList.add(
          'before:top-[-1.25rem]',
          'before:absolute',
          'before:left-0',
          'before:h-[1.25rem]',
          'before:w-full',
          'before:bg-[linear-gradient(transparent,rgba(0,0,0,.08))]'
        )
      if (e.intersectionRatio === 1 && element)
        element.classList.remove(
          'before:top-[-1.25rem]',
          'before:absolute',
          'before:left-0',
          'before:h-[1.25rem]',
          'before:w-full',
          'before:bg-[linear-gradient(transparent,rgba(0,0,0,.08))]'
        )
    },
    { threshold: [1] }
  )
  return observer.observe(element)
}

export const getAvatarUrl = (avatarName?: string) => {
  return avatarName ? `${config.baseURL}images/${avatarName}` : avatar
}
