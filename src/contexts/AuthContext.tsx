import { createContext, ReactNode, useEffect, useState } from 'react'

import {
  refreshGet,
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '../storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '../storage/storageUser'

import { UserDTO } from '../dtos/UserDTO'
import { api } from '../services/api'

import { useToast } from 'native-base'

export type AuthContextDataProps = {
  user: UserDTO
  singIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
  refreshedToken: string
  isAuthenticated: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const toast = useToast()
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [refreshedToken, setRefreshedToken] = useState('')
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  async function userAndTokenUpdate(access_token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${access_token}`
  }

  async function storageUserAndTokenSave(
    access_token: string,
    refresh_token: string,
  ) {
    try {
      setIsLoadingUserStorageData(true)
      await storageAuthTokenSave(access_token, refresh_token)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function singIn(username: string, password: string) {
    console.log('call login')
    try {
      const { data } = await api.post('/login', { username, password })
      console.log(data)
      setUser(data)
      setIsAuthenticated(true)
      console.log('userlogin data: ', data)
      if (!!data.access_token && !!data.refresh_token) {
        await storageUserAndTokenSave(data.access_token, data.refresh_token)
        userAndTokenUpdate(data.access_token)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserRemove()
      await storageAuthTokenRemove()
      setIsAuthenticated(false)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const refreshToken = await refreshGet()
      console.log('userLogged', userLogged)
      console.log('access_token', refreshToken)
      if (refreshToken) {
        // try to refresh token
        await api
          .post('/login/refresh', {
            refresh_token: refreshToken,
          })
          .then(async (response) => {
            const newSession = response.data

            await storageUserAndTokenSave(
              newSession.access_token,
              newSession.refresh_token,
            )

            userAndTokenUpdate(newSession.access_token)
            setIsAuthenticated(true)

            toast.closeAll()
            toast.show({
              title: 'Bem vindo de volta',
              bgColor: 'green.500',
              description: 'Sua sessão foi restaurada',
            })

            return response
          })
          .catch((error) => {
            toast.show({
              title: 'Sessão expirada',
              bgColor: 'red.500',
              description: 'Faça login novamente',
            })
            signOut()
          })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  function refreshTokenUpdated(newToken: string) {
    setRefreshedToken(newToken)
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
      refreshTokenUpdated,
    })

    return () => {
      subscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        singIn,
        signOut,
        isLoadingUserStorageData,
        refreshedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
