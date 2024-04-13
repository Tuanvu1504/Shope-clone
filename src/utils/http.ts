import axios, {
  type AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/contance/httpStatusCode'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getUserFromLS,
  removeLS,
  setAccessTokenAndUserToLS,
  setRefreshTokenToLS
} from './auth'
import { AuthResponse } from 'src/types/auth.type'
import User from 'src/types/user.type'
import config from 'src/contance/config'
import { ErrorResponseAPI, SuccessResponseAPI } from 'src/types/utils.type'
import { isExpireTokenError, isUnauthorizedAxiosError } from './utils'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  private user: User | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.user = getUserFromLS()
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60,
        'expire-refresh-token': 60 * 60 * 24
      }
    })
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = this.accessToken
      }

      return config
    })

    this.instance.interceptors.response.use(
      (response) => {
        const url = response.config.url
        if (url === 'login' || url === 'register') {
          const data = (response.data as AuthResponse).data
          this.accessToken = data.access_token
          this.refreshToken = data.refresh_token
          this.user = data.user

          setAccessTokenAndUserToLS(this.accessToken, this.user)
          setRefreshTokenToLS(this.refreshToken)
        } else if (url === 'logout') {
          this.accessToken = ''
          this.refreshToken = ''
          this.user = null
          removeLS()
        }
        // console.log(response.data.data)

        return response
      },
      (error: AxiosError) => {
        const config = error.response?.config
        if (
          error.response?.status !== HttpStatusCode.UnprocessableEntity &&
          error.response?.status !== HttpStatusCode.Unauthorized
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        if (
          isUnauthorizedAxiosError<
            ErrorResponseAPI<{ name: string; message: string }>
          >(error)
        ) {
          if (
            isExpireTokenError(error) &&
            config?.url !== 'refresh-access-token'
          ) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => (this.refreshTokenRequest = null), 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              if (config) config.headers.Authorization = access_token
              return this.instance(config as InternalAxiosRequestConfig)
            })
          }
          removeLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private async handleRefreshToken() {
    try {
      const res = await this.instance.post<
        SuccessResponseAPI<{ access_token: string }>
      >('refresh-access-token', { refresh_token: this.refreshToken })
      const accessToken = res.data.data.access_token
      this.accessToken = accessToken
      setAccessTokenAndUserToLS(accessToken)
      return accessToken
    } catch (error) {
      removeLS()
      this.accessToken = ''
      this.refreshToken = ''
      throw error
    }
  }
}

const http = new Http().instance

export default http
