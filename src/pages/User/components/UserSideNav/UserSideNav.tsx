import classNames from 'classnames'
import { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import path from 'src/contance/path'
import { AppContextProvider } from 'src/contexts/AppContext'
import { getAvatarUrl } from 'src/utils/utils'

export default function UserSideNav() {
  const { user } = useContext(AppContextProvider)
  return (
    <div className='text-sm'>
      <div className='border-b-gray/10 flex items-center border-b py-4'>
        <Link
          to={path.profile}
          className='block h-12 w-12 shrink-0 overflow-hidden text-center'
        >
          <img
            src={getAvatarUrl(user?.avatar)}
            alt=''
            className='h-full w-full rounded-full object-cover'
          />
        </Link>
        <div className='ml-4 flex-grow'>
          <div className='font-semibold'>{user?.email}</div>
          <Link
            to={path.profile}
            className='mt-1 flex items-center capitalize text-gray-400'
          >
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className='mt-6'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames(' flex items-center', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 flex h-5 w-5 items-center justify-center'>
            <img
              className='h-full w-full object-cover'
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt=''
            />
          </div>
          Tài khoản của tôi
        </NavLink>
        <NavLink
          to={path.password}
          className={({ isActive }) =>
            classNames(' mt-4 flex items-center', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 flex h-5 w-5 items-center justify-center'>
            <img
              className='h-full w-full object-cover'
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt=''
            />
          </div>
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={path.historyPurchases}
          className={({ isActive }) =>
            classNames(' mt-4 flex items-center', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 flex h-5 w-5 items-center justify-center'>
            <img
              className='h-full w-full object-cover'
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt=''
            />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}
