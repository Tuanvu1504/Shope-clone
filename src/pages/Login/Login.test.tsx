import { fireEvent, screen, waitFor } from '@testing-library/react'
import path from 'src/contance/path'
import { logScreen, renderWithRoute } from 'src/utils/utilsTest'
import { beforeAll, describe, expect, it } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

describe('Login page', () => {
  let submitButton: HTMLButtonElement
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  beforeAll(async () => {
    renderWithRoute(path.login)
    await waitFor(async () =>
      expect(await screen.findByPlaceholderText(/Email/i)).toBeInTheDocument()
    )
    submitButton = document.querySelector(
      'form button[type="submit"]'
    ) as HTMLButtonElement
    emailInput = document.querySelector(
      'form input[type="email"]'
    ) as HTMLInputElement
    passwordInput = document.querySelector(
      'form input[type="password"]'
    ) as HTMLInputElement
  })

  it('show error message when submitted', async () => {
    // await user.click(SubmitButton as Element)
    fireEvent.submit(submitButton as HTMLButtonElement)
    await waitFor(() =>
      expect(screen.queryByText(/Email là bắt buộc/i)).toBeInTheDocument()
    )
    // await logScreen()
  })

  it('should display matching error when inputs value is invalid', async () => {
    fireEvent.input(emailInput as HTMLInputElement, {
      target: {
        value: 'abcemail'
      }
    })
    fireEvent.input(passwordInput as HTMLInputElement, {
      target: {
        value: '123'
      }
    })

    fireEvent.submit(submitButton as HTMLButtonElement)

    await waitFor(() => {
      expect(
        screen.queryByText(/Email không đúng định dạng/i)
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/Độ dài từ 6 đến 160 ký tự/i)
      ).toBeInTheDocument()
    })
    // await logScreen()
  })

  it('submit with correct input', async () => {
    fireEvent.input(emailInput as HTMLInputElement, {
      target: {
        value: 'abcd@gmail.com'
      }
    })
    fireEvent.input(passwordInput as HTMLInputElement, {
      target: {
        value: '123456'
      }
    })
    fireEvent.submit(submitButton as HTMLButtonElement)

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Điện Thoại Vsmart Active 3 6GB/64GB - Hàng Chính Hãng'
        )
      ).toBeTruthy()
    })
    await logScreen()
  })
})
