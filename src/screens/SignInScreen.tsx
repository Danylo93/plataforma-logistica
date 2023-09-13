import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  useToast,
  Checkbox,
  HStack,
} from 'native-base'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button } from '../components/Button'
import { Input } from '../components/Input'

import { useAuth } from '../hooks/useAuth'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NODE_ENV, REACT_APP_API_URL } from '@env'

type SignInScreenProps = {
  route: {
    params: {
      // any proute params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

export function SignInScreen({ route, navigation }: SignInScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { singIn } = useAuth()
  const toas = useToast()
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  useEffect(() => {
    async function handleRememberMe() {
      const username = await AsyncStorage.getItem('username')
      const password = await AsyncStorage.getItem('password')
      if (username && password) {
        setRememberMe(true)
        setUsername(username)
        setPassword(password)
      }
    }
    handleRememberMe()
  }, [])

  function validateForm() {
    const newErrors = {}
    if (!username) {
      newErrors.username = { message: 'Informe um usuário' }
    }
    if (!password) {
      newErrors.password = { message: 'Informe uma senha' }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function clearErrors(fieldName) {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors }
      delete updatedErrors[fieldName]
      return updatedErrors
    })
  }

  async function handleSignIn() {
    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      await singIn(username, password)
      const title = 'Você se autenticou com sucesso'
      console.log('rememberMe: ', rememberMe)
      if (rememberMe) {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)
      } else {
        await AsyncStorage.removeItem('username')
        await AsyncStorage.removeItem('password')
      }

      toas.show({
        title,
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      const title = 'Usuário ou senha inválidos. Tente novamente'

      toas.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Center my={24}>
          <Text color="blue.500" fontSize={30} fontWeight="bold">
            Plataforma de
          </Text>

          <Text color="blue.500" fontSize={30}>
            Ocorrências Logísticas
          </Text>
        </Center>

        <Center>
          <Heading color="gray.900" fontSize="xl" mb={6} fontFamily="heading">
            Acesse sua conta
          </Heading>

          <Input
            placeholder="Usuario"
            value={username}
            onChangeText={(text) => {
              clearErrors('username')
              setUsername(text)
            }}
            errorMessage={errors.username?.message}
          />

          <Input
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              clearErrors('password')
              setPassword(text)
            }}
            errorMessage={errors.password?.message}
          />

          <HStack
            alignItems="center"
            alignSelf="flex-start"
            style={{ marginBottom: 20 }}
          >
            <Checkbox
              value={rememberMe.toString()}
              isChecked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            >
              <Text mx="2">Lembrar-se</Text>
            </Checkbox>
          </HStack>

          <Button
            title="Acessar"
            onPress={handleSignIn}
            isLoading={isLoading}
          />
        </Center>
        <Text>ENV: {REACT_APP_API_URL}</Text>
        <Text>ENV: {NODE_ENV}</Text>
      </VStack>
    </ScrollView>
  )
}
