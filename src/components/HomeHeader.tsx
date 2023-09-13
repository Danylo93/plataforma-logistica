import { MaterialIcons } from '@expo/vector-icons'
import { HStack, Heading, Icon, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'

import { useEffect, useState } from 'react'
import { api } from '../services/api'

import { useAuth } from '../hooks/useAuth'
import { UserDTO } from '@dtos/UserDTO'

export function HomeHeader() {
  const { signOut } = useAuth()
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function handleGetUser() {
    const { data } = await api.get('/users/me')
    setUser(data)
    console.log(data)
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <HStack bg="blue.500" pt={16} pb={5} px={8} alignItems="center">
      <VStack flex={1}>
        <Heading color="white" fontSize="lg" fontFamily="heading">
          Olá, {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color="white" size={6} />
      </TouchableOpacity>
    </HStack>
  )
}
