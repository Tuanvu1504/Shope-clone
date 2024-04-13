import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import path from './contance/path'
import { logScreen, renderWithRoute } from './utils/utilsTest'

expect.extend(matchers)

describe('App', () => {
  test('should render and react', async () => {
    // const user = userEvent.setup()
    // render(<App />, {
    //   wrapper: BrowserRouter
    // })

    const { user } = renderWithRoute('/')

    await waitFor(() => {
      expect(screen.getByText('Bộ lọc tìm kiếm').textContent).toBe(
        'Bộ lọc tìm kiếm'
      )
    })

    await user.click(screen.getByText('Đăng nhập'))
    await waitFor(() => {
      expect(screen.queryByText(/Bạn chưa có tài khoản?/i)).toBeInTheDocument()
    })

    // screen.debug(document.body.parentElement as HTMLElement, 9999999)
    // await logScreen()
  })

  test('should render notfound page', async () => {
    const route = '/pages/notfound'
    renderWithRoute(route)

    // render(
    //   <MemoryRouter initialEntries={[route]}>
    //     <App />
    //   </MemoryRouter>
    // )

    await waitFor(() => {
      expect(screen.queryByText(/404 - Page not found/i)).toBeInTheDocument()
    })

    // await logScreen()
  })

  test('should render register page', async () => {
    // window.history.pushState({}, 'test page', path.register)
    // render(<App />, { wrapper: BrowserRouter })

    // render(
    //   <MemoryRouter initialEntries={[path.register]}>
    //     <App />
    //   </MemoryRouter>
    // )

    renderWithRoute(path.register)
    await waitFor(() => {
      expect(screen.queryByText(/Bạn đã có tài khoản?/i)).toBeTruthy()
    })

    await logScreen()
  })
})
