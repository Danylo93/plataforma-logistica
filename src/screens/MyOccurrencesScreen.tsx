import { useEffect } from 'react'
import { VStack } from 'native-base'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type MyOccurrencesScreenProps = {
  route: {
    params: {
      // any proute params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

export function MyOccurrencesScreen({
  navigation,
  route,
}: MyOccurrencesScreenProps) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Minhas Ocorrências',
    })
  }, [])

  return <VStack flex={1}></VStack>
}
