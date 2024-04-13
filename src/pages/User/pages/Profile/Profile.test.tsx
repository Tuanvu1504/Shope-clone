import { waitFor, screen } from '@testing-library/react'
import path from 'src/contance/path'
import { accessToken } from 'src/msw/auth.msw'
import { meRes } from 'src/msw/user.msw'
import User from 'src/types/user.type'
import { setAccessTokenAndUserToLS } from 'src/utils/auth'
import { logScreen, renderWithRoute } from 'src/utils/utilsTest'
import { describe, it, expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

describe('porfile page', () => {
  it('should render profile page', async () => {
    setAccessTokenAndUserToLS(accessToken, meRes.data as User)
    renderWithRoute(path.profile)
    await waitFor(
      async () => {
        expect(
          screen.queryByText('Quản lý thông tin hồ sơ để bảo mật tài khoản')
        ).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
    await logScreen()
  })
})
