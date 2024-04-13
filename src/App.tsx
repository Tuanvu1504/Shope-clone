import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import { AppContextProvider } from './contexts/AppContext'
import useRouteElement from './useRouteElement'
import { removeLSEventTarget } from './utils/auth'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContextProvider)

  useEffect(() => {
    removeLSEventTarget.addEventListener('removeLS', reset)
    return () => {
      removeLSEventTarget.removeEventListener('removeLS', reset)
    }
  }, [reset])
  return (
    <div>
      <HelmetProvider>
        <ErrorBoundary>
          {routeElement}
          <ToastContainer />
        </ErrorBoundary>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

export default App
