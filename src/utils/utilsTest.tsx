import { render, screen, waitFor, waitForOptions } from '@testing-library/react'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from 'src/App'
import { BrowserRouter } from 'react-router-dom'
import QueryWrapper from 'src/pages/QueryWrapper'
import AppContext, { getInitialAppContext } from 'src/contexts/AppContext'

export const delay = async (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time))

export const logScreen = async (
  body: HTMLElement = document.body.parentElement as HTMLElement,
  options?: waitForOptions
) => {
  const timeout = options ? (options.timeout as number) : 1000
  waitFor(
    async () => {
      expect(await delay(timeout)).tobe(true)
    },
    {
      ...options,
      timeout
    }
  )
  screen.debug(body, 9999999)
}

export const renderWithRoute = (route: string) => {
  window.history.pushState({}, 'test page', route)
  const defaultValue = getInitialAppContext()
  return {
    user: userEvent.setup(),
    ...render(
      <QueryWrapper>
        <AppContext defaultValue={defaultValue}>
          <App />
        </AppContext>
      </QueryWrapper>,
      { wrapper: BrowserRouter }
    )
  }
}
