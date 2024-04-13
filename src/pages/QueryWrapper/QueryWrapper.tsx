/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}
  }
})
export default function QueryWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
