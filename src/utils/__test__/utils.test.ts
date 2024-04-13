import { describe, it, expect } from 'vitest'
import { isAxiosError, isUnprocessableEntityAxiosError } from '../utils'
import { AxiosError } from 'axios'
import HttpStatusCode from 'src/contance/httpStatusCode'

describe('isAiosError', () => {
  it('isAiosError should return boolean', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isUnprocessableEntityAxiosError', () => {
  it('isUnprocessableEntityAxiosError should return boolean', () => {
    expect(isUnprocessableEntityAxiosError(new Error())).toBe(false)
    expect(
      isUnprocessableEntityAxiosError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false)
    expect(
      isUnprocessableEntityAxiosError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity
        } as any)
      )
    ).toBe(true)
  })
})
