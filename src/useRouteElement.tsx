import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import RegisterLayout from './Layouts/RegisterLayout'
// import Login from './pages/Login'
import ProductList from './pages/ProductList'
import { Suspense, lazy, useContext } from 'react'
import { AppContextProvider } from './contexts/AppContext'
import path from './contance/path'
import CartLayout from './Layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
// import Profile from './pages/User/pages/Profile'
// import Password from './pages/User/pages/Password'
// import HistoryPurchases from './pages/User/pages/HistoryPurchases'
// import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Password = lazy(() => import('./pages/User/pages/Password'))
const HistoryPurchases = lazy(
  () => import('./pages/User/pages/HistoryPurchases')
)
const NotFound = lazy(() => import('./pages/NotFound'))

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContextProvider)
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContextProvider)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.products,
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: path.product,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: path.user,
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.password,
                  element: (
                    <Suspense>
                      <Password />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchases,
                  element: (
                    <Suspense>
                      <HistoryPurchases />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    }
  ])
  return routeElement
}
