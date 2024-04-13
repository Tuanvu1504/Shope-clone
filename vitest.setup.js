import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import authRequests from './src/msw/auth.msw'
import userRequests from './src/msw/user.msw'
import productRequests from './src/msw/product.msw'
import categoryRequests from './src/msw/category.msw'
import purchaseRequests from './src/msw/purchase.msw'

const server = setupServer(
  ...authRequests,
  ...userRequests,
  ...productRequests,
  ...categoryRequests,
  ...purchaseRequests
)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
