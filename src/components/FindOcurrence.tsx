import { Box, Center, FlatList, Text, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { api } from '../services/api'
import { OccurrenceDTO } from '../dtos/OccurrenceDTO'
import { OccurrenceCard } from './OccurrenceCard'
import { useQuery } from 'react-query'
import { ScrollView } from 'react-native-virtualized-view'
import { SearchBar } from './SearchBar'

export function FindOcurrence({ navigation }) {
  const [cpf, setCpf] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  // list occorrences
  const { data: occurrences, isLoading: occurrencesLoading } = useQuery(
    ['ListOcurrencesByCPF', searchText],
    async () => {
      const response = await api.get('/incidents?cpf=' + searchText)
      return response.data as OccurrenceDTO[]
    },
    {},
  )

  function handleOpenOcurrenceDetails(occurrenceId: string) {
    navigation.navigate('Occurrence', { occurrenceId })
  }

  function handleSearchButtonPress(): void {
    setSearchText(cpf)
  }

  return (
    <VStack>
      <SearchBar
        onChangeText={setCpf}
        onButtonPress={handleSearchButtonPress}
        value={cpf}
      />

      <ScrollView
        // style={{ marginHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          style={{ marginHorizontal: 20 }}
          data={occurrences}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Center flex={1}>
              <Text color="gray.500" textAlign="center">
                Não existem ocorrências registradas
              </Text>
            </Center>
          }
          renderItem={({ item }) => (
            <>
              <OccurrenceCard
                onPress={() => handleOpenOcurrenceDetails(item?.id.toString())}
                data={item}
              />
            </>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </ScrollView>
    </VStack>
  )
}
