import { REACT_APP_API_URL } from '@env'
import axios, { AxiosInstance } from 'axios'

import { AppError } from '../utils/AppError'

import {
  refreshGet,
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '../storage/storageAuthToken'

type PromiseType = {
  resolve: (value?: unknown) => void
  reject: (reason: unknown) => void
}

export type ProccessQueueParams = {
  error: Error | null
  access_token: string | null
}

type RegisterInterceptTokenManagerProps = {
  signOut: () => void
  refreshTokenUpdated: (newToken: string) => void
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: ({}: RegisterInterceptTokenManagerProps) => () => void
}

const api = axios.create({
  // baseURL: REACT_APP_API_URL!,
  baseURL: `${REACT_APP_API_URL}`,
  headers: {
    // Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTTXhpRXRCU0dqVGliZXg2NkFnbDQ2bk1qeU40RW54b1g3R1g4eks3T2ZBIn0.eyJleHAiOjE2ODExMzMxOTcsImlhdCI6MTY4MTEzMjg5NywianRpIjoiNGNlYjUzZTgtNjU0Zi00ODAyLWEyOTktYzc5NmMyYTM2MzUyIiwiaXNzIjoiaHR0cDovLzE3Mi4xNy4wLjE6ODE4MC9hdXRoL3JlYWxtcy9hbGlhbnQiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYjNjYmY0YjktY2Q2Mi00ZTM3LWEwYzktMjI2NmE2ZTllZjE4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaW50ZWxpZ2VuY2UiLCJzZXNzaW9uX3N0YXRlIjoiYzYxZDcxOGQtMTUxNy00ZDg2LWFhMTgtNDBmYTdhOWZhZDZiIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDYiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWFsaWFudCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImludGVsaWdlbmNlIjp7InJvbGVzIjpbImFkbWluIiwidXNlciIsImNjbyIsIm9wZXJhdG9yIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzaWQiOiJjNjFkNzE4ZC0xNTE3LTRkODYtYWExOC00MGZhN2E5ZmFkNmIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJKb2huIERvZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImludGVsaWdlbmNlLmFwaSIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJlbWFpbCI6ImRhbnlsby5vbGl2ZWlyYUBpY3RzLmNvbS5iciJ9.KHnmoAsCM7CdKsVAKdESwdoTeFpXeNcGaMof6hvpPHWTYO55yVXioJei4aQ1gmw2wDyL95gGR9q8zPamyAmm1OxPRxbP57Xk7MzReaXEIwJidNm4EEQ1oQzmK12XBkrKLeg29dkUmYBNbmykzNV-nYI64KNvB_E8izwBp4xbbHSIvcrHA6cgWlYgAgoujKRZaxX2P0GjYD3DjzTXZBMVdORtO1D3-N8h1gKgerscFPsRzVwJxmA6B_xNMgtFXGz26G0JaZ4F1CK3S6eUYzETmQbsHKcZJTB8Fg19LQDMDSYQ-BxBMDtQV-EydyvRi-h_y32JL6S2firjPPnQzyEG1g`,
    // Accept: localStorage.getItem('il8nextLng'),
    'Content-Type': 'application/json',
  },
}) as APIInstanceProps

console.log('Chegando do token:')

let isRefreshing = false
let failedQueue: Array<PromiseType> = []

const proccessQueue = ({
  error,
  access_token = null,
}: ProccessQueueParams): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve(access_token)
    }
  })

  failedQueue = []
}

api.interceptors.request.use(async (request) => {
  const token = await storageAuthTokenGet()
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

api.registerInterceptTokenManager = ({ signOut, refreshTokenUpdated }) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError.response?.status === 401) {
        if (
          requestError.response.data?.message === 'access_token.expired' ||
          requestError.response.data?.message === 'access_token.invalid'
        ) {
          const oldToken = await storageAuthTokenGet()

          if (!oldToken) {
            signOut()
            return Promise.reject(requestError)
          }

          const originalRequest = requestError.config

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((access_token) => {
                originalRequest.headers.Authorization = `Bearer ${access_token}`
                return axios(originalRequest)
              })
              .catch((error) => {
                throw error
              })
          }

          isRefreshing = true

          return new Promise(async (resolve, reject) => {
            try {
              const refreshToken = await refreshGet()
              const { data } = await api.post('/login/refresh', {
                refresh_token: refreshToken,
              })
              console.log(data)
              await storageAuthTokenSave(data.access_token, data.refreshToken)

              api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
              originalRequest.headers.Authorization = `Bearer ${data.access_token}`

              refreshTokenUpdated(data.access_token)
              proccessQueue({
                error: null,
                access_token: data.access_token,
              })

              console.log('TOKEN ATUALIZADO')
              resolve(originalRequest)
            } catch (error: any) {
              proccessQueue({ error, access_token: null })
              signOut()
              reject(error)
            } finally {
              isRefreshing = false
            }
          })
        }

        signOut()
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message))
      } else {
        return Promise.reject(requestError)
      }
    },
  )

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  }
}

export { api }
