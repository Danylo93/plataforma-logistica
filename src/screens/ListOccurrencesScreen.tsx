import { useState, useCallback, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { VStack } from 'native-base'
import { api } from '../services/api'

import { HomeHeader } from '../components/HomeHeader'

import { useAuth } from '../hooks/useAuth'
import { OccurrenceDTO } from '../dtos/OccurrenceDTO'
import { SearchBar } from '../components/SearchBar'
import { FindOcurrence } from '../components/FindOcurrence'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type ListOccurrencesScreenProps = {
  route: {
    params: {
      // any proute params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

export function ListOccurrencesScreen({
  navigation,
  route,
}: ListOccurrencesScreenProps) {
  const [cpf, setCpf] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [resultado, setResultado] = useState<any>(null)

  useEffect(() => {
    navigation.setOptions({
      title: 'Ocorrências',
    })
  }, [])

  const handleSearchTextChange = async (text: string) => {
    if (cpf === null) {
      const { data } = await api.get('/incidents')
      setSearchText(data[0])
    } else {
      const { data } = await api.get(`/incidents?cpf=${cpf}`)
      const foundData = data.find((item: { cpf: string }) => item.cpf === cpf)
      const cpfEncontrado = false // Exemplo: CPF não encontrado
      if (cpfEncontrado) {
        setResultado('CPF encontrado!')
        setSearchText(text)
      } else {
        setResultado('CPF não encontrado.')
        setSearchText(text)
      }
      console.log('Dados por cpf(Button):', foundData)
    }
  }

  const handleSearchButtonPress = async () => {
    const { data } = await api.get(`/incidents?cpf=${cpf}`)
    const foundData = data.find((item: { cpf: string }) => item.cpf === cpf)
    const cpfEncontrado = false // Exemplo: CPF não encontrado
    if (cpfEncontrado) {
      setResultado('CPF encontrado!')
    } else {
      setResultado('CPF não encontrado.')
    }
    console.log('Dados por cpf(Button):', foundData)
  }

  async function fetchOcurrences() {
    const { data } = await api.get('/incidents')
    setCpf(data[0])
  }

  useFocusEffect(
    useCallback(() => {
      fetchOcurrences()
    }, []),
  )

  return (
    <VStack flex={1}>
      <FindOcurrence navigation={navigation} />
    </VStack>
  )
}
