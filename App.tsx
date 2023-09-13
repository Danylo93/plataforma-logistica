import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'react-native'
import { enableLatestRenderer } from 'react-native-maps'
import { QueryClientProvider } from 'react-query'
import { Loading } from './src/components/Loading'
import { Routes } from './src/routes/index'
import { THEME } from './src/theme'
import { AuthContextProvider } from './src/contexts/AuthContext'
import { queryClient } from './src/services/queryClient'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

// enableLatestRenderer()

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <BottomSheetModalProvider>
          <NativeBaseProvider theme={THEME}>
            <StatusBar barStyle="light-content" backgroundColor={'#00426b'} />

            <AuthContextProvider>
              <QueryClientProvider client={queryClient}>
                {fontsLoaded ? <Routes /> : <Loading />}
              </QueryClientProvider>
            </AuthContextProvider>
          </NativeBaseProvider>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
