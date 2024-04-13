import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'src/i18n/i18n.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppContext from './contexts/AppContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    },
    mutations: {
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContext>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AppContext>
    </BrowserRouter>
  </React.StrictMode>
)
