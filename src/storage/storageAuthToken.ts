import AsyncStorage from '@react-native-async-storage/async-storage'

import { AUTH_REFRESH, AUTH_STORAGE } from '../storage/storageConfig'

export async function storageAuthTokenSave(
  access_token: string,
  refresh_token: string,
) {
  await AsyncStorage.setItem(AUTH_STORAGE, access_token)
  await AsyncStorage.setItem(AUTH_REFRESH, refresh_token)
}

export async function storageAuthTokenGet() {
  return await AsyncStorage.getItem(AUTH_STORAGE)
}

export async function refreshGet() {
  return await AsyncStorage.getItem(AUTH_REFRESH)
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE)
  await AsyncStorage.removeItem(AUTH_REFRESH)
}
