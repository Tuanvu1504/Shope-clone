import { useContext } from 'react'
import Popover from '../Popover'
import { AppContextProvider } from 'src/contexts/AppContext'
import { Link } from 'react-router-dom'
import path from 'src/contance/path'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const { setIsAuthenticated, isAuthenticated, user } =
    useContext(AppContextProvider)

  const { i18n } = useTranslation()
  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  const currentLanguage = locales[i18n.language as keyof typeof locales]

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => setIsAuthenticated(false)
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  return (
    <div className='flex cursor-pointer items-center justify-end py-1 text-sm text-white'>
      <Popover
        className='flex items-center hover:text-gray-300'
        renderPopover={
          <div className='flex min-w-[200px] cursor-pointer flex-col rounded bg-white p-4 text-black shadow-md '>
            <button
              onClick={() => handleChangeLanguage('vi')}
              className='hover:text-orange block w-full cursor-pointer text-left'
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => handleChangeLanguage('en')}
              className='hover:text-orange mt-4 block w-full cursor-pointer text-left'
            >
              English
            </button>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='mr-1 h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='ml-1 h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 8.25l-7.5 7.5-7.5-7.5'
          />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='ml-4 flex items-center hover:text-gray-300'
          renderPopover={
            <div className='flex min-w-[180px] cursor-pointer flex-col rounded bg-white p-4 text-black shadow-md '>
              <Link
                to={path.profile}
                className='w-full cursor-pointer hover:text-[#00bfa5]'
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchases}
                className='mt-4 w-full cursor-pointer hover:text-[#00bfa5]'
              >
                Đơn mua
              </Link>
              <button
                onClick={handleLogout}
                className='mt-4 w-full cursor-pointer text-left hover:text-[#00bfa5]'
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div>
            <img
              src={getAvatarUrl(user?.avatar)}
              alt='avata'
              className='mr-1 h-6 w-6 rounded-full object-cover'
            />
          </div>
          <div>{user?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='ml-4 flex items-center justify-between gap-4 '>
          <Link to={path.register} className=' text-white hover:text-gray-300'>
            Đăng ký
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40'></div>
          <Link to={path.login} className='text-white hover:text-gray-300'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}
