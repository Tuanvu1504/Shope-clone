import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex h-[calc(100vh-150px)] w-full items-center justify-center bg-white p-5'>
      <div className='text-center'>
        <div className='bg-orange/10 inline-flex rounded-full p-4'>
          <div className='bg-orange/20 stroke-orange/60 rounded-full p-4'>
            <svg
              className='h-16 w-16'
              viewBox='0 0 28 28'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14.0002 9.33337V14M14.0002 18.6667H14.0118M25.6668 14C25.6668 20.4434 20.4435 25.6667 14.0002 25.6667C7.55684 25.6667 2.3335 20.4434 2.3335 14C2.3335 7.55672 7.55684 2.33337 14.0002 2.33337C20.4435 2.33337 25.6668 7.55672 25.6668 14Z'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>
        <h1 className='mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]'>
          404 - Page not found
        </h1>
        <p className='mt-5 text-slate-600 lg:text-lg'>
          The page you are looking for doesn&apos;t exist or <br />
          has been removed.s
        </p>
        <Link
          to={`/`}
          className='bg-orange hover:bg-orange/80 mx-auto mt-3 block w-fit rounded-sm px-8 py-3 text-white shadow'
        >
          Trang chủ
        </Link>
      </div>
    </div>
  )
}
