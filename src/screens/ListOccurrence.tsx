import { FlatList, Heading, HStack, Text, VStack, Center } from 'native-base'
import { ScrollView } from 'react-native-virtualized-view'
import { api } from '../services/api'

import { OccurrenceCard } from '../components/OccurrenceCard'

import { Loading } from '../components/Loading'
import { OccurrenceDTO } from '../dtos/OccurrenceDTO'
import { ScreenHeader } from '../components/ScreenHeader'
import { useQuery } from 'react-query'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type ListOccurrenceScreenProps = {
  route: {
    params: {
      // any proute params
    }
  }
  navigation: NativeStackNavigationProp<any>
}

export function ListOccurrenceScreen({
  route,
  navigation,
}: ListOccurrenceScreenProps) {
  function handleOpenOcurrenceDetails(occurrenceId: string) {
    console.log('occurrence: ', occurrenceId)
    navigation.navigate('occurrence', { occurrenceId })
  }

  function handleCreateOcurrence() {
    navigation.navigate('createOccurrence')
  }

  const {
    data: occurrences,
    isLoading: isLoadingOccurrences,
    error: errorOccurrences,
  } = useQuery(
    'ListOccurrences',
    async () => {
      const response = await api.get('/incidents')
      return response.data as OccurrenceDTO[]
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Lista de Ocorrências" />

      {isLoadingOccurrences ? (
        <Loading />
      ) : (
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={10} mt={10}>
            <Heading color="blue.500" fontSize="md" fontFamily="heading">
              Número de Ocorrências:
            </Heading>

            <Text color="blue.500" fontSize="md" fontFamily="heading">
              {occurrences?.length || 0}
            </Text>
          </HStack>
        </VStack>
      )}
      <ScrollView
        style={{ marginHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={occurrences}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Center flex={1}>
              <Text color="gray.500" textAlign="center">
                Não há nenhuma ocorrência registrada
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
        {/* <Button */}
        {/*  title="Registrar Ocorrência" */}
        {/*  onPress={handleCreateOcurrence} */}
        {/*  mt={25} */}
        {/* /> */}
      </ScrollView>
    </VStack>
  )
}
